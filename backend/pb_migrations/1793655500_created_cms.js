/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  // 1. Create campaigns collection
  const campaigns = new Collection({
    "id": "pbc_campaigns_01",
    "name": "campaigns",
    "type": "base",
    "system": false,
    "listRule": "",
    "viewRule": "",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text_camp_id",
        "name": "id",
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      { "id": "text_camp_slug", "name": "slug", "type": "text", "required": true, "presentable": true },
      { "id": "text_camp_name", "name": "name", "type": "text", "required": true, "presentable": true },
      { "id": "text_camp_nav", "name": "nav_title", "type": "text", "required": false },
      { "id": "text_camp_short", "name": "short_name", "type": "text", "required": false },
      { "id": "text_camp_badge", "name": "badge", "type": "text", "required": false },
      { "id": "text_camp_tagline", "name": "tagline", "type": "text", "required": false },
      { "id": "text_camp_desc", "name": "description", "type": "text", "required": false },
      { "id": "text_camp_htitle", "name": "hero_title", "type": "text", "required": false },
      { "id": "text_camp_hsub", "name": "hero_subtitle", "type": "text", "required": false },
      { "id": "text_camp_accent", "name": "accent_color", "type": "text", "required": false },
      { "id": "text_camp_hpimg", "name": "hero_primary_image", "type": "text", "required": false },
      { "id": "text_camp_hptitle", "name": "hero_primary_title", "type": "text", "required": false },
      { "id": "text_camp_hsimg", "name": "hero_side_image", "type": "text", "required": false },
      { "id": "text_camp_hstitle", "name": "hero_side_title", "type": "text", "required": false },
      { "id": "num_camp_hsprice", "name": "hero_side_price", "type": "number", "required": false },
      { "id": "num_camp_order", "name": "order", "type": "number", "required": false },
      { "id": "bool_camp_active", "name": "is_active", "type": "bool", "required": false },
      { "id": "json_camp_tabs", "name": "filter_tabs", "type": "json", "required": false },
      { "id": "json_camp_cats", "name": "categories", "type": "json", "required": false }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_camp_slug` ON `campaigns` (`slug`)"
    ]
  });
  app.save(campaigns);

  // 2. Create site_settings collection
  const settings = new Collection({
    "id": "pbc_settings_01",
    "name": "site_settings",
    "type": "base",
    "system": false,
    "listRule": "",
    "viewRule": "",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text_sett_id",
        "name": "id",
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      { "id": "text_sett_key", "name": "key", "type": "text", "required": true, "presentable": true },
      { "id": "text_sett_wa", "name": "whatsapp_number", "type": "text", "required": false },
      { "id": "text_sett_ann", "name": "announcement_text", "type": "text", "required": false },
      { "id": "num_sett_ln", "name": "shipping_lima_norte", "type": "number", "required": false },
      { "id": "num_sett_ls", "name": "shipping_lima_sur", "type": "number", "required": false },
      { "id": "num_sett_pr", "name": "shipping_provincia_ramo", "type": "number", "required": false },
      { "id": "num_sett_pb", "name": "shipping_provincia_box", "type": "number", "required": false },
      { "id": "num_sett_adv", "name": "advance_payment_amount", "type": "number", "required": false },
      { "id": "text_sett_ig", "name": "instagram_url", "type": "text", "required": false },
      { "id": "text_sett_tt", "name": "tiktok_url", "type": "text", "required": false },
      { "id": "text_sett_fb", "name": "facebook_url", "type": "text", "required": false }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_sett_key` ON `site_settings` (`key`)"
    ]
  });
  app.save(settings);

  // 3. Add campaign column to products collection
  try {
    const products = app.findCollectionByNameOrId("pbc_products_01");
    if (products) {
      const hasCamp = products.fields.some(f => f.name === "campaign");
      if (!hasCamp) {
        products.fields.push({
          "id": "text_prod_campaign",
          "name": "campaign",
          "type": "text",
          "required": false,
          "presentable": true
        });
        app.save(products);
      }
    }
  } catch (err) {}

}, (app) => {
  try {
    const campaigns = app.findCollectionByNameOrId("pbc_campaigns_01");
    if (campaigns) app.delete(campaigns);
  } catch (_) {}

  try {
    const settings = app.findCollectionByNameOrId("pbc_settings_01");
    if (settings) app.delete(settings);
  } catch (_) {}
});
