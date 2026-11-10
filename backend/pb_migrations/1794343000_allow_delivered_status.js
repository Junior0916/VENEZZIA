/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  let collection = null;
  try {
    collection = app.findCollectionByNameOrId("orders");
  } catch (_) {
    try {
      collection = app.findCollectionByNameOrId("pbc_orders_001");
    } catch (__) {}
  }

  if (!collection) return;

  const statusField = collection.fields.getByName("status");
  if (statusField) {
    if (statusField.type === "select") {
      statusField.values = ["pending", "paid", "delivered", "delivery_pending", "partial", "cancelled"];
    } else {
      statusField.type = "text";
    }
  } else {
    collection.fields.add(new Field({
      "id": "text_ord_status",
      "name": "status",
      "type": "text",
      "required": false,
      "system": false
    }));
  }

  return app.save(collection);
}, (app) => {
  // rollback optional
})
