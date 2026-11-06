/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_settings_01")

  // add field
  collection.fields.addAt(12, new Field({
    "help": "",
    "hidden": false,
    "id": "bool675826390",
    "name": "live_active",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(13, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text2929183452",
    "max": 0,
    "min": 0,
    "name": "live_ends_at",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(14, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text3628295977",
    "max": 0,
    "min": 0,
    "name": "live_campaign",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(15, new Field({
    "help": "",
    "hidden": false,
    "id": "number298145747",
    "max": null,
    "min": null,
    "name": "live_discount_default",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(16, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text1371493396",
    "max": 0,
    "min": 0,
    "name": "live_banner_text",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_settings_01")

  // remove field
  collection.fields.removeById("bool675826390")

  // remove field
  collection.fields.removeById("text2929183452")

  // remove field
  collection.fields.removeById("text3628295977")

  // remove field
  collection.fields.removeById("number298145747")

  // remove field
  collection.fields.removeById("text1371493396")

  return app.save(collection)
})
