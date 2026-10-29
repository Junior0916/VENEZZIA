with open('frontend/src/services/pocketbase.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Define the helper right before fetchProducts
helper_and_fetch = """const PRODUCT_OPTIMIZED_ASSETS = {
  // Makeup Products (All 8 updated today from PocketBase)
  'wtflhywy1xh62su': '/products/box_basico_centered.webp',
  'cw4r0vwwapz9bwy': '/products/box_osita_dormilona_centered.webp',
  'eo4abuk5zt6urst': '/products/box_kitty_premium_centered.webp',
  '8c29i2ivnaellwc': '/products/ramo_basico_centered.webp',
  '8ecp42hmvj1g22m': '/products/ramo_1_chanchita_centered.webp',
  'u1b5w7z3y7t4pmf': '/products/ramo_2_ovejita_centered.webp',
  '4ldwj93qh60jm1n': '/products/ramo_3_kitty_centered.webp',
  '8vni5zbd1ktrqm0': '/products/ramo_premium_lotso_centered.webp',

  // Mock IDs
  'prod-box-basico': '/products/box_basico_centered.webp',
  'prod-box-osita': '/products/box_osita_dormilona_centered.webp',
  'prod-box-kitty': '/products/box_kitty_premium_centered.webp',
  'prod-ramo-basico': '/products/ramo_basico_centered.webp',
  'prod-ramo-1-chanchita': '/products/ramo_1_chanchita_centered.webp',
  'prod-ramo-2-ovejita': '/products/ramo_2_ovejita_centered.webp',
  'prod-ramo-3-kitty': '/products/ramo_3_kitty_centered.webp',
  'prod-ramo-premium-lotso': '/products/ramo_premium_lotso_centered.webp',

  // Hot Wheels Products
  'k6pb4b7yr7wtvyf': '/products/hotwheels-personalizado_centered.webp',
  'ep5euoouk0ddg0d': '/products/ramo-hotwheels-1_centered.webp',
  'tbu6ddejbimcx1j': '/products/ramo-hotwheels-2_centered.webp',
  'fgbjb7vu0j401ko': '/products/ramo-hotwheels-3_centered.webp',
  '8b6pkzn4irmxvhx': '/products/box-basico-hotwheels_centered.webp',
  'bv0ez8n5yez3qsh': '/products/box-cuadro-hotwheels_centered.webp',
  '5p4sw85g259hl1n': '/products/box-personalizado-snacks_centered.webp',
  'xw26wh4ugkky7my': '/products/box-personalizado-club_centered.webp',
  'eodijs3ju1h1p73': '/products/box-toretto-fast-furious_centered.webp',
  'ki8o8aep535a5hw': '/products/box-premium-oro-18k_centered.webp',
  'u4a9pl7xyot0scf': '/products/ramo-stitch-hotwheels_centered.webp',
  'fkaup04w28ugiic': '/products/ramo-clubes-futbol_centered.webp',
  'at700ggzd3qp5tm': '/products/ramo-spiderman-hotwheels_centered.webp',
  'tcn4yq2cb2buurn': '/products/box-superheroes-pilsen_centered.webp',
  'hso5k926u81bb7k': '/products/box-pinguino-lucifer_centered.webp',

  // Hot Wheels mock IDs
  'hw-blister-personalizado': '/products/hotwheels-personalizado_centered.webp',
  'hw-ramo-1': '/products/ramo-hotwheels-1_centered.webp',
  'hw-ramo-2': '/products/ramo-hotwheels-2_centered.webp',
  'hw-ramo-3': '/products/ramo-hotwheels-3_centered.webp',
  'hw-box-basico': '/products/box-basico-hotwheels_centered.webp',
  'hw-box-cuadro': '/products/box-cuadro-hotwheels_centered.webp',
  'hw-box-snacks': '/products/box-personalizado-snacks_centered.webp',
  'hw-box-club': '/products/box-personalizado-club_centered.webp',
  'hw-box-toretto': '/products/box-toretto-fast-furious_centered.webp',
  'hw-box-oro': '/products/box-premium-oro-18k_centered.webp',
  'hw-ramo-stitch': '/products/ramo-stitch-hotwheels_centered.webp',
  'hw-ramo-clubes': '/products/ramo-clubes-futbol_centered.webp',
  'hw-ramo-spiderman': '/products/ramo-spiderman-hotwheels_centered.webp',
  'hw-box-superheroes': '/products/box-superheroes-pilsen_centered.webp',
  'hw-box-pinguino': '/products/box-pinguino-lucifer_centered.webp'
}

function resolveProductImage(record, client) {
  // 1. Direct ID match for optimized WebP
  if (record?.id && PRODUCT_OPTIMIZED_ASSETS[record.id]) {
    return PRODUCT_OPTIMIZED_ASSETS[record.id]
  }

  // 2. Name-based match for catalog products
  const norm = (record?.name || '').toLowerCase()
  if (norm.includes('osita dormilona')) return '/products/box_osita_dormilona_centered.webp'
  if (norm.includes('kitty premium')) return '/products/box_kitty_premium_centered.webp'
  if (norm.includes('ramo 3') && norm.includes('kitty')) return '/products/ramo_3_kitty_centered.webp'
  if (norm.includes('ramo 2') && norm.includes('ovejita')) return '/products/ramo_2_ovejita_centered.webp'
  if (norm.includes('ramo 1') && norm.includes('chanchita')) return '/products/ramo_1_chanchita_centered.webp'
  if (norm.includes('ramo basico') || norm.includes('ramo básico')) return '/products/ramo_basico_centered.webp'
  if (norm.includes('box basico') || norm.includes('box básico')) return '/products/box_basico_centered.webp'
  if (norm.includes('lotso deluxe') || norm.includes('ramo premium lotso')) return '/products/ramo_premium_lotso_centered.webp'

  // Hot Wheels names
  if (norm.includes('toretto') || norm.includes('fast & furious')) return '/products/box-toretto-fast-furious_centered.webp'
  if (norm.includes('spiderman')) return '/products/ramo-spiderman-hotwheels_centered.webp'
  if (norm.includes('stitch')) return '/products/ramo-stitch-hotwheels_centered.webp'
  if (norm.includes('cuadro hot wheels')) return '/products/box-cuadro-hotwheels_centered.webp'
  if (norm.includes('superhéroes') || norm.includes('pilsen')) return '/products/box-superheroes-pilsen_centered.webp'
  if (norm.includes('pingüino') || norm.includes('lucifer')) return '/products/box-pinguino-lucifer_centered.webp'
  if (norm.includes('blister') || norm.includes('personalizado')) return '/products/hotwheels-personalizado_centered.webp'
  if (norm.includes('1 carrito')) return '/products/ramo-hotwheels-1_centered.webp'
  if (norm.includes('2 carritos')) return '/products/ramo-hotwheels-2_centered.webp'
  if (norm.includes('3 carritos')) return '/products/ramo-hotwheels-3_centered.webp'

  // 3. Fallback to client URL if user adds new custom records
  if (record?.image && client?.files?.getURL) {
    return client.files.getURL(record, record.image, { thumb: '600x750' })
  }

  return '/products/box_basico_centered.webp'
}

export async function fetchProducts() {
  const mapRecord = (record, client) => ({
    id: record.id,
    campaign: record.campaign || 'maquillaje',
    name: record.name,
    description: record.description,
    price: record.price,
    original_price: record.compare_at_price || record.original_price,
    category: record.category || 'General',
    image: resolveProductImage(record, client),
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
    // continue to remote check
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

# Find where export async function fetchProducts begins
idx = code.find('export async function fetchProducts()')
if idx != -1:
    new_code = code[:idx] + helper_and_fetch + '\n'
    with open('frontend/src/services/pocketbase.js', 'w', encoding='utf-8', newline='\n') as f:
        f.write(new_code)
    print("pocketbase.js updated successfully with fast image resolver")
else:
    print("Could not find fetchProducts in pocketbase.js")
