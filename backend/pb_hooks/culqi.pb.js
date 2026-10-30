/**
 * Culqi Payment Hook for PocketBase
 * Handles GET & POST /api/culqi/charge, GET /api/culqi/config and GET /api/culqi/sync
 */

routerAdd("GET", "/api/culqi/config", (e) => {
    const pubKey = $os.getenv("CULQI_PUBLIC_KEY") || "";
    const secKey = $os.getenv("CULQI_SECRET_KEY") || "";
    return e.json(200, {
        status: "online",
        publicKey: pubKey,
        configured: Boolean(pubKey && secKey && secKey !== "sk_test_placeholder" && secKey !== "sk_test_sample_key_here")
    });
});

routerAdd("GET", "/api/culqi/charge", (e) => {
    return e.json(200, {
        resultado: "EXITO_CONEXION_OK",
        estado: "🟢 EN LINEA Y FUNCIONANDO",
        servidor: "PocketBase Venezzia",
        mensaje: "El motor de pagos Culqi esta activo y listo para procesar cobros de la tienda.",
        como_probar: "Para probar un pago real, ingresa a la tienda https://venezzia.shop, agrega un producto a la bolsa y dale clic a 'Pagar con Tarjeta / Culqi'.",
        nota: "Este mensaje NO es un error, es la confirmacion de que tu servidor responde perfectamente con codigo 200 OK."
    });
});

/**
 * Endpoint de Sincronización Automática con Culqi
 * Recupera cualquier venta que esté en el CulqiPanel y la inserta automáticamente en PocketBase
 */
routerAdd("GET", "/api/culqi/sync", (e) => {
    try {
        const secretKey = $os.getenv("CULQI_SECRET_KEY") || "";
        if (!secretKey || secretKey.includes("placeholder") || secretKey === "sk_test_sample_key_here") {
            return e.json(400, { error: "CULQI_SECRET_KEY no está configurada en las variables de entorno" });
        }

        let ordersCollection = null;
        try {
            ordersCollection = $app.findCollectionByNameOrId("orders");
        } catch (err) {}
        if (!ordersCollection) {
            try {
                ordersCollection = $app.findCollectionByNameOrId("pedidos");
            } catch (err) {}
        }

        if (!ordersCollection) {
            return e.json(404, { error: "No se encontró la colección orders ni pedidos en PocketBase" });
        }

        // Consultar los últimos 30 cargos en Culqi
        const response = $http.send({
            method: "GET",
            url: "https://api.culqi.com/v2/charges?limit=30",
            headers: {
                "Authorization": "Bearer " + secretKey,
                "Content-Type": "application/json"
            },
            timeout: 25
        });

        const culqiData = response.json || {};
        const charges = culqiData.data || [];
        let createdCount = 0;
        let existingCount = 0;
        let errors = [];

        for (let i = 0; i < charges.length; i++) {
            const ch = charges[i];
            const chargeId = ch.id;

            // Verificar si ya existe en PocketBase por culqi_charge_id
            let existingRecord = null;
            try {
                existingRecord = $app.findFirstRecordByData(ordersCollection.id, "culqi_charge_id", chargeId);
            } catch (err) {}

            if (existingRecord) {
                existingCount++;
                continue;
            }

            // Si no existe, crearlo de forma segura
            try {
                const rec = new Record(ordersCollection);
                const clientName = (ch.outcome && ch.outcome.user_message) || (ch.metadata && ch.metadata.customer_name) || "Cliente Culqi";
                const clientPhone = (ch.metadata && ch.metadata.customer_phone) || "";
                const clientAddress = (ch.metadata && ch.metadata.customer_address) || "Compra online vía Culqi";

                rec.set("customer_name", clientName);
                rec.set("customer_email", ch.email || "");
                rec.set("customer_phone", clientPhone);
                rec.set("customer_address", clientAddress);
                rec.set("items", JSON.stringify([{ "producto": ch.description || "Compra en línea", "cantidad": 1, "subtotal": "S/ " + (ch.amount / 100).toFixed(2) }]));
                rec.set("total", ch.amount / 100);
                rec.set("currency", "PEN");
                rec.set("culqi_charge_id", chargeId);
                rec.set("status", "paid");

                $app.save(rec);
                createdCount++;
            } catch (saveErr) {
                errors.push({ id: chargeId, error: saveErr.toString() });
            }
        }

        return e.json(200, {
            status: "success",
            mensaje: "Sincronización completada con Culqi",
            cargos_en_culqi: charges.length,
            ordenes_recuperadas_nuevas: createdCount,
            ordenes_que_ya_existian: existingCount,
            errores: errors
        });
    } catch (err) {
        return e.json(500, { error: err.toString() });
    }
});

routerAdd("POST", "/api/culqi/charge", (e) => {
    try {
        let body = {};
        if (typeof e.requestInfo === "function") {
            const reqInfo = e.requestInfo();
            body = reqInfo.body || {};
        } else if (typeof $apis !== "undefined" && typeof $apis.requestInfo === "function") {
            body = $apis.requestInfo(e).data || {};
        }

        const token = body.token;
        const email = body.email;
        const amount = body.amount; // En céntimos (ej: 10.00 PEN -> 1000)
        const orderInfo = body.orderInfo || {};

        if (!token || !email || !amount) {
            return e.json(400, {
                error: "Faltan datos obligatorios (token, email, amount)"
            });
        }

        // Obtener la llave secreta desde variable de entorno o fallback
        const secretKey = $os.getenv("CULQI_SECRET_KEY") || "sk_test_placeholder";

        // Realizar la petición a Culqi
        const response = $http.send({
            method: "POST",
            url: "https://api.culqi.com/v2/charges",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + secretKey
            },
            body: JSON.stringify({
                amount: Math.round(amount),
                currency_code: "PEN",
                email: email,
                source_id: token,
                description: orderInfo.description || `Compra de ${orderInfo.customer_name || 'Cliente'} en Venezzia Detalles`
            }),
            timeout: 30
        });

        const culqiRes = response.json;

        if (response.statusCode >= 200 && response.statusCode < 300 && culqiRes.object === "charge") {
            // Guardar orden en PocketBase con multi-tier fallback ultra seguro
            let savedRecordId = "";
            let ordersCollection = null;

            try {
                ordersCollection = $app.findCollectionByNameOrId("orders");
            } catch (err) {}
            if (!ordersCollection) {
                try {
                    ordersCollection = $app.findCollectionByNameOrId("pedidos");
                } catch (err) {}
            }

            if (ordersCollection) {
                // Intento 1: Guardar con dirección enriquecida (Dedicatoria + GPS)
                try {
                    const record = new Record(ordersCollection);
                    record.set("customer_name", String(orderInfo.customer_name || "Cliente"));
                    record.set("customer_email", String(email));
                    record.set("customer_phone", String(orderInfo.customer_phone || ""));

                    let fullAddress = String(orderInfo.customer_address || "");
                    if (orderInfo.customer_notes && String(orderInfo.customer_notes).trim()) {
                        fullAddress += " | 💌 Dedicatoria: \"" + String(orderInfo.customer_notes).trim() + "\"";
                    }
                    if (orderInfo.location_url) {
                        fullAddress += " | 📍 GPS: " + String(orderInfo.location_url);
                    }
                    record.set("customer_address", fullAddress);

                    // Formato items en JSON estructurado
                    const formattedItems = (orderInfo.items || []).map(function(item) {
                        const qty = Number(item.quantity || 1);
                        const unitPrice = Number(item.price || 0);
                        return {
                            "producto": item.name || "Detalle Floral",
                            "cantidad": qty,
                            "precio_unitario": "S/ " + unitPrice.toFixed(2),
                            "subtotal": "S/ " + (unitPrice * qty).toFixed(2)
                        };
                    });
                    record.set("items", JSON.stringify(formattedItems.length ? formattedItems : (orderInfo.items || [])));

                    record.set("total", amount / 100);
                    record.set("currency", "PEN");
                    record.set("culqi_charge_id", String(culqiRes.id || ""));
                    record.set("status", "paid");

                    $app.save(record);
                    savedRecordId = record.id;
                    console.log("[Culqi] ✅ Orden guardada exitosamente en PocketBase:", record.id);
                } catch (err1) {
                    console.log("[Culqi] ⚠️ Intento 1 falló al guardar orden, ejecutando fallback básico:", err1);

                    // Intento 2: Fallback simple idéntico a la orden 1 que sabemos 100% que funciona
                    try {
                        const fallbackRecord = new Record(ordersCollection);
                        fallbackRecord.set("customer_name", String(orderInfo.customer_name || "Cliente"));
                        fallbackRecord.set("customer_email", String(email));
                        fallbackRecord.set("customer_phone", String(orderInfo.customer_phone || ""));
                        fallbackRecord.set("customer_address", String(orderInfo.customer_address || ""));
                        fallbackRecord.set("items", JSON.stringify(orderInfo.items || []));
                        fallbackRecord.set("total", amount / 100);
                        fallbackRecord.set("currency", "PEN");
                        fallbackRecord.set("culqi_charge_id", String(culqiRes.id || ""));
                        fallbackRecord.set("status", "paid");

                        $app.save(fallbackRecord);
                        savedRecordId = fallbackRecord.id;
                        console.log("[Culqi] ✅ Orden guardada con fallback básico:", fallbackRecord.id);
                    } catch (err2) {
                        console.log("[Culqi] ❌ Error crítico en fallback básico:", err2);
                    }
                }
            } else {
                console.log("[Culqi] ❌ No se encontró colección orders ni pedidos en PocketBase");
            }

            return e.json(200, {
                success: true,
                message: "Pago procesado exitosamente",
                chargeId: culqiRes.id,
                recordId: savedRecordId,
                charge: culqiRes
            });
        } else {
            let errorMsg = (culqiRes && culqiRes.user_message) || (culqiRes && culqiRes.merchant_message) || "Error al procesar el cargo con Culqi";

            // Si Culqi solicita autenticación 3DS (reto del banco o tarjeta de prueba con challenge)
            if (
                (typeof errorMsg === "string" && (errorMsg.includes("autenticar") || errorMsg.includes("autenticación"))) ||
                (culqiRes && culqiRes.action_code === "REVIEW")
            ) {
                errorMsg = "Esta tarjeta requiere autenticación adicional con el banco emisor (3D Secure). Para pruebas exitosas en entorno de test de Culqi, utiliza la tarjeta oficial de prueba sin reto: 4456 5300 0000 1005 (CVV 111, cualquier fecha futura ej: 12/28).";
            }

            return e.json(400, {
                success: false,
                error: errorMsg,
                details: culqiRes
            });
        }
    } catch (err) {
        return e.json(500, {
            error: "Error interno del servidor",
            details: err.toString()
        });
    }
});
