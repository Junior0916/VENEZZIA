/**
 * Auto-initialization of collections for Ecommerce
 */
onBootstrap((e) => {
    e.next();

    // Check if products collection exists
    try {
        $app.findCollectionByNameOrId("products");
    } catch (err) {
        // We can create collections or allow admin to create via UI
        console.log("[PocketBase] Colección 'products' lista para ser configurada o inicializada.");
    }
});
