/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_products_01")

  // add field
  collection.fields.addAt(15, new Field({
    "help": "Indica si el producto está visible en la tienda pública (true = visible, false = oculto)",
    "hidden": false,
    "id": "bool_prod_active",
    "name": "is_active",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_products_01")

  // remove field
  collection.fields.removeById("bool_prod_active")

  return app.save(collection)
})
