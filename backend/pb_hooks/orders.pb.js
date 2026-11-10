/**
 * Venezzia Orders Hook for PocketBase
 * Handles GET, POST, UPDATE, and DELETE for /api/venezzia/orders
 * Provides real-time stats, filtering, financial breakdown (adelanto, delivery, saldo)
 */

routerAdd("GET", "/api/venezzia/orders", (e) => {
    try {
        let col = null;
        try {
            col = $app.findCollectionByNameOrId("orders");
        } catch (_) {}
        if (!col) {
            try {
                col = $app.findCollectionByNameOrId("pedidos");
            } catch (_) {}
        }
        if (!col) {
            return e.json(404, { error: "Colección orders no encontrada" });
        }

        const reqQuery = (typeof e.requestInfo === "function" ? e.requestInfo().query : null) || {};
        const filterStatus = reqQuery.status || "active"; // 'all', 'active', 'pending', 'paid', 'delivered', 'hidden', 'partial'
        const searchQuery = (reqQuery.search || "").toLowerCase().trim();
        const startDate = reqQuery.startDate || "";
        const endDate = reqQuery.endDate || "";

        // Obtener todos los registros
        const records = $app.findAllRecords(col.name);

        const allParsed = [];

        for (let i = 0; i < records.length; i++) {
            const r = records[i];

            let items = [];
            let rawJson = "";
            try {
                rawJson = r.getString("items");
            } catch (_) {
                try { rawJson = JSON.stringify(r.get("items")); } catch (__) {}
            }

            if (rawJson && rawJson.trim()) {
                try {
                    items = JSON.parse(rawJson);
                } catch (_) {
                    items = [{ name: rawJson, quantity: 1, price: r.getFloat("total") || 0 }];
                }
            }

            let createdStr = "";
            try {
                createdStr = r.getDateTime("created").string();
            } catch (_) {
                try { createdStr = r.getString("created"); } catch (__) {}
            }

            let updatedStr = "";
            try {
                updatedStr = r.getDateTime("updated").string();
            } catch (_) {
                try { updatedStr = r.getString("updated"); } catch (__) {}
            }

            const deliveryCost = r.getFloat("delivery_cost") || 0;
            const advance = r.getFloat("advance") || 0;
            const rawTotal = r.getFloat("total") || 0;

            // Calcular monto de productos
            let productsTotal = 0;
            if (Array.isArray(items) && items.length > 0) {
                for (let j = 0; j < items.length; j++) {
                    const it = items[j];
                    const p = parseFloat(it.price || it.precio_unitario || it.unitPrice || 0) || 0;
                    const q = parseInt(it.quantity || it.cantidad || 1) || 1;
                    productsTotal += (p * q);
                }
            }
            if (productsTotal <= 0) {
                productsTotal = rawTotal > 0 ? rawTotal : 0;
            }

            const finalTotal = Number((productsTotal + deliveryCost).toFixed(2));
            const balance = Math.max(0, Number((finalTotal - advance).toFixed(2)));

            let status = r.getString("status") || "pending";
            const isHidden = r.getBool("hidden") || status === "hidden";

            // Si el estado es pending pero ya canceló el 100% (balance === 0), o si Culqi pagó completo
            if (status === "pending" && advance >= finalTotal && finalTotal > 0) {
                status = "paid";
            }

            const parsed = {
                id: r.id,
                created: createdStr,
                updated: updatedStr,
                customer_name: r.getString("customer_name") || "Cliente",
                customer_email: r.getString("customer_email") || "",
                customer_phone: r.getString("customer_phone") || "",
                customer_address: r.getString("customer_address") || "",
                items: items,
                products_total: Number(productsTotal.toFixed(2)),
                delivery_cost: Number(deliveryCost.toFixed(2)),
                total: Number(finalTotal.toFixed(2)),
                advance: Number(advance.toFixed(2)),
                balance: Number(balance.toFixed(2)),
                currency: r.getString("currency") || "PEN",
                status: status,
                payment_method: r.getString("payment_method") || (r.getString("culqi_charge_id") ? "culqi" : "whatsapp"),
                culqi_charge_id: r.getString("culqi_charge_id") || "",
                notes: r.getString("notes") || "",
                location_url: r.getString("location_url") || "",
                hidden: isHidden
            };

            allParsed.push(parsed);
        }

        // Ordenar por fecha descendente
        allParsed.sort((a, b) => {
            const timeA = new Date(a.created || 0).getTime();
            const timeB = new Date(b.created || 0).getTime();
            return timeB - timeA;
        });

        // Contadores globales para KPIs
        let countPending = 0;
        let countPartial = 0;
        let countPaid = 0;
        let countDelivered = 0;
        let countHidden = 0;
        let totalActive = 0;

        for (let i = 0; i < allParsed.length; i++) {
            const p = allParsed[i];
            if (p.hidden) {
                countHidden++;
            } else {
                totalActive++;
                if (p.status === "paid") {
                    countPaid++;
                } else if (p.status === "delivered") {
                    countDelivered++;
                } else if (p.advance > 0 && p.balance > 0) {
                    countPartial++;
                    countPending++;
                } else {
                    countPending++;
                }
            }
        }

        // Filtrar según query
        const filtered = allParsed.filter(o => {
            if (filterStatus === "active" && o.hidden) return false;
            if (filterStatus === "pending" && (o.status !== "pending" || o.hidden)) return false;
            if (filterStatus === "partial" && (o.advance <= 0 || o.balance <= 0 || o.hidden)) return false;
            if (filterStatus === "paid" && (o.status !== "paid" || o.hidden)) return false;
            if (filterStatus === "delivered" && (o.status !== "delivered" || o.hidden)) return false;
            if (filterStatus === "hidden" && !o.hidden) return false;

            if (searchQuery) {
                const matchName = o.customer_name.toLowerCase().includes(searchQuery);
                const matchPhone = o.customer_phone.toLowerCase().includes(searchQuery);
                const matchEmail = o.customer_email.toLowerCase().includes(searchQuery);
                const matchAddress = o.customer_address.toLowerCase().includes(searchQuery);
                const matchId = o.id.toLowerCase().includes(searchQuery);
                const matchNotes = o.notes.toLowerCase().includes(searchQuery);

                if (!matchName && !matchPhone && !matchEmail && !matchAddress && !matchId && !matchNotes) {
                    return false;
                }
            }

            if (startDate) {
                const orderDate = o.created ? o.created.substring(0, 10) : "";
                if (orderDate && orderDate < startDate) return false;
            }
            if (endDate) {
                const orderDate = o.created ? o.created.substring(0, 10) : "";
                if (orderDate && orderDate > endDate) return false;
            }

            return true;
        });

        return e.json(200, {
            status: "success",
            orders: filtered,
            stats: {
                pending: countPending,
                partial: countPartial,
                paid: countPaid,
                delivered: countDelivered,
                hidden: countHidden,
                total_active: totalActive,
                total_all: records.length
            }
        });
    } catch (err) {
        return e.json(500, { error: err.toString() });
    }
});

routerAdd("POST", "/api/venezzia/orders", (e) => {
    try {
        let col = null;
        try {
            col = $app.findCollectionByNameOrId("orders");
        } catch (_) {}
        if (!col) {
            try {
                col = $app.findCollectionByNameOrId("pedidos");
            } catch (_) {}
        }
        if (!col) {
            return e.json(404, { error: "Colección orders no encontrada" });
        }

        let body = {};
        if (typeof e.requestInfo === "function") {
            body = e.requestInfo().body || {};
        } else if (typeof $apis !== "undefined" && typeof $apis.requestInfo === "function") {
            body = $apis.requestInfo(e).data || {};
        }

        const record = new Record(col);
        record.set("customer_name", String(body.customer_name || "Cliente"));
        record.set("customer_email", String(body.customer_email || ""));
        record.set("customer_phone", String(body.customer_phone || ""));
        record.set("customer_address", String(body.customer_address || ""));

        const items = body.items || [];
        record.set("items", typeof items === "string" ? items : JSON.stringify(items));

        const total = parseFloat(body.total) || 0;
        record.set("total", total);
        record.set("currency", String(body.currency || "PEN"));
        record.set("status", String(body.status || "pending"));
        record.set("payment_method", String(body.payment_method || "whatsapp"));
        record.set("advance", parseFloat(body.advance) || 0);
        record.set("delivery_cost", parseFloat(body.delivery_cost) || 0);
        record.set("notes", String(body.notes || ""));
        record.set("location_url", String(body.location_url || ""));
        record.set("culqi_charge_id", String(body.culqi_charge_id || ""));
        record.set("hidden", false);

        $app.save(record);

        return e.json(200, {
            status: "success",
            message: "Pedido guardado exitosamente",
            id: record.id
        });
    } catch (err) {
        return e.json(500, { error: err.toString() });
    }
});

routerAdd("POST", "/api/venezzia/orders/update", (e) => {
    try {
        let col = null;
        try {
            col = $app.findCollectionByNameOrId("orders");
        } catch (_) {}
        if (!col) {
            try {
                col = $app.findCollectionByNameOrId("pedidos");
            } catch (_) {}
        }
        if (!col) {
            return e.json(404, { error: "Colección orders no encontrada" });
        }

        let body = {};
        if (typeof e.requestInfo === "function") {
            body = e.requestInfo().body || {};
        } else if (typeof $apis !== "undefined" && typeof $apis.requestInfo === "function") {
            body = $apis.requestInfo(e).data || {};
        }

        const id = body.id;
        if (!id) {
            return e.json(400, { error: "ID de pedido requerido" });
        }

        const record = $app.findRecordById(col.name, id);
        if (!record) {
            return e.json(404, { error: "Pedido no encontrado" });
        }

        if (body.status !== undefined) record.set("status", String(body.status));
        if (body.advance !== undefined) record.set("advance", parseFloat(body.advance) || 0);
        if (body.delivery_cost !== undefined) record.set("delivery_cost", parseFloat(body.delivery_cost) || 0);
        if (body.total !== undefined) record.set("total", parseFloat(body.total) || 0);
        if (body.hidden !== undefined) record.set("hidden", Boolean(body.hidden));
        if (body.notes !== undefined) record.set("notes", String(body.notes));
        if (body.customer_address !== undefined) record.set("customer_address", String(body.customer_address));
        if (body.customer_phone !== undefined) record.set("customer_phone", String(body.customer_phone));
        if (body.customer_name !== undefined) record.set("customer_name", String(body.customer_name));

        $app.save(record);

        return e.json(200, {
            status: "success",
            message: "Pedido actualizado exitosamente",
            id: record.id
        });
    } catch (err) {
        return e.json(500, { error: err.toString() });
    }
});

routerAdd("POST", "/api/venezzia/orders/delete", (e) => {
    try {
        let col = null;
        try {
            col = $app.findCollectionByNameOrId("orders");
        } catch (_) {}
        if (!col) {
            try {
                col = $app.findCollectionByNameOrId("pedidos");
            } catch (_) {}
        }
        if (!col) {
            return e.json(404, { error: "Colección orders no encontrada" });
        }

        let body = {};
        if (typeof e.requestInfo === "function") {
            body = e.requestInfo().body || {};
        } else if (typeof $apis !== "undefined" && typeof $apis.requestInfo === "function") {
            body = $apis.requestInfo(e).data || {};
        }

        const id = body.id;
        if (!id) {
            return e.json(400, { error: "ID de pedido requerido" });
        }

        const record = $app.findRecordById(col.name, id);
        if (!record) {
            return e.json(404, { error: "Pedido no encontrado" });
        }

        if (body.permanent === true) {
            $app.delete(record);
            return e.json(200, {
                status: "success",
                message: "Pedido eliminado permanentemente"
            });
        } else {
            record.set("hidden", true);
            record.set("status", "hidden");
            $app.save(record);
            return e.json(200, {
                status: "success",
                message: "Pedido ocultado / archivado exitosamente"
            });
        }
    } catch (err) {
        return e.json(500, { error: err.toString() });
    }
});
