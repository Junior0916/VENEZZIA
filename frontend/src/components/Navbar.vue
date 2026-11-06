<template>
  <header id="site-header" class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#eedee9]/80 shadow-[0_4px_24px_-10px_rgba(154,104,155,0.08)]">
    <!-- TikTok Live Flash Sale Sticky Bar (Only visible while live promo countdown is active) -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-full opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-full opacity-0"
    >
      <div
        v-if="siteSettingsStore.isLiveOfferActive"
        class="bg-gradient-to-r from-[#ff0050] via-[#c22b38] to-[#00f2fe] text-white p-[1px] shadow-md relative z-50 overflow-hidden"
      >
        <!-- Mobile Layout (< 640px) -->
        <div class="sm:hidden bg-gradient-to-r from-[#180010] via-[#27172b] to-[#0f051d] px-3 py-2 space-y-1.5">
          <!-- Row 1: Live Badge on left, Countdown & Action on right -->
          <div class="flex items-center justify-between gap-1.5">
            <div class="flex items-center gap-1.5 shrink-0">
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ff0050] text-white text-[9px] font-black uppercase tracking-wider shadow-xs animate-pulse">
                <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
                <span>EN VIVO</span>
              </span>
              <span class="text-[10px] font-bold text-white/90">TIKTOK LIVE</span>
            </div>

            <div class="flex items-center gap-1.5 shrink-0">
              <span class="text-[10px] text-gray-300 font-medium">Termina:</span>
              <div class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/15 border border-white/20 text-white font-mono font-black text-xs tracking-wider shadow-inner">
                <Clock class="w-3 h-3 text-[#00f2fe]" />
                <span>{{ siteSettingsStore.formattedLiveTimeLeft }}</span>
              </div>
              <a
                href="https://www.tiktok.com/@venezzia.detalles/live"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#ff0050] hover:bg-[#d90043] text-white text-[10px] font-extrabold shadow-xs active:scale-95 whitespace-nowrap shrink-0"
              >
                <IconTikTok customClass="w-3 h-3 text-white" />
                <span>Ver Live</span>
              </a>
            </div>
          </div>

          <!-- Row 2: Full announcement message (Never truncated) -->
          <p class="text-[11px] font-bold text-white leading-tight text-center sm:text-left pt-0.5 break-words">
            {{ siteSettingsStore.liveBannerText || '¡OFERTA FLASH EN VIVO EN TIKTOK!' }}
          </p>
        </div>

        <!-- Desktop & Tablet Layout (>= 640px) -->
        <div class="hidden sm:flex bg-gradient-to-r from-[#180010] via-[#27172b] to-[#0f051d] px-4 sm:px-6 py-2 items-center justify-between gap-3">
          <!-- Left: Live Pulsing Indicator & Message (Never truncated) -->
          <div class="flex items-center gap-2.5 min-w-0">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ff0050] text-white text-[10px] font-black uppercase tracking-wider shadow-sm shrink-0 animate-pulse">
              <span class="w-2 h-2 rounded-full bg-white"></span>
              <span>EN VIVO</span>
            </span>

            <p class="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 leading-snug break-words">
              <span>{{ siteSettingsStore.liveBannerText || '¡OFERTA FLASH EN VIVO EN TIKTOK!' }}</span>
            </p>
          </div>

          <!-- Right: Countdown Timer Display & CTA -->
          <div class="flex items-center gap-2 shrink-0">
            <span class="text-[11px] text-gray-300 font-medium">Termina en:</span>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-white font-mono font-black text-xs sm:text-sm tracking-wider shadow-inner">
              <Clock class="w-3.5 h-3.5 text-[#00f2fe]" />
              <span>{{ siteSettingsStore.formattedLiveTimeLeft }}</span>
            </div>
            <a
              href="https://www.tiktok.com/@venezzia.detalles/live"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#ff0050] hover:bg-[#d90043] text-white text-[10px] font-bold tracking-wide transition-all shadow-xs"
            >
              <IconTikTok customClass="w-3 h-3 text-white" />
              <span>Ver Live</span>
            </a>
          </div>
        </div>
      </div>
    </transition>

    <!-- Top Utility Announcement Bar (Soft Lilac Mist & Champagne Gold Accents) -->
    <div class="border-b border-[#eedee9] bg-gradient-to-r from-[#faf5fc] via-[#fbf7fd] to-[#f8f1fa] text-[11px] text-gray-500 py-1 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <!-- Social Icons with Official Brand Logos & Phone Hotline -->
        <div class="flex items-center gap-3 sm:gap-4">
          <div class="flex items-center gap-3 text-gray-400">
            <!-- Official WhatsApp Logo -->
            <a
              :href="siteSettingsStore.whatsappLink('Hola Venezzia Detalles, quisiera hacer un pedido')"
              target="_blank"
              rel="noopener noreferrer"
              class="text-[#25D366] hover:scale-115 transition-transform flex items-center"
              :title="'Escríbenos a WhatsApp (' + siteSettingsStore.formattedPhone + ')'"
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
            :href="siteSettingsStore.whatsappLink('Hola Venezzia Detalles, quisiera hacer un pedido')"
            target="_blank"
            rel="noopener noreferrer"
            class="hidden sm:inline-flex items-center gap-1.5 text-gray-600 hover:text-emerald-700 font-medium group transition-colors"
          >
            <IconWhatsApp customClass="w-3.5 h-3.5 text-[#25D366] group-hover:scale-110 transition-transform" />
            <span>Atención Inmediata: <strong class="text-gray-900 font-semibold">{{ siteSettingsStore.formattedPhone }}</strong></span>
          </a>
        </div>

        <!-- Center / Right: Dynamic Announcement Text & Currency -->
        <div class="flex items-center gap-3">
          <span class="hidden md:inline text-[11px] font-medium tracking-wide text-gray-600">
            {{ siteSettingsStore.announcementText }}
          </span>
          <div class="flex items-center gap-1 font-semibold text-gray-700 bg-white/90 px-2.5 py-0.5 rounded-full border border-[#eedee9] text-[10px] shadow-2xs">
            <span class="text-[#caa35f] font-bold">PEN</span>
            <span>S/</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tier 1: Main Header Bar (Logo, Spacious Centered Search, WhatsApp & Shopping Bag) -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
      <div class="flex items-center justify-between gap-4 sm:gap-6">
        <!-- Left: Brand Logo — Nombre izquierda, Isotipo derecha -->
        <router-link to="/" class="flex items-center gap-2 sm:gap-3 group shrink-0" title="Venezzia Detalles">
          <img
            src="/marca_lila.webp"
            alt="Venezzia Detalles"
            class="h-9 sm:h-12 w-auto object-contain group-hover:opacity-85 transition-opacity duration-300"
          />
          <img
            src="/isotipo_lila.webp"
            alt="Venezzia Isotipo"
            class="h-8 sm:h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </router-link>

        <!-- Center: Spacious Desktop Search Input with Real-time Auto-complete -->
        <div class="hidden md:flex flex-1 justify-center max-w-lg mx-auto">
          <div ref="desktopSearchContainer" class="relative w-full">
            <input
              type="text"
              v-model="searchQuery"
              @focus="onSearchFocus"
              @keydown.enter="handleSearchSubmit"
              @keydown.esc="searchStore.closeDropdown"
              placeholder="Buscar ramos, rosas eternas, kitty, hot wheels..."
              class="w-full bg-[#f8f2f9] hover:bg-white focus:bg-white text-xs pl-9 pr-8 py-2.5 rounded-full border border-[#ecdbe8] focus:border-[#caa35f] focus:outline-none focus:ring-2 focus:ring-[#caa35f]/15 transition-all placeholder-gray-400 shadow-2xs"
            />
            <Search class="w-4 h-4 text-[#caa35f] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
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
                        :class="getCampaignBadgeClass(item.campaign)"
                      >
                        {{ getCampaignName(item.campaign) }}
                      </span>
                      <span class="text-[10px] text-gray-400 truncate">{{ item.category }}</span>
                    </div>
                    <div class="text-xs font-semibold text-gray-900 truncate mt-0.5">
                      {{ item.name }}
                    </div>
                  </div>
                  <div class="flex flex-col items-end shrink-0 gap-1">
                    <div class="text-xs font-bold text-[#27172b] whitespace-nowrap">
                      S/&nbsp;{{ Number(item.price).toFixed(2) }}
                    </div>
                    <span
                      v-if="item.in_stock === false"
                      class="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-[#fff1f2] text-[#e11d48] border border-[#fecdd3]"
                    >
                      Agotado
                    </span>
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
        </div>

        <!-- Right: Official WhatsApp Button & Shopping Bag -->
        <div class="flex items-center gap-2 sm:gap-3 shrink-0">
          <!-- WhatsApp Contact Button -->
          <a
            :href="siteSettingsStore.whatsappLink('Hola Venezzia Detalles, quisiera consultar por sus catálogos')"
            target="_blank"
            rel="noopener noreferrer"
            class="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 text-xs font-semibold transition-all hover:scale-102 cursor-pointer shadow-2xs"
            :title="'Escribir al WhatsApp (' + siteSettingsStore.formattedPhone + ')'"
          >
            <IconWhatsApp customClass="w-4 h-4 text-[#25D366]" />
            <span class="hidden lg:inline text-[11px]">Asistencia WhatsApp</span>
          </a>

          <!-- Mobile WhatsApp Icon Only -->
          <a
            :href="siteSettingsStore.whatsappLink('Hola Venezzia Detalles, quisiera consultar por sus catálogos')"
            target="_blank"
            rel="noopener noreferrer"
            class="sm:hidden p-2 text-[#25D366] hover:bg-emerald-50 rounded-full transition-all border border-emerald-100 shadow-2xs"
            aria-label="Contactar a WhatsApp"
          >
            <IconWhatsApp customClass="w-5 h-5 text-[#25D366]" />
          </a>

          <!-- Cart Bag Button -->
          <button
            @click="cartStore.openCart"
            class="relative p-2.5 rounded-full text-gray-800 hover:text-[#965e9b] hover:bg-[#f6eef8] transition-colors cursor-pointer border border-[#eedee9] shadow-2xs flex items-center gap-1.5"
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

      <!-- Tier 2: Dedicated Campaign Navigation Ribbon (Guarantees zero overlap with search bar) -->
      <div class="hidden md:flex items-center justify-between pt-2.5 mt-2 border-t border-[#eedee9]/60">
        <!-- Left: Campaign Navigation Pills & Ocasiones Dropdown -->
        <nav class="flex items-center gap-1.5 lg:gap-2 flex-wrap">
          <button
            v-for="camp in campaignStore.campaigns"
            :key="camp.id"
            @click="selectCampaign(camp.id)"
            :class="[
              'px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer flex items-center shrink-0',
              getCampaignBtnClasses(camp.id)
            ]"
          >
            <span>{{ camp.navTitle || camp.shortName }}</span>
          </button>

          <!-- Dropdown: Todas las Ocasiones (Clean Luxury Style, No AI Emojis) -->
          <div class="relative group">
            <button
              class="px-3 py-1.5 rounded-full text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Ocasiones</span>
              <ChevronDown class="w-3.5 h-3.5 text-gray-400 group-hover:rotate-180 transition-transform duration-200" />
            </button>

            <!-- Dropdown Menu -->
            <div class="absolute left-0 mt-1 w-64 bg-white rounded-2xl shadow-xl border border-[#eedee9] py-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 z-50">
              <div class="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100">
                Selecciona una fecha especial
              </div>
              <button
                v-for="camp in campaignStore.campaigns"
                :key="camp.id"
                @click="selectCampaign(camp.id)"
                class="w-full text-left px-3.5 py-2.5 text-xs text-gray-700 hover:bg-[#f6eef8] hover:text-[#965e9b] flex items-center justify-between transition-colors cursor-pointer"
              >
                <div class="flex items-center gap-2.5">
                  <span class="w-2.5 h-2.5 rounded-full shrink-0" :class="getCampaignDotClass(camp.id)"></span>
                  <span class="font-medium">{{ camp.name }}</span>
                </div>
                <span v-if="campaignStore.activeCampaignId === camp.id" class="text-[10px] font-bold text-[#caa35f]">
                  Activo
                </span>
              </button>
            </div>
          </div>

          <span class="text-[#e2cee0] mx-0.5">|</span>

          <!-- Delivery Guide Button (Never Overlapped) -->
          <button
            @click="navigateToSection('envios')"
            class="px-3 py-1.5 rounded-full text-xs font-medium text-gray-700 hover:text-[#965e9b] hover:bg-[#f6eef8] transition-colors cursor-pointer"
          >
            Tarifas de Envíos
          </button>
        </nav>

        <!-- Right: Dispatch Guarantee Badge -->
        <div class="hidden lg:flex items-center gap-2 text-[11px] text-gray-500 font-medium">
          <Truck class="w-3.5 h-3.5 text-[#caa35f]" />
          <span>Envíos a todo Lima y Callao</span>
        </div>
      </div>

      <!-- Mobile Search & Campaign Bar -->
      <div class="mt-2.5 md:hidden space-y-2">
        <!-- Mobile Search Input -->
        <div ref="mobileSearchContainer" class="relative">
          <input
            type="text"
            v-model="searchQuery"
            @focus="onSearchFocus"
            @keydown.enter="handleSearchSubmit"
            @keydown.esc="searchStore.closeDropdown"
            placeholder="Buscar ramos, rosas eternas, kitty..."
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
                  <div class="flex items-center gap-1.5">
                    <span class="text-xs font-semibold text-gray-900 truncate">{{ item.name }}</span>
                    <span
                      v-if="item.in_stock === false"
                      class="px-1.5 py-0.2 rounded-full text-[8px] font-extrabold uppercase tracking-wider bg-[#fff1f2] text-[#e11d48] border border-[#fecdd3] shrink-0"
                    >
                      Agotado
                    </span>
                  </div>
                  <div class="text-[10px] text-gray-400">{{ getCampaignName(item.campaign) }} • <span class="whitespace-nowrap">S/&nbsp;{{ Number(item.price).toFixed(2) }}</span></div>
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
            v-for="camp in campaignStore.campaigns"
            :key="camp.id"
            @click="selectCampaign(camp.id)"
            :class="[
              'px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 cursor-pointer flex items-center transition-colors',
              getMobileCampaignPillClasses(camp.id)
            ]"
          >
            <span>{{ camp.navTitle || camp.shortName }}</span>
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
import { ChevronDown, Search, ShoppingBag, X, Truck, Clock } from 'lucide-vue-next'
import IconWhatsApp from './icons/IconWhatsApp.vue'
import IconInstagram from './icons/IconInstagram.vue'
import IconTikTok from './icons/IconTikTok.vue'
import { useCartStore } from '../stores/cart'
import { useCampaignStore } from '../stores/campaign'
import { useSearchStore } from '../stores/search'
import { useSiteSettingsStore } from '../stores/siteSettings'
import { useRouter, useRoute } from 'vue-router'
import { scrollToSection, scrollToSectionDeferred } from '../utils/scroll'

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
const siteSettingsStore = useSiteSettingsStore()

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

function getCampaignName(id) {
  const camp = campaignStore.campaigns.find(c => c.id === id)
  return camp?.shortName || camp?.navTitle || 'Venezzia'
}

function getCampaignDotClass(id) {
  if (id === 'hotwheels') return 'bg-[#c22b38]'
  if (id === 'graduacion') return 'bg-[#caa35f]'
  if (id === 'cumpleanos') return 'bg-[#c026d3]'
  return 'bg-[#965e9b]'
}

function getCampaignBadgeClass(id) {
  if (id === 'hotwheels') return 'bg-red-50 text-red-600'
  if (id === 'graduacion') return 'bg-amber-50 text-amber-700'
  if (id === 'cumpleanos') return 'bg-pink-50 text-pink-700'
  return 'bg-[#f6eef8] text-[#753d77] border border-[#e8d5ec]'
}

function getCampaignBtnClasses(campId) {
  const isActive = campaignStore.activeCampaignId === campId
  if (campId === 'hotwheels') {
    return isActive
      ? 'bg-[#c22b38] text-white shadow-xs border border-red-400/40 ring-1 ring-red-400/30'
      : 'text-gray-700 hover:text-[#c22b38] hover:bg-[#fff1f2]'
  }
  if (campId === 'graduacion') {
    return isActive
      ? 'bg-[#854d0e] text-white shadow-xs border border-amber-400/40 ring-1 ring-amber-400/30'
      : 'text-gray-700 hover:text-[#b45309] hover:bg-[#fefce8]'
  }
  if (campId === 'cumpleanos') {
    return isActive
      ? 'bg-[#be185d] text-white shadow-xs border border-pink-400/40 ring-1 ring-pink-400/30'
      : 'text-gray-700 hover:text-[#c026d3] hover:bg-[#fdf2f8]'
  }
  // Default: maquillaje
  return isActive
    ? 'bg-gradient-to-r from-[#27172b] to-[#401f46] text-white shadow-xs border border-[#caa35f]/50 ring-1 ring-[#caa35f]/20'
    : 'text-gray-700 hover:text-[#965e9b] hover:bg-[#f6eef8]'
}

function getMobileCampaignPillClasses(campId) {
  const isActive = campaignStore.activeCampaignId === campId
  if (campId === 'hotwheels') {
    return isActive
      ? 'bg-[#c22b38] text-white shadow-xs'
      : 'bg-white text-gray-700 border border-[#eedee9]'
  }
  if (campId === 'graduacion') {
    return isActive
      ? 'bg-[#854d0e] text-white shadow-xs'
      : 'bg-white text-gray-700 border border-[#eedee9]'
  }
  if (campId === 'cumpleanos') {
    return isActive
      ? 'bg-[#be185d] text-white shadow-xs'
      : 'bg-white text-gray-700 border border-[#eedee9]'
  }
  // Default: maquillaje
  return isActive
    ? 'bg-gradient-to-r from-[#27172b] to-[#401f46] text-white shadow-xs border border-[#caa35f]/50'
    : 'bg-white text-gray-700 border border-[#eedee9]'
}

function clearSearch() {
  searchStore.clearQuery()
}

const router = useRouter()
const route = useRoute()

async function navigateToSection(sectionId) {
  searchStore.closeDropdown()
  if (route && route.path !== '/') {
    await router.push('/')
  }
  await scrollToSectionDeferred(sectionId)
}

async function selectCampaign(campaignId) {
  campaignStore.setCampaign(campaignId)
  searchStore.clearQuery()
  if (route && route.path !== '/') {
    await router.push('/')
  }
  await scrollToSectionDeferred('catalogo')
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
  scrollToSectionDeferred('catalogo')
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