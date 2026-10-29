<template>
  <div class="min-h-screen flex flex-col bg-[#faf7fb] selection:bg-[#b07eb4] selection:text-white font-sans text-[#27172b]">
    <!-- Navbar with Official Logos, WhatsApp, Campaign Nav & Active Search Bar -->
    <Navbar
      :products="allProducts"
      @select-product="openProductModal"
    />

    <!-- Main Content Routed (Home, Términos, Políticas, Libro de Reclamaciones) -->
    <main class="flex-1">
      <router-view
        :all-products="allProducts"
        @select-product="openProductModal"
      />
    </main>

    <!-- Footer with Official Social & Payment Logos & INDECOPI Claims Badge -->
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
import { ref, onMounted } from 'vue'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import CartDrawer from './components/CartDrawer.vue'
import FloatingChat from './components/FloatingChat.vue'
import ProductDetailModal from './components/ProductDetailModal.vue'
import { fetchProducts } from './services/pocketbase'
import { useCampaignStore } from './stores/campaign'

const campaignStore = useCampaignStore()

const allProducts = ref([])
const selectedProductModal = ref(null)

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
  campaignStore.setProducts(allProducts.value)
  checkDeepLink()

  // Handle browser back/forward buttons
  window.addEventListener('popstate', () => {
    checkDeepLink()
  })
})
</script>
