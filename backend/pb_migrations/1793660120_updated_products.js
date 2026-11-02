/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_products_01")

  // remove field
  collection.fields.removeById("text_prod_img")

  // remove field
  collection.fields.removeById("text_prod_card")

  // add field
  collection.fields.addAt(11, new Field({
    "help": "Sube o cambia la imagen del producto desde tu computadora",
    "hidden": false,
    "id": "file_prod_image",
    "maxSelect": 1,
    "maxSize": 10485760,
    "mimeTypes": [
      "image/jpeg",
      "image/png",
      "image/svg+xml",
      "image/gif",
      "image/webp"
    ],
    "name": "image",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [
      "600x750"
    ],
    "type": "file"
  }))

  // add field
  collection.fields.addAt(12, new Field({
    "help": "Ficha técnica complementaria o foto secundaria (opcional)",
    "hidden": false,
    "id": "file_prod_card",
    "maxSelect": 1,
    "maxSize": 10485760,
    "mimeTypes": [
      "image/jpeg",
      "image/png",
      "image/svg+xml",
      "image/gif",
      "image/webp"
    ],
    "name": "catalog_card",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [
      "600x750"
    ],
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_products_01")

  // add field
  collection.fields.addAt(7, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text_prod_img",
    "max": 0,
    "min": 0,
    "name": "image",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text_prod_card",
    "max": 0,
    "min": 0,
    "name": "catalog_card",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // remove field
  collection.fields.removeById("file_prod_image")

  // remove field
  collection.fields.removeById("file_prod_card")

  return app.save(collection)
})
