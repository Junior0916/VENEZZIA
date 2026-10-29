with open('frontend/src/services/pocketbase.js', 'r', encoding='utf-8') as f:
    content = f.read()

old_head = """import PocketBase from 'pocketbase'

const POCKETBASE_URL = import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090'

export const pb = new PocketBase(POCKETBASE_URL)"""

new_head = """import PocketBase from 'pocketbase'

function getPocketBaseUrl() {
  const envUrl = import.meta.env.VITE_POCKETBASE_URL
  const isBrowser = typeof window !== 'undefined'
  const isLocalHost = isBrowser && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

  if (isBrowser && !isLocalHost) {
    return 'https://admin.venezzia.shop'
  }

  if (envUrl && (!envUrl.includes('127.0.0.1') || isLocalHost)) {
    return envUrl
  }

  return 'http://127.0.0.1:8090'
}

export const POCKETBASE_URL = getPocketBaseUrl()
export const pb = new PocketBase(POCKETBASE_URL)"""

old_fetch = """export async function fetchProducts() {
  try {
    const records = await pb.collection('products').getFullList({
      sort: '-created',
      filter: 'in_stock = true'
    })

    if (records.length === 0) {
      return MOCK_PRODUCTS
    }

    return records.map(record => ({
      id: record.id,
      campaign: record.campaign || 'maquillaje',
      name: record.name,
      description: record.description,
      price: record.price,
      original_price: record.original_price,
      category: record.category || 'General',
      image: record.image 
        ? pb.files.getURL(record, record.image, { thumb: '600x750' }) 
        : '/products/box_basico_centered.webp',
      catalog_card: record.catalog_card,
      in_stock: record.in_stock,
      items_included: record.items_included || []
    }))
  } catch (err) {
    return MOCK_PRODUCTS
  }
}"""

new_fetch = """export async function fetchProducts() {
  const mapRecord = (record, client) => ({
    id: record.id,
    campaign: record.campaign || 'maquillaje',
    name: record.name,
    description: record.description,
    price: record.price,
    original_price: record.compare_at_price || record.original_price,
    category: record.category || 'General',
    image: record.image 
      ? client.files.getURL(record, record.image, { thumb: '600x750' }) 
      : '/products/box_basico_centered.webp',
    catalog_card: record.catalog_card,
    in_stock: record.in_stock,
    items_included: record.items_included || []
  })

  try {
    const records = await pb.collection('products').getFullList({
      sort: '-created',
      filter: 'in_stock = true'
    })

    if (records && records.length > 0) {
      return records.map(r => mapRecord(r, pb))
    }
  } catch (err) {
    // continue to fallback check
  }

  // If local pb had 0 records or failed, try live remote PocketBase
  try {
    const remotePb = new PocketBase('https://admin.venezzia.shop')
    const remoteRecords = await remotePb.collection('products').getFullList({
      sort: '-created',
      filter: 'in_stock = true'
    })
    if (remoteRecords && remoteRecords.length > 0) {
      return remoteRecords.map(r => mapRecord(r, remotePb))
    }
  } catch (remoteErr) {
    // continue to mock fallback
  }

  return MOCK_PRODUCTS
}"""

# Normalize CRLF for replacement
content_norm = content.replace('\r\n', '\n')
if old_head in content_norm:
    content_norm = content_norm.replace(old_head, new_head)
    print("Replaced head successfully")
else:
    print("Could not find old_head")

if old_fetch in content_norm:
    content_norm = content_norm.replace(old_fetch, new_fetch)
    print("Replaced fetch successfully")
else:
    print("Could not find old_fetch")

with open('frontend/src/services/pocketbase.js', 'w', encoding='utf-8', newline='\n') as f:
    f.write(content_norm)
