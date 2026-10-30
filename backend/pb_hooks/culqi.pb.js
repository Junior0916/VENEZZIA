/**
 * Culqi Payment Hook for PocketBase
 * Handles GET & POST /api/culqi/charge and GET /api/culqi/config
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
