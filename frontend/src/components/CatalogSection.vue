<template>
  <section id="catalogo" class="py-14 sm:py-20 bg-[#faf7fb]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header (Clean, Editorial, High-end) -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-[#eedee9]">
        <div>
          <span
            class="text-xs uppercase tracking-widest font-semibold block mb-1 transition-colors"
            :class="campaignStore.activeCampaignId === 'hotwheels' ? 'text-[#c22b38]' : 'text-[#965e9b]'"
          >
            {{ campaignStore.activeCampaign.badge }}
          </span>
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#27172b] tracking-tight">
            {{ isSearching ? `Resultados de Búsqueda` : campaignStore.activeCampaign.name }}
          </h2>
          <p class="text-xs sm:text-sm text-gray-500 mt-1 max-w-xl">
            {{ isSearching ? `Mostrando ${filteredProducts.length} detalle(s) para "${searchStore.searchQuery}"` : campaignStore.activeCampaign.description }}
          </p>
        </div>

        <!-- Dynamic Category Filter Tabs (Hidden if search query is active) -->
        <div v-if="!isSearching" class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar shrink-0">
          <button
            v-for="tab in currentFilterTabs"
            :key="tab.value"
            @click="handleTabClick(tab.value)"
            :class="[
              'px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap',
              selectedTab === tab.value
                ? (campaignStore.activeCampaignId === 'hotwheels' ? 'bg-[#c22b38] text-white shadow-xs' : 'bg-gradient-to-r from-[#27172b] to-[#401f46] text-white shadow-xs border border-[#caa35f]/50')
                : 'bg-white text-gray-700 hover:text-[#965e9b] hover:bg-[#f6eef8] border border-[#eedee9]'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Search Active Pill with Clear Action -->
        <div v-else class="flex items-center gap-2 shrink-0">
          <div class="px-3.5 py-1.5 rounded-full bg-white border border-[#eedee9] text-xs font-medium text-gray-700 flex items-center gap-2 shadow-2xs">
            <span>Buscando: <strong>"{{ searchStore.searchQuery }}"</strong></span>
            <button
              @click="clearSearch"
              class="text-gray-400 hover:text-gray-700 p-0.5 rounded-full hover:bg-gray-100 cursor-pointer"
              title="Borrar búsqueda"
            >
              <X class="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            @click="clearSearch"
            class="px-4 py-1.5 rounded-full bg-[#27172b] hover:bg-[#caa35f] hover:text-[#27172b] text-white text-xs font-semibold transition-colors cursor-pointer border border-[#caa35f]/40"
          >
            Ver Catálogo Completo
          </button>
        </div>
      </div>

      <!-- Specific Collection / Character Tag Pill if active -->
      <div v-if="activeCategory && !selectedTab && !isSearching" class="mb-6 flex items-center gap-2">
        <span class="text-xs text-gray-500">Filtrando por colección:</span>
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f6eef8] border border-[#e8d5ec] text-xs font-semibold text-[#753d77] shadow-2xs">
          <span>{{ activeCategory }}</span>
          <button
            @click="clearCategoryFilter"
            class="p-0.5 hover:bg-white rounded-full text-[#753d77] cursor-pointer transition-colors"
            title="Quitar filtro de colección"
          >
            <X class="w-3 h-3" />
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredProducts.length === 0" class="text-center py-16 bg-white rounded-3xl border border-[#eedee9] p-8 shadow-xs">
        <div class="w-12 h-12 rounded-full bg-[#f8f1fa] text-[#965e9b] flex items-center justify-center mx-auto mb-3">
          <Search class="w-6 h-6" />
        </div>
        <h3 class="text-base font-serif font-bold text-gray-900 mb-1">
          No se encontraron detalles
        </h3>
        <p class="text-xs text-gray-500 max-w-sm mx-auto mb-5">
          {{ isSearching ? `No encontramos coincidencias para "${searchStore.searchQuery}". Intenta con palabras clave como kitty, ramo, box, toretto o rosas.` : `No hay productos disponibles en esta categoría.` }}
        </p>
        <button
          @click="resetFilters"
          class="px-6 py-2.5 rounded-full bg-[#27172b] hover:bg-[#caa35f] hover:text-[#27172b] text-white text-xs font-semibold transition-colors cursor-pointer border border-[#caa35f]/40"
        >
          Ver Todos los Productos
        </button>
      </div>

      <!-- Uniform Centered Product Grid -->
      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
          @select-product="$emit('select-product', $event)"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Search, X } from 'lucide-vue-next'
import ProductCard from './ProductCard.vue'
import { useCampaignStore } from '../stores/campaign'
import { useSearchStore } from '../stores/search'

const props = defineProps({
  products: {
    type: Array,
    default: () => []
  },
  activeCategory: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['select-product', 'select-category', 'clear-category'])

const campaignStore = useCampaignStore()
const searchStore = useSearchStore()

const isSearching = computed(() => {
  return searchStore.searchQuery.trim().length > 0
})

const currentFilterTabs = computed(() => {
  return campaignStore.activeCampaign.filterTabs || [{ label: 'Todos', value: 'all' }]
})

const selectedTab = computed(() => {
  if (!props.activeCategory) return 'all'
  const tabExists = currentFilterTabs.value.some(t => t.value === props.activeCategory)
  return tabExists ? props.activeCategory : null
})

const filteredProducts = computed(() => {
  return props.products
})

function handleTabClick(val) {
  if (val === 'all') {
    emit('clear-category')
  } else {
    emit('select-category', val)
  }
}

function clearCategoryFilter() {
  emit('clear-category')
}

function clearSearch() {
  searchStore.clearQuery()
  emit('clear-category')
}

function resetFilters() {
  searchStore.clearQuery()
  emit('clear-category')
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
