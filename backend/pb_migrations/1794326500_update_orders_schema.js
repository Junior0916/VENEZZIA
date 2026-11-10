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

  if (!collection) {
    collection = new Collection({
      "id": "pbc_orders_001",
      "name": "orders",
      "type": "base",
      "system": false,
      "listRule": "",
      "viewRule": "",
      "createRule": "",
      "updateRule": "",
      "deleteRule": ""
    });
  }

  const existingFieldNames = (collection.fields || []).map(f => f.name);

  const neededFields = [
    { "id": "text_ord_cname", "name": "customer_name", "type": "text" },
    { "id": "text_ord_cemail", "name": "customer_email", "type": "email" },
    { "id": "text_ord_cphone", "name": "customer_phone", "type": "text" },
    { "id": "text_ord_caddr", "name": "customer_address", "type": "text" },
    { "id": "json_ord_items", "name": "items", "type": "json" },
    { "id": "num_ord_total", "name": "total", "type": "number" },
    { "id": "text_ord_curr", "name": "currency", "type": "text" },
    { "id": "text_ord_culqi", "name": "culqi_charge_id", "type": "text" },
    { "id": "text_ord_status", "name": "status", "type": "text" },
    { "id": "num_ord_advance", "name": "advance", "type": "number" },
    { "id": "num_ord_deliv", "name": "delivery_cost", "type": "number" },
    { "id": "text_ord_pmeth", "name": "payment_method", "type": "text" },
    { "id": "text_ord_notes", "name": "notes", "type": "text" },
    { "id": "text_ord_loc", "name": "location_url", "type": "text" },
    { "id": "bool_ord_hidden", "name": "hidden", "type": "bool" }
  ];

  for (let i = 0; i < neededFields.length; i++) {
    const f = neededFields[i];
    if (existingFieldNames.indexOf(f.name) === -1) {
      collection.fields.add(new Field({
        "id": f.id,
        "name": f.name,
        "type": f.type,
        "required": false,
        "system": false
      }));
    }
  }

  return app.save(collection);
}, (app) => {
  // rollback optional
})
