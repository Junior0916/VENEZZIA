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

        // Helper para extraer números limpios sin importar si traen "S/ ", comas o texto
        function parseCleanNum(val) {
            if (val === null || val === undefined) return 0;
            if (typeof val === "number") return isNaN(val) ? 0 : val;
            const cleaned = String(val).replace(/[^0-9.-]/g, "");
            const num = parseFloat(cleaned);
            return isNaN(num) ? 0 : num;
        }

        // Obtener todos los registros
        const records = $app.findAllRecords(col.name);
        const allParsed = [];

        for (let i = 0; i < records.length; i++) {
            const r = records[i];

            // 1. Parsear Items
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

            const rawTotal = r.getFloat("total") || 0;
            const deliveryCost = r.getFloat("delivery_cost") || 0;
            let advance = r.getFloat("advance") || 0;
            let status = r.getString("status") || "pending";
            const isHidden = r.getBool("hidden") || status === "hidden";
            const culqiChargeId = r.getString("culqi_charge_id") || "";
            const paymentMethod = r.getString("payment_method") || (culqiChargeId ? "culqi" : "whatsapp");

            // 2. Normalizar cada producto de items (precios, cantidades, subtotales limpios)
            let productsTotal = 0;
            if (Array.isArray(items) && items.length > 0) {
                for (let j = 0; j < items.length; j++) {
                    const it = items[j];
                    const qty = parseInt(it.quantity || it.cantidad || 1) || 1;
                    let unitPrice = parseCleanNum(it.price !== undefined ? it.price : (it.precio_unitario !== undefined ? it.precio_unitario : it.unitPrice));
                    let sub = parseCleanNum(it.subtotal !== undefined ? it.subtotal : it.total);

                    if (unitPrice <= 0 && sub > 0 && qty > 0) {
                        unitPrice = sub / qty;
                    }
                    if (unitPrice <= 0 && items.length === 1 && rawTotal > 0) {
                        unitPrice = rawTotal / qty;
                    }
                    if (sub <= 0 && unitPrice > 0) {
                        sub = unitPrice * qty;
                    }

                    it.name = it.name || it.producto || "Detalle Floral Venezzia";
                    it.quantity = qty;
                    it.price = Number(unitPrice.toFixed(2));
                    it.subtotal = Number(sub.toFixed(2));
                    it.image = it.image || "";

                    productsTotal += it.subtotal;
                }
            }
            if (productsTotal <= 0) {
                productsTotal = rawTotal > 0 ? rawTotal : 0;
            }

            // 3. Extracción robusta de Dirección, GPS y Dedicatoria
            let rawAddress = r.getString("customer_address") || "";
            let notes = r.getString("notes") || "";
            let locationUrl = r.getString("location_url") || "";

            // Si location_url no estaba grabado por separado pero está en la dirección
            if (!locationUrl && rawAddress) {
                const gpsMatch = rawAddress.match(/https?:\/\/(?:maps\.google\.com|goo\.gl|maps\.app\.goo\.gl)[^\s|]+/);
                if (gpsMatch) {
                    locationUrl = gpsMatch[0];
                } else {
                    const gpsMatch2 = rawAddress.match(/GPS:\s*(https?:\/\/[^\s|]+)/);
                    if (gpsMatch2) locationUrl = gpsMatch2[1];
                }
            }

            // Si notes no estaba grabado por separado pero está en la dirección
            if (!notes && rawAddress) {
                const dedMatch = rawAddress.match(/Dedicatoria:\s*(?:"([^"]+)"|'([^']+)'|([^|]+))/);
                if (dedMatch) {
                    notes = (dedMatch[1] || dedMatch[2] || dedMatch[3] || "").trim();
                }
            }

            // Dirección limpia sin repeticiones de GPS ni Dedicatoria
            let cleanAddress = rawAddress
                .replace(/\|\s*GPS:[^|]+/g, "")
                .replace(/\|\s*Dedicatoria:[^|]+/g, "")
                .trim();
            if (!cleanAddress) cleanAddress = rawAddress;

            // 4. Regla Financiera Culqi & Pagado:
            // Si el cliente pagó por Culqi o el estado es 'paid' y el campo adelanto estaba en 0 (registro previo),
            // el cliente ya pagó el total de los productos.
            let effectiveAdvance = advance;
            if ((status === "paid" || paymentMethod === "culqi") && effectiveAdvance === 0 && productsTotal > 0) {
                effectiveAdvance = productsTotal;
            }

            const finalTotal = Number((productsTotal + deliveryCost).toFixed(2));
            const balance = Math.max(0, Number((finalTotal - effectiveAdvance).toFixed(2)));

            // 5. Determinar estado inteligente (Distinción de casos reales):
            // - Si status === 'delivered': ENTREGADO (se respeta estado final).
            // - Si balance <= 0: PAGADO (100% cancelado).
            // - Si balance > 0:
            //     * Si effectiveAdvance >= productsTotal y deliveryCost > 0: DELIVERY PENDIENTE
            //       (¡El arreglo floral ya está pagado! Solo falta cobrar el envío).
            //     * Si effectiveAdvance > 0: CON ADELANTO (abono parcial del producto).
            //     * Si effectiveAdvance === 0: PENDIENTE DE PAGO.
            let computedStatus = status;
            if (status !== "delivered") {
                if (balance <= 0 && finalTotal > 0) {
                    computedStatus = "paid";
                } else if (balance > 0) {
                    if (effectiveAdvance >= productsTotal && deliveryCost > 0) {
                        computedStatus = "delivery_pending";
                    } else if (effectiveAdvance > 0) {
                        computedStatus = "partial";
                    } else {
                        computedStatus = "pending";
                    }
                }
            }

            const parsed = {
                id: r.id,
                created: createdStr,
                updated: updatedStr,
                customer_name: r.getString("customer_name") || "Cliente",
                customer_email: r.getString("customer_email") || "",
                customer_phone: r.getString("customer_phone") || "",
                customer_address: cleanAddress,
                raw_address: rawAddress,
                items: items,
                products_total: Number(productsTotal.toFixed(2)),
                delivery_cost: Number(deliveryCost.toFixed(2)),
                total: Number(finalTotal.toFixed(2)),
                advance: Number(effectiveAdvance.toFixed(2)),
                balance: Number(balance.toFixed(2)),
                currency: r.getString("currency") || "PEN",
                status: computedStatus,
                raw_status: status,
                payment_method: paymentMethod,
                culqi_charge_id: culqiChargeId,
                notes: notes,
                location_url: locationUrl,
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
        let countDeliveryPending = 0;
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
                if (p.status === "delivered") {
                    countDelivered++;
                } else if (p.status === "paid" || p.balance <= 0) {
                    countPaid++;
                } else if (p.status === "delivery_pending") {
                    countDeliveryPending++;
                } else if (p.status === "partial") {
                    countPartial++;
                } else {
                    countPending++;
                }
            }
        }

        // Filtrar según query
        const filtered = allParsed.filter(o => {
            if (filterStatus === "active" && o.hidden) return false;
            if (filterStatus === "pending" && (o.status !== "pending" || o.hidden)) return false;
            if (filterStatus === "partial" && (o.status !== "partial" || o.hidden)) return false;
            if (filterStatus === "delivery_pending" && (o.status !== "delivery_pending" || o.hidden)) return false;
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
                delivery_pending: countDeliveryPending,
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

        let initialStatus = String(body.status || "pending").toLowerCase().trim();
        if (initialStatus === "delivery_pending" || initialStatus === "partial" || initialStatus === "hidden") {
            initialStatus = "pending";
        } else if (initialStatus !== "paid" && initialStatus !== "delivered" && initialStatus !== "cancelled") {
            initialStatus = "pending";
        }
        record.set("status", initialStatus);

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

        if (body.delivery_cost !== undefined) record.set("delivery_cost", parseFloat(body.delivery_cost) || 0);
        if (body.advance !== undefined) record.set("advance", parseFloat(body.advance) || 0);

        const curTotal = record.getFloat("total") || 0;
        const curDelivery = record.getFloat("delivery_cost") || 0;
        const curAdvance = record.getFloat("advance") || 0;
        const fullTotal = curTotal + curDelivery;

        if (body.status !== undefined) {
            let st = String(body.status).toLowerCase().trim();
            if (st === "hidden") {
                record.set("hidden", true);
                st = "pending";
            } else if (st === "delivery_pending" || st === "partial") {
                st = "pending";
            } else if (st !== "paid" && st !== "delivered" && st !== "cancelled") {
                st = "pending";
            }

            record.set("status", st);

            // Si se marca como pagado y el adelanto no cubre el total, igualar al total
            if (st === "paid" && curAdvance < fullTotal && fullTotal > 0) {
                record.set("advance", fullTotal);
            }
        } else {
            // Si no se envió status explícito, pero el adelanto cubre el 100% del total + delivery
            if (curAdvance >= fullTotal && fullTotal > 0 && record.getString("status") !== "delivered") {
                record.set("status", "paid");
            }
        }

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
