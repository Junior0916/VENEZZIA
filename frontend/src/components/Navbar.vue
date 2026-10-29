<template>
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#eedee9]/80 shadow-[0_4px_24px_-10px_rgba(154,104,155,0.08)]">
    <!-- Top Utility Announcement Bar (Soft Lilac Mist & Champagne Gold Accents) -->
    <div class="border-b border-[#eedee9] bg-gradient-to-r from-[#faf5fc] via-[#fbf7fd] to-[#f8f1fa] text-[11px] text-gray-500 py-1.5 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <!-- Social Icons with Official Brand Logos -->
        <div class="flex items-center gap-3 sm:gap-4">
          <div class="flex items-center gap-3 text-gray-400">
            <!-- Official WhatsApp Logo -->
            <a
              href="https://wa.me/51932449996?text=Hola%20Venezzia%20Detalles,%20quisiera%20hacer%20un%20pedido"
              target="_blank"
              rel="noopener noreferrer"
              class="text-[#25D366] hover:scale-115 transition-transform flex items-center"
              title="Escríbenos a WhatsApp (+51 932 449 996)"
            >
              <IconWhatsApp customClass="w-3.5 h-3.5" />
            </a>

            <!-- Official Instagram Logo -->
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              class="text-[#E4405F] hover:scale-115 transition-transform flex items-center"
              title="Síguenos en Instagram"
            >
              <IconInstagram customClass="w-3.5 h-3.5" />
            </a>

            <!-- Official TikTok Logo -->
            <a
              href="https://www.tiktok.com/@venezzia.detalles"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-900 hover:text-black hover:scale-115 transition-transform flex items-center"
              title="Síguenos en TikTok (@venezzia.detalles)"
            >
              <IconTikTok customClass="w-3.5 h-3.5" />
            </a>
          </div>

          <span class="text-[#e2cee0]">|</span>

          <!-- Country Indicator -->
          <div class="flex items-center gap-1.5 font-medium text-gray-700">
            <span class="inline-block w-4 h-2.5 bg-red-600 rounded-xs relative overflow-hidden shadow-2xs">
              <span class="absolute inset-y-0 left-1.5 w-1 bg-white"></span>
            </span>
            <span>PE</span>
          </div>

          <span class="hidden sm:inline text-[#e2cee0]">|</span>

          <!-- Direct WhatsApp Hotline -->
          <a
            href="https://wa.me/51932449996?text=Hola%20Venezzia%20Detalles,%20quisiera%20hacer%20un%20pedido"
            target="_blank"
            rel="noopener noreferrer"
            class="hidden sm:inline-flex items-center gap-1.5 text-gray-600 hover:text-emerald-700 font-medium group transition-colors"
          >
            <IconWhatsApp customClass="w-3.5 h-3.5 text-[#25D366] group-hover:scale-110 transition-transform" />
            <span>Atención Inmediata: <strong class="text-gray-900 font-semibold">+51 932 449 996</strong></span>
          </a>
        </div>

        <!-- Right: Active Campaign Indicator & Currency -->
        <div class="flex items-center gap-3">
          <span class="hidden md:inline text-[11px] font-medium tracking-wide" :class="campaignStore.activeCampaignId === 'hotwheels' ? 'text-[#c22b38]' : 'text-[#965e9b]'">
            {{ campaignStore.activeCampaign.badge }}
          </span>
          <div class="flex items-center gap-1 font-semibold text-gray-700 bg-white/90 px-2.5 py-0.5 rounded-full border border-[#eedee9] text-[10px] shadow-2xs">
            <span class="text-[#caa35f] font-bold">PEN</span>
            <span>S/</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Navigation Bar -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3">
      <div class="flex items-center justify-between gap-4">
        <!-- Left: Brand Logo — Nombre izquierda, Isotipo derecha -->
        <router-link to="/" class="flex items-center gap-2.5 group shrink-0" title="Venezzia Detalles">
          <!-- Nombre de marca en lila sin fondo -->
          <img
            src="/marca_lila.png"
            alt="Venezzia Detalles"
            class="h-10 sm:h-13 w-auto object-contain group-hover:opacity-85 transition-opacity duration-300"
          />
          <!-- Isotipo en lila sin fondo -->
          <img
            src="/isotipo_lila.png"
            alt="Venezzia Isotipo"
            class="h-9 sm:h-11 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </router-link>

        <!-- Center: Special Campaign Dates Navigation Menu -->
        <nav class="hidden lg:flex items-center gap-1.5 xl:gap-2">
          <!-- Campaign 1: Día de Regalar Maquillaje -->
          <button
            @click="selectCampaign('maquillaje')"
            :class="[
              'px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer flex items-center',
              campaignStore.activeCampaignId === 'maquillaje'
                ? 'bg-gradient-to-r from-[#27172b] to-[#401f46] text-white shadow-xs border border-[#caa35f]/50 ring-1 ring-[#caa35f]/20'
                : 'text-gray-700 hover:text-[#965e9b] hover:bg-[#f6eef8]'
            ]"
          >
            <span>Día del Maquillaje</span>
          </button>

          <!-- Campaign 2: Día de Regalar Hot Wheels -->
          <button
            @click="selectCampaign('hotwheels')"
            :class="[
              'px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer flex items-center',
              campaignStore.activeCampaignId === 'hotwheels'
                ? 'bg-[#c22b38] text-white shadow-xs border border-red-400/40'
                : 'text-gray-700 hover:text-[#c22b38] hover:bg-[#fff1f2]'
            ]"
          >
            <span>Día Hot Wheels</span>
          </button>

          <!-- Dropdown: Más Fechas Especiales -->
          <div class="relative group">
            <button
              class="px-3 py-1.5 rounded-full text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Fechas Especiales</span>
              <ChevronDown class="w-3.5 h-3.5 text-gray-400 group-hover:rotate-180 transition-transform duration-200" />
            </button>

            <!-- Dropdown Menu -->
            <div class="absolute left-0 mt-1 w-60 bg-white rounded-2xl shadow-xl border border-[#eedee9] py-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 z-50">
              <div class="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100">
                Selecciona una fecha especial
              </div>
              <button
                @click="selectCampaign('maquillaje')"
                class="w-full text-left px-3.5 py-2.5 text-xs text-gray-700 hover:bg-[#f6eef8] hover:text-[#965e9b] flex items-center justify-between transition-colors cursor-pointer"
              >
                <span class="font-medium">Día de Regalar Maquillaje</span>
                <span v-if="campaignStore.activeCampaignId === 'maquillaje'" class="text-[10px] font-bold text-[#caa35f]">
                  ● Activo
                </span>
              </button>
              <button
                @click="selectCampaign('hotwheels')"
                class="w-full text-left px-3.5 py-2.5 text-xs text-gray-700 hover:bg-[#fff1f2] hover:text-[#c22b38] flex items-center justify-between transition-colors cursor-pointer"
              >
                <span class="font-medium">Día de Regalar Hot Wheels</span>
                <span v-if="campaignStore.activeCampaignId === 'hotwheels'" class="text-[10px] font-bold text-[#c22b38]">
                  ● Activo
                </span>
              </button>
              <div class="px-3.5 py-2 text-[10px] text-gray-400 border-t border-gray-100">
                <span>Próximamente nuevas fechas</span>
              </div>
            </div>
          </div>

          <button
            @click="navigateToSection('envios')"
            class="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-[#965e9b] transition-colors cursor-pointer"
          >
            Envíos
          </button>
        </nav>

        <!-- Right: Active Search Input, Official WhatsApp Button & Shopping Bag -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Desktop Search Input with Real-time Auto-complete -->
          <div ref="desktopSearchContainer" class="relative hidden sm:block w-48 md:w-60 lg:w-72">
            <input
              type="text"
              v-model="searchQuery"
              @focus="onSearchFocus"
              @keydown.enter="handleSearchSubmit"
              @keydown.esc="searchStore.closeDropdown"
              placeholder="Buscar ramos, kitty, hot wheels..."
              class="w-full bg-[#f8f2f9] hover:bg-white focus:bg-white text-xs pl-8 pr-7 py-2 rounded-full border border-[#ecdbe8] focus:border-[#caa35f] focus:outline-none focus:ring-2 focus:ring-[#caa35f]/15 transition-all placeholder-gray-400"
            />
            <Search class="w-3.5 h-3.5 text-[#caa35f] absolute left-3 top-1/2 -translate-y-1/2" />
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
              title="Limpiar búsqueda"
            >
              <X class="w-3.5 h-3.5" />
            </button>

            <!-- Search Auto-complete Live Dropdown -->
            <div
              v-if="searchStore.isDropdownOpen && searchQuery.trim().length > 0"
              class="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-[#eedee9] overflow-hidden z-50 max-h-80 overflow-y-auto"
            >
              <div class="p-2.5 border-b border-gray-100 bg-[#fbf7fc] flex items-center justify-between text-[11px] text-gray-500 font-medium">
                <span>Resultados ({{ searchResults.length }})</span>
                <button
                  @click="searchStore.closeDropdown"
                  class="text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
                >
                  <X class="w-3.5 h-3.5" />
                </button>
              </div>

              <!-- List of matching items -->
              <div v-if="searchResults.length > 0" class="divide-y divide-gray-100">
                <div
                  v-for="item in searchResults.slice(0, 6)"
                  :key="item.id"
                  @click="selectProductResult(item)"
                  class="p-2.5 hover:bg-[#faf4f8] transition-colors cursor-pointer flex items-center gap-3"
                >
                  <img
                    :src="item.image"
                    :alt="item.name"
                    class="w-10 h-10 rounded-xl object-contain bg-[#fbf7fc] border border-[#eedee9] p-1 shrink-0"
                  />
                  <div class="flex-1 min-w-0 text-left">
                    <div class="flex items-center gap-1.5">
                      <span
                        class="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full"
                        :class="item.campaign === 'hotwheels' ? 'bg-red-50 text-red-600' : 'bg-[#f6eef8] text-[#753d77] border border-[#e8d5ec]'"
                      >
                        {{ item.campaign === 'hotwheels' ? 'Hot Wheels' : 'Maquillaje' }}
                      </span>
                      <span class="text-[10px] text-gray-400 truncate">{{ item.category }}</span>
                    </div>
                    <div class="text-xs font-semibold text-gray-900 truncate mt-0.5">
                      {{ item.name }}
                    </div>
                  </div>
                  <div class="text-xs font-bold text-[#27172b] shrink-0">
                    S/ {{ Number(item.price).toFixed(2) }}
                  </div>
                </div>
              </div>

              <!-- No results state -->
              <div v-else class="p-6 text-center text-xs text-gray-500">
                No encontramos detalles para "{{ searchQuery }}".
              </div>

              <!-- View all in catalog button -->
              <div v-if="searchResults.length > 0" class="p-2 border-t border-gray-100 bg-[#fbf7fc] text-center">
                <button
                  @click="handleSearchSubmit"
                  class="text-[11px] font-semibold text-[#965e9b] hover:text-[#caa35f] hover:underline cursor-pointer"
                >
                  Ver todos los resultados en el catálogo →
                </button>
              </div>
            </div>
          </div>

          <!-- Official WhatsApp Direct Link -->
          <a
            href="https://wa.me/51932449996?text=Hola%20Venezzia%20Detalles,%20quisiera%20consultar%20por%20sus%20catálogos"
            target="_blank"
            rel="noopener noreferrer"
            class="relative p-2 text-[#25D366] hover:bg-emerald-50 rounded-full transition-all hover:scale-110 cursor-pointer flex items-center justify-center border border-emerald-100/80 shadow-2xs"
            title="Escribir al WhatsApp (+51 932 449 996)"
            aria-label="Contactar a WhatsApp"
          >
            <IconWhatsApp customClass="w-5 h-5 text-[#25D366]" />
            <span class="sr-only">WhatsApp</span>
          </a>

          <!-- Cart Button -->
          <button
            @click="cartStore.openCart"
            class="relative p-2.5 rounded-full text-gray-800 hover:text-[#965e9b] hover:bg-[#f6eef8] transition-colors cursor-pointer border border-[#eedee9] shadow-2xs"
            aria-label="Abrir bolsa de compras"
          >
            <ShoppingBag class="w-5 h-5" />
            <span
              v-if="cartStore.totalCount > 0"
              class="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-gradient-to-r from-[#caa35f] to-[#b0873b] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs"
            >
              {{ cartStore.totalCount }}
            </span>
          </button>
        </div>
      </div>

      <!-- Mobile Search & Campaign Bar -->
      <div class="mt-2.5 sm:hidden space-y-2">
        <!-- Mobile Search Input -->
        <div ref="mobileSearchContainer" class="relative">
          <input
            type="text"
            v-model="searchQuery"
            @focus="onSearchFocus"
            @keydown.enter="handleSearchSubmit"
            @keydown.esc="searchStore.closeDropdown"
            placeholder="Buscar ramos, kitty, hot wheels..."
            class="w-full bg-[#f8f2f9] text-xs pl-8 pr-7 py-2 rounded-full border border-[#ecdbe8] focus:outline-none focus:border-[#caa35f]"
          />
          <Search class="w-3.5 h-3.5 text-[#caa35f] absolute left-3 top-1/2 -translate-y-1/2" />
          <button
            v-if="searchQuery"
            @click="clearSearch"
            class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
          >
            <X class="w-3.5 h-3.5" />
          </button>

          <!-- Mobile Dropdown -->
          <div
            v-if="searchStore.isDropdownOpen && searchQuery.trim().length > 0"
            class="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-[#eedee9] overflow-hidden z-50 max-h-64 overflow-y-auto"
          >
            <div v-if="searchResults.length > 0" class="divide-y divide-gray-100">
              <div
                v-for="item in searchResults.slice(0, 5)"
                :key="item.id"
                @click="selectProductResult(item)"
                class="p-2 hover:bg-[#faf4f8] flex items-center gap-2.5 text-left"
              >
                <img :src="item.image" :alt="item.name" class="w-9 h-9 rounded-lg object-contain bg-[#fbf7fc] p-1 shrink-0" />
                <div class="flex-1 min-w-0">
                  <div class="text-xs font-semibold text-gray-900 truncate">{{ item.name }}</div>
                  <div class="text-[10px] text-gray-400">{{ item.campaign === 'hotwheels' ? 'Hot Wheels' : 'Maquillaje' }} • S/ {{ Number(item.price).toFixed(2) }}</div>
                </div>
              </div>
            </div>
            <div v-else class="p-4 text-center text-xs text-gray-500">
              Sin resultados para "{{ searchQuery }}".
            </div>
          </div>
        </div>

        <!-- Mobile Campaign Switcher Pills -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            @click="selectCampaign('maquillaje')"
            :class="[
              'px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 cursor-pointer flex items-center transition-colors',
              campaignStore.activeCampaignId === 'maquillaje'
                ? 'bg-gradient-to-r from-[#27172b] to-[#401f46] text-white shadow-xs border border-[#caa35f]/50'
                : 'bg-white text-gray-700 border border-[#eedee9]'
            ]"
          >
            <span>Día de Maquillaje</span>
          </button>

          <button
            @click="selectCampaign('hotwheels')"
            :class="[
              'px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 cursor-pointer flex items-center transition-colors',
              campaignStore.activeCampaignId === 'hotwheels'
                ? 'bg-[#c22b38] text-white shadow-xs'
                : 'bg-white text-gray-700 border border-[#eedee9]'
            ]"
          >
            <span>Día Hot Wheels</span>
          </button>

          <button
            @click="navigateToSection('envios')"
            class="px-3 py-1.5 rounded-full text-xs font-medium text-gray-600 bg-white border border-[#eedee9] shrink-0 hover:text-[#965e9b] transition-colors cursor-pointer"
          >
            Envíos
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronDown, Search, ShoppingBag, X } from 'lucide-vue-next'
import IconWhatsApp from './icons/IconWhatsApp.vue'
import IconInstagram from './icons/IconInstagram.vue'
import IconTikTok from './icons/IconTikTok.vue'
import { useCartStore } from '../stores/cart'
import { useCampaignStore } from '../stores/campaign'
import { useSearchStore } from '../stores/search'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps({
  products: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select-product'])

const cartStore = useCartStore()
const campaignStore = useCampaignStore()
const searchStore = useSearchStore()

const desktopSearchContainer = ref(null)
const mobileSearchContainer = ref(null)

function handleClickOutside(e) {
  if (
    desktopSearchContainer.value && !desktopSearchContainer.value.contains(e.target) &&
    mobileSearchContainer.value && !mobileSearchContainer.value.contains(e.target)
  ) {
    searchStore.closeDropdown()
  }
}

function handleGlobalKeydown(e) {
  if (e.key === 'Escape') {
    searchStore.closeDropdown()
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
  window.removeEventListener('keydown', handleGlobalKeydown)
})

const searchQuery = computed({
  get: () => searchStore.searchQuery,
  set: (val) => searchStore.setQuery(val)
})

const searchResults = computed(() => {
  const query = searchStore.searchQuery.trim().toLowerCase()
  if (!query) return []
  return props.products.filter(p => {
    return (
      p.name?.toLowerCase().includes(query) ||
      p.category?.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query) ||
      p.items_included?.some(item => item.toLowerCase().includes(query))
    )
  })
})

function onSearchFocus() {
  if (searchStore.searchQuery.trim().length > 0) {
    searchStore.isDropdownOpen = true
  }
}

function clearSearch() {
  searchStore.clearQuery()
}

const router = useRouter()
const route = useRoute()

function navigateToSection(sectionId) {
  searchStore.closeDropdown()
  if (route && route.path !== '/') {
    router.push('/').then(() => {
      setTimeout(() => {
        const el = document.getElementById(sectionId)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }, 150)
    })
  } else {
    const el = document.getElementById(sectionId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

function selectCampaign(campaignId) {
  campaignStore.setCampaign(campaignId)
  searchStore.clearQuery()
  if (router) {
    router.push('/').then(() => {
      setTimeout(() => {
        const el = document.getElementById('catalogo')
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    })
  } else {
    const el = document.getElementById('catalogo')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

function selectProductResult(product) {
  if (product.campaign && product.campaign !== campaignStore.activeCampaignId) {
    campaignStore.setCampaign(product.campaign)
  }
  searchStore.closeDropdown()
  emit('select-product', product)
}

function handleSearchSubmit() {
  searchStore.closeDropdown()
  const el = document.getElementById('catalogo')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
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
