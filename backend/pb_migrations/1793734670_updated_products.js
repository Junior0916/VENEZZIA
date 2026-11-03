/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_products_01")

  // update field
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
      "0x1200",
      "800x0",
      "600x750"
    ],
    "type": "file"
  }))

  // update field
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
      "0x1200",
      "800x0",
      "600x750"
    ],
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_products_01")

  // update field
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

  // update field
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
})
