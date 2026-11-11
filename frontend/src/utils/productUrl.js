/**
 * Utilidades para generación, normalización y resolución de enlaces amigables (slugs)
 * para los productos de Venezzia Detalles.
 *
 * Permite enlaces directos limpios y confiables como:
 *   https://venezzia.shop/CalendarioAdviento
 *   https://venezzia.shop/calendario-adviento
 *   https://venezzia.shop/box-basico-de-maquillaje
 */

export const RESERVED_ROUTES = new Set([
  '',
  'admin',
  'duplicar',
  'clonar-producto',
  'pedidos',
  'lista-pedidos',
  'sistema',
  'terminos-y-condiciones',
  'terminos',
  'terms',
  'politicas-de-cambio',
  'politicas',
  'politicas-de-devolucion',
  'devoluciones',
  'libro-de-reclamaciones',
  'reclamaciones',
  'reclamos',
  'optimizador-imagenes',
  'optimizador',
  'recortador',
  'api',
  '_',
  'assets',
  'favicon.ico',
  'robots.txt',
  'sitemap.xml'
])

/**
 * Convierte un texto a kebab-case limpio:
 * "Calendario de Adviento 2026" -> "calendario-de-adviento-2026"
 */
export function generateSlug(text) {
  if (!text) return ''
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quita tildes (á -> a, etc.)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Solo caracteres alfanuméricos y espacios
    .replace(/[\s_]+/g, '-') // Espacios a guiones
    .replace(/-+/g, '-') // Evita guiones duplicados
    .replace(/^-+|-+$/g, '') // Quita guiones iniciales o finales
}

/**
 * Normaliza cualquier slug o texto eliminando guiones, espacios y acentos:
 * "CalendarioAdviento" -> "calendarioadviento"
 * "calendario-adviento" -> "calendarioadviento"
 */
export function normalizeSlug(text) {
  if (!text) return ''
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

/**
 * Quita conectores comunes en español (de, del, la, el, los, las, y, en, para, con)
 * y colapsa a minúsculas alfanuméricas.
 * "Calendario de Adviento" -> "calendarioadviento"
 * Permite que "venezzia.shop/CalendarioAdviento" coincida exactamente con "Calendario de Adviento".
 */
export function normalizeWithoutStopWords(text) {
  if (!text) return ''
  const stopWords = new Set(['de', 'del', 'la', 'el', 'los', 'las', 'y', 'en', 'para', 'con', 'edicion', 'limitada'])
  const words = text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(w => w && !stopWords.has(w))
  return words.join('')
}

/**
 * Obtiene el slug canónico oficial de un producto.
 * Si el producto tiene `slug` definido en PocketBase, se usa ese (ej: "CalendarioAdviento").
 * Caso especial histórico: si el ID es 'advi2026calend', se usa 'CalendarioAdviento'.
 * De lo contrario, se genera a partir del nombre del producto.
 */
export function getProductSlug(product) {
  if (!product) return ''

  if (product.slug && typeof product.slug === 'string' && product.slug.trim()) {
    return product.slug.trim()
  }

  // Fallback prioritario para Calendario de Adviento
  if (product.id === 'advi2026calend' || normalizeSlug(product.name).includes('calendariodeadviento')) {
    return 'CalendarioAdviento'
  }

  return generateSlug(product.name) || product.id
}

/**
 * Retorna la URL absoluta amigable para compartir al cliente:
 * ej: "https://venezzia.shop/CalendarioAdviento"
 */
export function getProductUrl(product, origin = '') {
  if (!product) return ''
  const base = origin || (typeof window !== 'undefined' ? window.location.origin : 'https://venezzia.shop')
  const slug = getProductSlug(product)
  return `${base}/${slug}`
}

/**
 * Verifica si una ruta es una palabra clave reservada del sistema
 */
export function isReservedRoute(path) {
  if (!path) return true
  const clean = path.replace(/^\/+|\/+$/g, '').toLowerCase().split('/')[0]
  return RESERVED_ROUTES.has(clean)
}

/**
 * Busca de forma inteligente y resiliente un producto dentro de la lista por slug, id o coincidencia fonética.
 * Soporta:
 *  - "CalendarioAdviento"
 *  - "calendario-adviento"
 *  - "advi2026calend"
 *  - "advi2026calend" (vía ?prod=...)
 */
export function findProductBySlugOrId(identifier, products = []) {
  if (!identifier || !Array.isArray(products) || products.length === 0) {
    return null
  }

  const raw = identifier.toString().trim().replace(/^\/+|\/+$/g, '')
  if (!raw || isReservedRoute(raw)) return null

  // 1. Coincidencia exacta por ID
  const byId = products.find(p => p.id && p.id.toLowerCase() === raw.toLowerCase())
  if (byId) return byId

  // 2. Coincidencia exacta por campo `slug`
  const byExactSlug = products.find(p => p.slug && p.slug.toLowerCase() === raw.toLowerCase())
  if (byExactSlug) return byExactSlug

  // 3. Coincidencia por kebab-case generado (ej: "calendario-de-adviento")
  const rawKebab = generateSlug(raw)
  const byKebab = products.find(p => {
    const pSlug = p.slug ? generateSlug(p.slug) : ''
    const pNameSlug = generateSlug(p.name)
    return pSlug === rawKebab || pNameSlug === rawKebab
  })
  if (byKebab) return byKebab

  // 4. Coincidencia normalizada sin guiones (ej: "CalendarioAdviento" === "calendario-adviento")
  const rawNorm = normalizeSlug(raw)
  const byNorm = products.find(p => {
    const pSlugNorm = p.slug ? normalizeSlug(p.slug) : ''
    const pNameNorm = normalizeSlug(p.name)
    return pSlugNorm === rawNorm || pNameNorm === rawNorm
  })
  if (byNorm) return byNorm

  // 5. Coincidencia eliminando palabras conectoras ("de", "la", "el", etc.)
  const rawNoStop = normalizeWithoutStopWords(raw)
  const byNoStop = products.find(p => {
    const pSlugNo = p.slug ? normalizeWithoutStopWords(p.slug) : ''
    const pNameNo = normalizeWithoutStopWords(p.name)
    const pCatNo = normalizeWithoutStopWords(p.category)
    return pSlugNo === rawNoStop || pNameNo === rawNoStop || pCatNo === rawNoStop
  })
  if (byNoStop) return byNoStop

  // 6. Contención mutua (ej: el slug contiene palabras clave principales)
  if (rawNorm.length >= 5) {
    const byInclusion = products.find(p => {
      const pNameNorm = normalizeSlug(p.name)
      const pCatNorm = normalizeSlug(p.category)
      return pNameNorm.includes(rawNorm) || rawNorm.includes(pNameNorm) || pCatNorm.includes(rawNorm)
    })
    if (byInclusion) return byInclusion
  }

  return null
}
