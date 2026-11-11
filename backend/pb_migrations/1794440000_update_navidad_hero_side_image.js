/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  // 1. Actualizar imagen destacada en la campaña Navidad
  try {
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
      camp.set("hero_side_image", "/products/ramo-nochebuena-rosas_centered.webp");
      camp.set("hero_side_title", "Ramo Nochebuena con Rosas Eternas");
      camp.set("hero_side_price", 85);

      const rawCats = camp.get("categories");
      let cats = [];
      if (typeof rawCats === "string") {
        try { cats = JSON.parse(rawCats); } catch (_) {}
      } else if (Array.isArray(rawCats)) {
        cats = rawCats;
      }

      if (Array.isArray(cats)) {
        const updatedCats = cats.map(c => {
          if (c.name === "Ramos Nochebuena" || (c.image && c.image.includes("ramo-pinguino"))) {
            return Object.assign({}, c, { image: "/products/ramo-nochebuena-rosas_centered.webp" });
          }
          return c;
        });
        camp.set("categories", updatedCats);
      }

      app.save(camp);
    }
  } catch (err) {
    console.log("Error al actualizar campaña navidad:", err);
  }

  // 2. Asegurar que los productos de nochebuena tengan imagen asignada si están vacíos
  const navidadProdImages = {
    "navi001boxnoche": "/products/box-pinguino-lucifer_centered.webp",
    "navi002ramorosas": "/products/ramo-nochebuena-rosas_centered.webp",
    "navi004ramonieve": "/products/ramo-nochebuena-rosas_centered.webp"
  };

  for (const [prodId, imgPath] of Object.entries(navidadProdImages)) {
    try {
      const prod = app.findRecordById("products", prodId);
      if (prod && !prod.getString("image")) {
        prod.set("image", imgPath);
        app.save(prod);
      }
    } catch (_) {}
  }
}, (app) => {
  // rollback opcional
});
