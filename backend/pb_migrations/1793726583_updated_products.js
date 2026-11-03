/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_products_01")

  // remove field
  collection.fields.removeById("json_prod_items")

  // add field
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
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_products_01")

  // add field
  collection.fields.addAt(9, new Field({
    "help": "",
    "hidden": false,
    "id": "json_prod_items",
    "maxSize": 0,
    "name": "items_included",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // remove field
  collection.fields.removeById("text_prod_items")

  return app.save(collection)
})
