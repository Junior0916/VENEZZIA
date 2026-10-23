/**
 * Culqi Payment Hook for PocketBase
 * Handles POST /api/culqi/charge
 */

routerAdd("POST", "/api/culqi/charge", (e) => {
    try {
        const body = $apis.requestInfo(e).data;
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
                currency_code: orderInfo.currency || "PEN",
                email: email,
                source_id: token,
                description: orderInfo.description || "Compra en OnePage Ecommerce"
            }),
            timeout: 30
        });

        const culqiRes = response.json;

        if (response.statusCode >= 200 && response.statusCode < 300 && culqiRes.object === "charge") {
            // Guardar orden en PocketBase si la colección "orders" existe
            try {
                const ordersCollection = $app.findCollectionByNameOrId("orders");
                if (ordersCollection) {
                    const record = new Record(ordersCollection);
                    record.set("customer_name", orderInfo.customer_name || "");
                    record.set("customer_email", email);
                    record.set("customer_phone", orderInfo.customer_phone || "");
                    record.set("customer_address", orderInfo.customer_address || "");
                    record.set("items", JSON.stringify(orderInfo.items || []));
                    record.set("total", amount / 100);
                    record.set("currency", orderInfo.currency || "PEN");
                    record.set("culqi_charge_id", culqiRes.id || "");
                    record.set("status", "paid");
                    $app.save(record);
                }
            } catch (err) {
                // Log warning but continue
                console.log("[Culqi] Error al guardar orden:", err);
            }

            return e.json(200, {
                success: true,
                message: "Pago procesado exitosamente",
                chargeId: culqiRes.id,
                charge: culqiRes
            });
        } else {
            return e.json(400, {
                success: false,
                error: culqiRes.user_message || culqiRes.merchant_message || "Error al procesar el cargo con Culqi",
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
