<template>
  <div class="min-h-screen flex flex-col bg-[#faf7fb] selection:bg-[#b07eb4] selection:text-white font-sans text-[#27172b]">
    <!-- Navbar with Official Logos, WhatsApp, Campaign Nav & Active Search Bar (Oculto en /pedidos para evitar superposición) -->
    <Navbar
      v-if="!isOrdersRoute"
      :products="allProducts"
      @select-product="openProductModal"
    />

    <!-- Main Content Routed (Home, Términos, Políticas, Libro de Reclamaciones, Pedidos) -->
    <main class="flex-1">
      <router-view
        :all-products="allProducts"
        @select-product="openProductModal"
      />
    </main>

    <!-- Footer with Official Social & Payment Logos & INDECOPI Claims Badge (Oculto en /pedidos) -->
    <Footer v-if="!isOrdersRoute" />

    <!-- Product Detail Modal (With Catalog Card toggle, Add-on car support & Complete WhatsApp Structure) -->
    <ProductDetailModal
      v-if="selectedProductModal"
      :product="selectedProductModal"
      @close="closeProductModal"
    />

    <!-- Promotional Entry & Live Flash Popup Modal (Ripley-style high converting poster) -->
    <PromoPopupModal
      v-if="showPromoPopup && activePopupProduct"
      :product="activePopupProduct"
      @close="closePromoPopup"
      @select-product="handlePopupProductSelect"
    />

    <!-- Special Dates Entrance Popup Card (Rosatel-style, visible when TikTok live is not active) -->
    <SpecialDatesPopupModal v-if="!isOrdersRoute" />

    <!-- Special Dates Management & Registration Modal (Rosatel-style) -->
    <SpecialDatesFormModal v-if="!isOrdersRoute" />

    <!-- Floating Official WhatsApp Widget (Oculto en /pedidos para no tapar los datos de la tabla) -->
    <FloatingChat v-if="!isOrdersRoute" />

    <!-- Shopping Bag Slide-over, WhatsApp Order & Culqi Checkout (Oculto en /pedidos) -->
    <CartDrawer v-if="!isOrdersRoute" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import CartDrawer from './components/CartDrawer.vue'
import FloatingChat from './components/FloatingChat.vue'
import ProductDetailModal from './components/ProductDetailModal.vue'
import PromoPopupModal from './components/PromoPopupModal.vue'
import SpecialDatesPopupModal from './components/SpecialDatesPopupModal.vue'
import SpecialDatesFormModal from './components/SpecialDatesFormModal.vue'
import { fetchProducts, subscribeToRealtime, MOCK_PRODUCTS } from './services/pocketbase'
import { useCampaignStore } from './stores/campaign'
import { useSiteSettingsStore } from './stores/siteSettings'
import { useSpecialDatesStore } from './stores/specialDates'
import { getProductSlug, findProductBySlugOrId, isReservedRoute } from './utils/productUrl'

const route = useRoute()

// Ocultar Navbar, Footer y Chat flotante de la tienda pública cuando se esté en el Sistema de Pedidos
const isOrdersRoute = computed(() => {
  const p = route?.path || ''
  return p === '/pedidos' || p.startsWith('/pedidos') || p === '/admin/pedidos' || p === '/lista-pedidos'
})

const campaignStore = useCampaignStore()
const siteSettingsStore = useSiteSettingsStore()
const specialDatesStore = useSpecialDatesStore()

const CATALOG_CACHE_KEY = 'venezzia_catalog_cache_v2'

function getInitialProducts() {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(CATALOG_CACHE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch (_) {}
  }
  return MOCK_PRODUCTS
}

// 0ms instant display from local cache or official mock fallback
const allProducts = ref(getInitialProducts())
const selectedProductModal = ref(null)
let unsubscribeRealtime = null

function openProductModal(product) {
  selectedProductModal.value = product
  // Actualización limpia de URL con enlace amigable (ej: /CalendarioAdviento) sin recargar
  try {
    const slug = getProductSlug(product)
    const newPath = `/${slug}`
    if (window.location.pathname !== newPath) {
      window.history.replaceState(null, '', newPath)
    }
  } catch (e) {
    // fallback safe
  }

  // Registrar visualización de producto en Google Analytics 4
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'view_item', {
        currency: 'PEN',
        value: Number(product.price),
        items: [{
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          price: Number(product.price)
        }]
      })
    }
  } catch (_) {}
}

function closeProductModal() {
  selectedProductModal.value = null
  // Restaurar URL limpia a la raíz sin parámetros feos
  try {
    const currentPath = window.location.pathname
    if (currentPath !== '/' && !isReservedRoute(currentPath)) {
      window.history.replaceState(null, '', '/')
    } else {
      const url = new URL(window.location.href)
      if (url.searchParams.has('prod')) {
        url.searchParams.delete('prod')
        window.history.replaceState(null, '', url.toString())
      }
    }
  } catch (e) {
    // fallback safe
  }
}

function checkDeepLink() {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const campaignParam = urlParams.get('campaign')
    if (campaignParam && campaignStore.campaigns.some(c => c.id === campaignParam)) {
      campaignStore.setCampaign(campaignParam)
    }

    if (!allProducts.value || allProducts.value.length === 0) return

    // 1. Extraer slug amigable de la ruta (ej: /CalendarioAdviento o /p/CalendarioAdviento)
    const rawPath = window.location.pathname.replace(/^\/+|\/+$/g, '')
    let slugCandidate = null

    if (rawPath) {
      if (rawPath.startsWith('p/')) {
        slugCandidate = rawPath.slice(2)
      } else if (!isReservedRoute(rawPath)) {
        slugCandidate = rawPath.split('/')[0]
      }
    }

    // 2. Extraer parámetro antiguo ?prod=... para compatibilidad total con enlaces anteriores
    const prodParam = urlParams.get('prod')
    const identifier = slugCandidate || prodParam

    if (identifier) {
      const found = findProductBySlugOrId(identifier, allProducts.value)
      if (found) {
        if (found.campaign && found.campaign !== campaignStore.activeCampaignId) {
          campaignStore.setCampaign(found.campaign)
        }
        selectedProductModal.value = found

        // Si entró con ?prod=..., actualizar la barra de direcciones al nuevo enlace amigable y limpio
        if (prodParam && !slugCandidate) {
          const cleanSlug = getProductSlug(found)
          window.history.replaceState(null, '', `/${cleanSlug}`)
        }
      }
    }
  } catch (e) {
    // fallback safe
  }
}

async function reloadCatalog() {
  const products = await fetchProducts()
  if (products && products.length > 0) {
    allProducts.value = products
    campaignStore.setProducts(products)

    try {
      localStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify(products))
    } catch (_) {}

    // Si hay un modal abierto, refrescar sus datos en tiempo real
    if (selectedProductModal.value) {
      const fresh = products.find(p => p.id === selectedProductModal.value.id)
      if (fresh) {
        selectedProductModal.value = fresh
      }
    }
  }
}

watch(
  () => route.path,
  () => {
    checkDeepLink()
  }
)


// ==========================================
// PROMOTIONAL & LIVE FLASH ENTRY POPUP LOGIC
// ==========================================
const showPromoPopup = ref(false)
const PROMO_POPUP_SESSION_KEY = 'venezzia_promo_popup_dismissed_v1'

const activePopupProduct = computed(() => {
  if (!allProducts.value || allProducts.value.length === 0) return null

  // Custom map if admin explicitly assigned products in panel
  let customMap = {}
  try {
    const saved = localStorage.getItem('venezzia_popup_products_map')
    if (saved) customMap = JSON.parse(saved)
  } catch (_) {}

  // 1. If Live Flash dynamic is active
  if (siteSettingsStore.isLiveOfferActive) {
    const liveCamp = (siteSettingsStore.liveCampaign || 'navidad').toLowerCase()

    // 1a. If custom mapping exists for this campaign
    if (customMap[liveCamp]) {
      const matchCustom = allProducts.value.find(p => p.id === customMap[liveCamp] && p.is_active !== false)
      if (matchCustom) return matchCustom
    }

    // 1b. Check product with featured === true in live campaign
    const featuredInLive = allProducts.value.find(p => (p.campaign || '').toLowerCase() === liveCamp && p.featured === true && p.is_active !== false)
    if (featuredInLive) return featuredInLive

    // 1c. Product with live_discount > 0 in live campaign
    const discountInLive = allProducts.value.find(p => (p.campaign || '').toLowerCase() === liveCamp && p.live_discount > 0 && p.is_active !== false)
    if (discountInLive) return discountInLive

    // 1d. Special case: navidad default to Calendario de Adviento
    if (liveCamp === 'navidad') {
      const adviento = allProducts.value.find(p => p.id === 'advi2026calend' || (p.name || '').toLowerCase().includes('adviento'))
      if (adviento) return adviento
    }

    // 1e. First product in live campaign
    const firstInLive = allProducts.value.find(p => (p.campaign || '').toLowerCase() === liveCamp && p.is_active !== false)
    if (firstInLive) return firstInLive
  }

  // 2. If Live Flash is not active, resolve for active campaign
  const activeCamp = (campaignStore.activeCampaignId || 'navidad').toLowerCase()

  if (customMap[activeCamp]) {
    const matchCustom = allProducts.value.find(p => p.id === customMap[activeCamp] && p.is_active !== false)
    if (matchCustom) return matchCustom
  }

  const featuredInActive = allProducts.value.find(p => (p.campaign || '').toLowerCase() === activeCamp && p.featured === true && p.is_active !== false)
  if (featuredInActive) return featuredInActive

  if (activeCamp === 'navidad') {
    const adviento = allProducts.value.find(p => p.id === 'advi2026calend' || (p.name || '').toLowerCase().includes('adviento'))
    if (adviento) return adviento
  }

  return allProducts.value.find(p => (p.campaign || '').toLowerCase() === activeCamp && p.is_active !== false) || allProducts.value[0] || null
})

function shouldShowPromoPopup() {
  if (typeof window === 'undefined') return false

  // Never show on admin or internal operational routes
  const p = route?.path || window.location.pathname || ''
  if (
    p.startsWith('/admin') ||
    p.startsWith('/pedidos') ||
    p.startsWith('/optimizador') ||
    p.startsWith('/duplicar') ||
    p.startsWith('/libro-de-reclamaciones')
  ) {
    return false
  }

  // Don't show if user came directly to a specific product (deep link)
  if (selectedProductModal.value) {
    return false
  }

  const rawPath = p.replace(/^\/+|\/+$/g, '')
  if (rawPath && !isReservedRoute(rawPath) && findProductBySlugOrId(rawPath, allProducts.value)) {
    return false
  }

  // Check sessionStorage dismissal
  try {
    const dismissed = sessionStorage.getItem(PROMO_POPUP_SESSION_KEY)
    if (dismissed) {
      if (siteSettingsStore.isLiveOfferActive && siteSettingsStore.liveEndsAt) {
        if (dismissed === siteSettingsStore.liveEndsAt) {
          return false
        }
      } else {
        return false
      }
    }
  } catch (_) {}

  return true
}

function shouldShowSpecialDatesPopup() {
  if (typeof window === 'undefined') return false
  if (isOrdersRoute.value) return false

  const p = route?.path || window.location.pathname || ''
  if (
    p.startsWith('/admin') ||
    p.startsWith('/pedidos') ||
    p.startsWith('/optimizador') ||
    p.startsWith('/duplicar') ||
    p.startsWith('/libro-de-reclamaciones')
  ) {
    return false
  }

  // Si ya hay un producto abierto en pantalla o modal de fechas activo
  if (selectedProductModal.value || showPromoPopup.value || specialDatesStore.isModalOpen) {
    return false
  }

  return !specialDatesStore.isPopupDismissed()
}

function tryTriggerEntryPopups() {
  if (isOrdersRoute.value) return

  // 1. Si la Oferta Flash de TikTok Live está ACTIVA -> Prioridad: Popup Promocional
  if (siteSettingsStore.isLiveOfferActive) {
    if (shouldShowPromoPopup()) {
      setTimeout(() => {
        if (shouldShowPromoPopup() && activePopupProduct.value) {
          showPromoPopup.value = true
        }
      }, 900)
    }
  } else {
    // 2. Si TikTok Live NO está activo -> Popup de Fechas Especiales (Estilo Rosatel)
    if (shouldShowSpecialDatesPopup()) {
      setTimeout(() => {
        if (shouldShowSpecialDatesPopup()) {
          specialDatesStore.openPopup()
        }
      }, 1200)
    }
  }
}

function closePromoPopup() {
  showPromoPopup.value = false
  try {
    const mark = (siteSettingsStore.isLiveOfferActive && siteSettingsStore.liveEndsAt)
      ? siteSettingsStore.liveEndsAt
      : 'dismissed'
    sessionStorage.setItem(PROMO_POPUP_SESSION_KEY, mark)
  } catch (_) {}
}

function handlePopupProductSelect(product) {
  closePromoPopup()
  if (!product) return

  // 1. Activate product campaign if different
  if (product.campaign && product.campaign !== campaignStore.activeCampaignId) {
    campaignStore.setCampaign(product.campaign)
  }

  // 2. Open product modal
  openProductModal(product)

  // 3. Ensure route is cleanly set to /slug (e.g. /CalendarioAdviento)
  const slug = getProductSlug(product)
  if (slug) {
    const targetUrl = '/' + slug
    if (window.location.pathname !== targetUrl) {
      try {
        window.history.replaceState(null, '', targetUrl)
      } catch (_) {}
    }
  }
}

onMounted(() => {
  // Sync initial products immediately to campaignStore (0ms instant render)
  if (allProducts.value && allProducts.value.length > 0) {
    campaignStore.setProducts(allProducts.value)
  }

  // Load dynamic CMS settings, campaigns & fresh catalog in PARALLEL (non-blocking)
  Promise.allSettled([
    siteSettingsStore.loadSettings(),
    campaignStore.loadCampaigns(),
    reloadCatalog()
  ]).then(() => {
    checkDeepLink()
    tryTriggerEntryPopups()
  })

  // Conectar suscripción SSE en tiempo real a PocketBase
  unsubscribeRealtime = subscribeToRealtime({
    onProductsChange: async () => {
      console.log('[PB Realtime] Products updated, reloading catalog...')
      await reloadCatalog()
    },
    onCampaignsChange: async () => {
      console.log('[PB Realtime] Campaigns updated, reloading campaigns...')
      await campaignStore.loadCampaigns()
    },
    onSettingsChange: async () => {
      console.log('[PB Realtime] Site settings updated, reloading settings...')
      await siteSettingsStore.loadSettings()
    }
  })

  // Handle browser back/forward buttons
  window.addEventListener('popstate', () => {
    checkDeepLink()
  })
})

onUnmounted(() => {
  if (typeof unsubscribeRealtime === 'function') {
    unsubscribeRealtime()
  }
})
</script>
