<template>
  <div class="min-h-screen flex flex-col bg-[#faf7fb] selection:bg-[#b07eb4] selection:text-white font-sans text-[#27172b]">
    <!-- Navbar with Official Logos, WhatsApp, Campaign Nav & Active Search Bar -->
    <Navbar
      :products="allProducts"
      @select-product="openProductModal"
    />

    <!-- Main Content -->
    <main class="flex-1">
      <!-- 1. Dynamic Hero Showcase (Spotlight matching active campaign) -->
      <Hero />

      <!-- 2. Dynamic Categories Row -->
      <Occasions @select-category="handleCategorySelect" />

      <!-- 3. Unified Product Catalog (Adaptive Grid, Clean 4:5 Photos, Filter Tabs & Search) -->
      <CatalogSection
        id="catalogo"
        :products="filteredProducts"
        :active-category="activeCategory"
        @select-category="handleCategorySelect"
        @clear-category="activeCategory = null"
        @select-product="openProductModal"
      />

      <!-- 4. Official Shipping & Ordering Guide -->
      <ShippingGuide />

      <!-- 5. Minimalist Newsletter -->
      <Newsletter />
    </main>

    <!-- Footer with Official Social & Payment Logos -->
    <Footer />

    <!-- Product Detail Modal (With Catalog Card toggle, Add-on car support & Complete WhatsApp Structure) -->
    <ProductDetailModal
      v-if="selectedProductModal"
      :product="selectedProductModal"
      @close="closeProductModal"
    />

    <!-- Floating Official WhatsApp Widget -->
    <FloatingChat />

    <!-- Shopping Bag Slide-over, WhatsApp Order & Culqi Checkout -->
    <CartDrawer />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import Navbar from './components/Navbar.vue'
import Hero from './components/Hero.vue'
import Occasions from './components/Occasions.vue'
import CatalogSection from './components/CatalogSection.vue'
import ShippingGuide from './components/ShippingGuide.vue'
import Newsletter from './components/Newsletter.vue'
import Footer from './components/Footer.vue'
import CartDrawer from './components/CartDrawer.vue'
import FloatingChat from './components/FloatingChat.vue'
import ProductDetailModal from './components/ProductDetailModal.vue'
import { fetchProducts } from './services/pocketbase'
import { useCampaignStore } from './stores/campaign'
import { useSearchStore } from './stores/search'

const campaignStore = useCampaignStore()
const searchStore = useSearchStore()

const allProducts = ref([])
const activeCategory = ref(null)
const selectedProductModal = ref(null)

// Reset subcategory filter when switching campaigns
watch(
  () => campaignStore.activeCampaignId,
  () => {
    activeCategory.value = null
  }
)

const filteredProducts = computed(() => {
  const query = searchStore.searchQuery.trim().toLowerCase()

  // 1. If user is actively searching, search across all products from all campaigns
  if (query.length > 0) {
    return allProducts.value.filter(p => {
      const matchName = p.name?.toLowerCase().includes(query)
      const matchCategory = p.category?.toLowerCase().includes(query)
      const matchDesc = p.description?.toLowerCase().includes(query)
      const matchItems = p.items_included?.some(item => item.toLowerCase().includes(query))
      return matchName || matchCategory || matchDesc || matchItems
    })
  }

  // 2. Otherwise filter by active campaign (maquillaje vs hotwheels)
  let list = allProducts.value.filter(p => {
    return (p.campaign || 'maquillaje') === campaignStore.activeCampaignId
  })

  // 3. Filter by category if one was selected in Occasions row
  if (activeCategory.value) {
    const term = activeCategory.value.toLowerCase()
    list = list.filter(p => {
      return (
        p.category?.toLowerCase().includes(term) ||
        p.name?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term)
      )
    })
  }

  return list
})

function handleCategorySelect(filter) {
  searchStore.clearQuery()
  if (activeCategory.value === filter) {
    activeCategory.value = null
  } else {
    activeCategory.value = filter
  }
  const el = document.getElementById('catalogo')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

function openProductModal(product) {
  selectedProductModal.value = product
  // Deep link update in browser URL without full reload
  try {
    const url = new URL(window.location.href)
    url.searchParams.set('prod', product.id)
    window.history.replaceState(null, '', url.toString())
  } catch (e) {
    // fallback safe
  }
}

function closeProductModal() {
  selectedProductModal.value = null
  // Clean URL parameter
  try {
    const url = new URL(window.location.href)
    url.searchParams.delete('prod')
    window.history.replaceState(null, '', url.toString())
  } catch (e) {
    // fallback safe
  }
}

function checkDeepLink() {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const campaignParam = urlParams.get('campaign')
    if (campaignParam && (campaignParam === 'hotwheels' || campaignParam === 'maquillaje')) {
      campaignStore.setCampaign(campaignParam)
    }

    const prodId = urlParams.get('prod')
    if (prodId && allProducts.value.length > 0) {
      const found = allProducts.value.find(p => p.id === prodId)
      if (found) {
        if (found.campaign && found.campaign !== campaignStore.activeCampaignId) {
          campaignStore.setCampaign(found.campaign)
        }
        selectedProductModal.value = found
      }
    }
  } catch (e) {
    // fallback safe
  }
}

onMounted(async () => {
  allProducts.value = await fetchProducts()
  checkDeepLink()

  // Handle browser back/forward buttons
  window.addEventListener('popstate', () => {
    checkDeepLink()
  })
})
</script>
