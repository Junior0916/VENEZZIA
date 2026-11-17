<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm transition-all duration-300 animate-in fade-in"
    @click.self="handleClose"
  >
    <!-- Poster Card Container (Inspired by Ripley promo popup, boutique luxury Venezzia style) -->
    <div
      class="relative w-full max-w-[350px] sm:max-w-[390px] max-h-[92vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#221026] via-[#1a0c1d] to-[#120614] border border-[#eedee9]/25 shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-white text-center flex flex-col group select-none animate-in zoom-in-95 duration-200"
    >
      <!-- Subtle luxury aura glow in top-right -->
      <div class="absolute -top-16 -right-16 w-48 h-48 bg-[#caa35f]/15 rounded-full blur-3xl pointer-events-none"></div>
      <div v-if="isLiveActive" class="absolute -bottom-16 -left-16 w-48 h-48 bg-[#ff0050]/20 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Close Button (X) at Top-Right Corner (like Ripley) -->
      <button
        type="button"
        @click.stop="handleClose"
        class="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/25 shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer"
        title="Cerrar ventana promocional"
        aria-label="Cerrar"
      >
        <X class="w-5 h-5 text-white" />
      </button>

      <!-- TOP BADGE: Live Flash Urgency or Special Edition -->
      <div class="pt-4 px-4 pb-2 relative z-10 flex flex-col items-center gap-1.5">
        <!-- Live Active Header -->
        <div v-if="isLiveActive" class="flex flex-wrap items-center justify-center gap-2">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff0050] text-white text-[10px] font-black uppercase tracking-wider shadow-md animate-pulse">
            <span class="w-2 h-2 rounded-full bg-white"></span>
            <span>EN VIVO EN TIKTOK</span>
          </span>
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#00f2fe] font-mono text-[11px] font-bold">
            <Clock class="w-3 h-3 text-[#00f2fe]" />
            <span>{{ formattedTimeLeft }}</span>
          </span>
        </div>

        <!-- Non-live Default Luxury Badge -->
        <div v-else class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#caa35f]/20 border border-[#caa35f]/40 text-[#caa35f] text-[10px] font-bold uppercase tracking-wider">
          <Sparkles class="w-3 h-3 text-[#caa35f]" />
          <span>{{ campaignBadgeText }}</span>
        </div>

        <p class="text-[11px] sm:text-xs text-gray-300 font-medium max-w-[280px] leading-tight mt-0.5">
          {{ bannerText }}
        </p>
      </div>

      <!-- MAIN PRODUCT POSTER IMAGE (Clickable to open) -->
      <div
        class="relative px-4 py-2 cursor-pointer"
        @click="handleProductClick"
      >
        <div class="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-[#2b1630] border border-white/10 shadow-inner group/img">
          <img
            :src="displayImage"
            :alt="product.name"
            class="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover/img:scale-105"
            loading="eager"
          />

          <!-- Gradient overlay at bottom of image for seamless contrast -->
          <div class="absolute inset-0 bg-gradient-to-t from-[#1a0c1d] via-transparent to-black/20 pointer-events-none"></div>

          <!-- Savings Floating Badge if discount is active -->
          <div
            v-if="savingsAmount > 0"
            class="absolute top-3 left-3 px-3 py-1 rounded-xl bg-gradient-to-r from-[#ff0050] to-[#b30037] text-white text-xs font-black shadow-lg tracking-wide flex items-center gap-1 border border-white/20"
          >
            <Flame class="w-3.5 h-3.5 text-white" />
            <span>AHORRAS S/ {{ savingsAmount.toFixed(2) }}</span>
          </div>

          <!-- Bottom hint on image -->
          <div class="absolute bottom-2.5 left-0 right-0 text-center">
            <span class="inline-flex items-center gap-1 text-[11px] text-[#caa35f] font-bold bg-black/60 backdrop-blur-md px-3 py-0.5 rounded-full border border-[#caa35f]/30">
              <span>Clic para ver detalles completos</span>
              <ArrowRight class="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      <!-- PRODUCT TITLE & PRICING CONTENT -->
      <div class="px-5 pb-5 pt-1 relative z-10 flex flex-col items-center">
        <!-- Title -->
        <h3
          class="text-lg sm:text-xl font-serif font-black text-white text-center leading-tight tracking-tight cursor-pointer hover:text-[#caa35f] transition-colors"
          @click="handleProductClick"
        >
          {{ product.name }}
        </h3>

        <!-- Short Subtitle / Items teaser -->
        <p class="text-[11px] text-gray-400 mt-1 max-w-[280px] line-clamp-1">
          {{ productSubtitle }}
        </p>

        <!-- Pricing Block -->
        <div class="flex items-center justify-center gap-3 mt-2.5 mb-3.5">
          <div class="flex items-baseline gap-1.5">
            <span class="text-xs text-gray-400 font-medium">Ahora:</span>
            <span class="text-2xl sm:text-3xl font-extrabold text-[#caa35f] tracking-tight font-serif">
              S/ {{ effectivePrice.toFixed(2) }}
            </span>
          </div>
          <div v-if="originalPrice > effectivePrice" class="flex items-baseline gap-1">
            <span class="text-sm sm:text-base text-gray-400 line-through">
              S/ {{ originalPrice.toFixed(2) }}
            </span>
          </div>
        </div>

        <!-- Big Luxury Action Button (CTA) -->
        <button
          type="button"
          @click="handleProductClick"
          class="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-[#caa35f] via-[#e2be7a] to-[#caa35f] text-[#27172b] font-black text-xs sm:text-sm tracking-wider uppercase hover:brightness-105 active:scale-98 transition-all shadow-[0_4px_20px_rgba(202,163,95,0.4)] flex items-center justify-center gap-2 cursor-pointer group/btn"
        >
          <Sparkles class="w-4 h-4 text-[#27172b]" />
          <span>Ver Producto & Pedir Ahora</span>
          <ArrowRight class="w-4 h-4 text-[#27172b] transition-transform group-hover/btn:translate-x-1" />
        </button>

        <!-- Subtext Delivery Info -->
        <div class="mt-2 text-[10px] text-gray-400 text-center flex items-center justify-center gap-1.5">
          <span>🚚 Envíos programados a todo Lima y Callao</span>
          <span>•</span>
          <span class="text-emerald-400 font-medium">Stock Limitado</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { X, Sparkles, Clock, Flame, ArrowRight } from 'lucide-vue-next'
import { useSiteSettingsStore } from '../stores/siteSettings'
import { getProductSlug } from '../utils/productUrl'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'select-product'])

const siteSettingsStore = useSiteSettingsStore()

const isLiveActive = computed(() => {
  return siteSettingsStore.isLiveOfferActive
})

const formattedTimeLeft = computed(() => {
  return siteSettingsStore.formattedLiveTimeLeft || '15:00'
})

const bannerText = computed(() => {
  if (isLiveActive.value && siteSettingsStore.liveBannerText) {
    return siteSettingsStore.liveBannerText
  }
  const camp = (props.product.campaign || '').toLowerCase()
  if (camp === 'navidad') {
    return '🎄 ¡Especial Navideño de Edición Limitada! Llena tu hogar de magia y sorpresas.'
  }
  if (camp === 'hotwheels') {
    return '🏎️ ¡Día de Regalar Hot Wheels! Diseños exclusivos con rosas y autos de colección.'
  }
  if (camp === 'maquillaje') {
    return '💄 ¡Colección de Maquillaje & Skincare! El regalo perfecto para sorprender.'
  }
  return '✨ ¡Detalle Estrella de Edición Limitada en Venezzia!'
})

const campaignBadgeText = computed(() => {
  const camp = (props.product.campaign || '').toLowerCase()
  if (camp === 'navidad') return '🎄 Colección Navidad 2026'
  if (camp === 'hotwheels') return '🏎️ Especial Hot Wheels'
  if (camp === 'maquillaje') return '💄 Especial Maquillaje'
  if (camp === 'graduacion') return '🎓 Especial Graduación'
  if (camp === 'cumpleanos') return '🎂 Especial Cumpleaños'
  return '✨ Detalle Destacado'
})

const productSubtitle = computed(() => {
  if (props.product.items_included && Array.isArray(props.product.items_included) && props.product.items_included.length > 0) {
    return props.product.items_included.slice(0, 2).join(' • ')
  }
  if (props.product.description) {
    return props.product.description
  }
  return 'Detalle artesanal exclusivo con acabados de gala y dedicatoria personal.'
})

// Resolve clean image (handles WebP, uploads from PocketBase or local public path)
const displayImage = computed(() => {
  const p = props.product
  if (!p) return '/logo_venezzia.webp'
  if (p.image) {
    if (p.image.startsWith('http://') || p.image.startsWith('https://') || p.image.startsWith('/')) {
      return p.image
    }
  }
  if (p.displayImage) return p.displayImage
  // Fallback for Calendario de Adviento
  if (p.id === 'advi2026calend' || (p.name || '').toLowerCase().includes('adviento')) {
    return '/products/calendario-de-adviento-2026.webp'
  }
  return p.image || '/logo_venezzia.webp'
})

// Pricing calculation factoring live discount
const originalPrice = computed(() => {
  const base = Number(props.product.price || 0)
  const compare = Number(props.product.original_price || props.product.compare_at_price || 0)
  if (compare > base) return compare
  if (isLiveActive.value && siteSettingsStore.getProductLiveDiscount(props.product) > 0) {
    return base
  }
  return compare > 0 ? compare : base
})

const effectivePrice = computed(() => {
  const base = Number(props.product.price || 0)
  if (isLiveActive.value) {
    const disc = siteSettingsStore.getProductLiveDiscount(props.product)
    if (disc > 0) {
      return Math.max(0, base - disc)
    }
  }
  return base
})

const savingsAmount = computed(() => {
  const diff = originalPrice.value - effectivePrice.value
  return diff > 0 ? diff : 0
})

function handleClose() {
  emit('close')
}

function handleProductClick() {
  emit('select-product', props.product)
}

function handleKeyDown(e) {
  if (e.key === 'Escape') {
    handleClose()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>
