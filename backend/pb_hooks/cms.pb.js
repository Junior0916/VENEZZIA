/**
 * Venezzia CMS Hook for PocketBase
 * Exposes GET /api/venezzia/modules and auto-provisions collections & default records
 */

routerAdd("GET", "/api/venezzia/modules", (e) => {
    let campaigns = [];
    let settings = null;

    try {
        let col = null;
        try {
            col = $app.findCollectionByNameOrId("campaigns");
        } catch (_) {}

        if (col) {
            const records = $app.findAllRecords("campaigns");
            campaigns = records.map(r => ({
                id: r.getString("slug") || r.id,
                slug: r.getString("slug"),
                name: r.getString("name"),
                navTitle: r.getString("nav_title") || r.getString("name"),
                shortName: r.getString("short_name") || r.getString("name"),
                badge: r.getString("badge"),
                tagline: r.getString("tagline"),
                description: r.getString("description"),
                heroTitle: r.getString("hero_title"),
                heroSubtitle: r.getString("hero_subtitle"),
                accentColor: r.getString("accent_color") || "#965e9b",
                heroPrimaryImage: r.getString("hero_primary_image"),
                heroPrimaryTitle: r.getString("hero_primary_title"),
                heroSideImage: r.getString("hero_side_image"),
                heroSideTitle: r.getString("hero_side_title"),
                heroSidePrice: r.getInt("hero_side_price") || 0,
                order: r.getInt("order") || 99,
                isActive: r.getBool("is_active"),
                filterTabs: (() => {
                    try { return JSON.parse(r.getString("filter_tabs") || "[]"); } catch(_) { return []; }
                })(),
                categories: (() => {
                    try { return JSON.parse(r.getString("categories") || "[]"); } catch(_) { return []; }
                })()
            })).filter(c => c.isActive !== false);

            campaigns.sort((a, b) => (a.order || 99) - (b.order || 99));
        }
    } catch (campErr) {
        console.log("[Venezzia CMS] Error al leer campañas:", campErr);
    }

    try {
        let setCol = null;
        try {
            setCol = $app.findCollectionByNameOrId("site_settings");
        } catch (_) {}

        if (setCol) {
            const settRecs = $app.findAllRecords("site_settings");
            if (settRecs && settRecs.length > 0) {
                const s = settRecs[0];
                settings = {
                    whatsappNumber: s.getString("whatsapp_number") || "51932449996",
                    announcementText: s.getString("announcement_text") || "Atención personalizada inmediata y despachos coordinados en todo el Perú",
                    shippingLimaNorte: s.getInt("shipping_lima_norte") || 10,
                    shippingLimaSur: s.getInt("shipping_lima_sur") || 15,
                    shippingProvinciaRamo: s.getInt("shipping_provincia_ramo") || 5,
                    shippingProvinciaBox: s.getInt("shipping_provincia_box") || 3,
                    advancePaymentAmount: s.getInt("advance_payment_amount") || 30,
                    instagramUrl: s.getString("instagram_url") || "https://instagram.com",
                    tiktokUrl: s.getString("tiktok_url") || "https://www.tiktok.com/@venezzia.detalles",
                    facebookUrl: s.getString("facebook_url") || "https://facebook.com"
                };
            }
        }
    } catch (settErr) {
        console.log("[Venezzia CMS] Error al leer configuración:", settErr);
    }

    return e.json(200, {
        status: "ok",
        campaigns: campaigns,
        settings: settings
    });
});
