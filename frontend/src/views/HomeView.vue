<template>
  <div>
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
      @select-product="$emit('select-product', $event)"
    />

    <!-- 4. Official Shipping & Ordering Guide -->
    <ShippingGuide />

    <!-- 5. Minimalist Newsletter -->
    <Newsletter />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import Hero from '../components/Hero.vue'
import Occasions from '../components/Occasions.vue'
import CatalogSection from '../components/CatalogSection.vue'
import ShippingGuide from '../components/ShippingGuide.vue'
import Newsletter from '../components/Newsletter.vue'
import { useCampaignStore } from '../stores/campaign'
import { useSearchStore } from '../stores/search'

const props = defineProps({
  allProducts: {
    type: Array,
    default: () => []
  }
})

defineEmits(['select-product'])

const campaignStore = useCampaignStore()
const searchStore = useSearchStore()

const activeCategory = ref(null)

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
    return props.allProducts.filter(p => {
      const matchName = p.name?.toLowerCase().includes(query)
      const matchCategory = p.category?.toLowerCase().includes(query)
      const matchDesc = p.description?.toLowerCase().includes(query)
      const matchItems = p.items_included?.some(item => item.toLowerCase().includes(query))
      return matchName || matchCategory || matchDesc || matchItems
    })
  }

  // 2. Otherwise filter by active campaign (maquillaje vs hotwheels)
  let list = props.allProducts.filter(p => {
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

onMounted(() => {
  if (window.location.hash) {
    const targetId = window.location.hash.replace('#', '')
    setTimeout(() => {
      const el = document.getElementById(targetId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }, 150)
  }
})
</script>
