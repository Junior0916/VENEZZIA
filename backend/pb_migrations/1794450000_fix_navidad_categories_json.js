/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  try {
    const defaultNavidadCats = [
      { name: "Calendario Adviento", filter: "Calendario", image: "/products/calendario-de-adviento-2026.webp" },
      { name: "Boxes Navideños", filter: "Boxes", image: "/products/box-pinguino-lucifer_centered.webp" },
      { name: "Ramos Nochebuena", filter: "Ramos", image: "/products/ramo-nochebuena-rosas_centered.webp" },
      { name: "Peluches Festivos", filter: "Peluche", image: "/products/ramo_premium_lotso_centered.webp" },
      { name: "Chocolates & Brindis", filter: "Chocolates", image: "/products/box_osita_dormilona_centered.webp" },
      { name: "Luces & Detalles", filter: "Luces", image: "/products/box-premium-oro-18k_centered.webp" }
    ];

    let camp = null;
    try {
      camp = app.findRecordById("campaigns", "navidad0000000");
    } catch (_) {
      try {
        const records = app.findRecordsByFilter("campaigns", "slug = 'navidad'", "-created", 1);
        if (records && records.length > 0) camp = records[0];
      } catch (__) {}
    }

    if (camp) {
      camp.set("categories", JSON.stringify(defaultNavidadCats));
      camp.set("hero_side_image", "/products/ramo-nochebuena-rosas_centered.webp");
      camp.set("hero_side_title", "Ramo Nochebuena con Rosas Eternas");
      camp.set("hero_side_price", 85);
      app.save(camp);
      console.log("Successfully fixed navidad categories json");
    }
  } catch (err) {
    console.log("Error fixing navidad categories:", err);
  }
}, (app) => {
  // rollback
});
