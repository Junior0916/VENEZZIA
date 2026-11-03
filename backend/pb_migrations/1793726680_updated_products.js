/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_products_01")

  // update field
  collection.fields.addAt(9, new Field({
    "autogeneratePattern": "",
    "help": "Lista de artículos incluidos. Escribe cada detalle en una nueva línea (uno por renglón)",
    "hidden": false,
    "id": "text_prod_items",
    "max": 0,
    "min": 0,
    "name": "items_included",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_products_01")

  // update field
  collection.fields.addAt(9, new Field({
    "autogeneratePattern": "",
    "help": "Lista de articulos incluidos. Escribe cada detalle en una nueva linea (uno por renglon)",
    "hidden": false,
    "id": "text_prod_items",
    "max": 0,
    "min": 0,
    "name": "items_included",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
})
