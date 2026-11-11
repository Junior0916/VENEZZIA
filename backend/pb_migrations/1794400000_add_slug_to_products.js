/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_products_01")

  // Check if field already exists
  const existing = collection.fields.getByName("slug")
  if (!existing) {
    collection.fields.addAt(16, new Field({
      "autogeneratePattern": "",
      "help": "Enlace amigable para compartir (ej: CalendarioAdviento o box-hotwheels)",
      "hidden": false,
      "id": "text_prod_slug",
      "max": 100,
      "min": 0,
      "name": "slug",
      "pattern": "",
      "presentable": false,
      "primaryKey": false,
      "required": false,
      "system": false,
      "type": "text"
    }))
    app.save(collection)
  }

  // Set default friendly slug for Calendario de Adviento
  try {
    const record = app.findRecordById("products", "advi2026calend")
    if (record) {
      record.set("slug", "CalendarioAdviento")
      app.save(record)
    }
  } catch (_) {}
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("pbc_products_01")
    collection.fields.removeById("text_prod_slug")
    return app.save(collection)
  } catch (_) {}
})
