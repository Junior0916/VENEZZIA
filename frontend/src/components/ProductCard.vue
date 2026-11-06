<template>
  <div class="group bg-white rounded-2xl border border-[#eedee9] shadow-[0_2px_12px_-4px_rgba(39,23,43,0.04)] hover:shadow-[0_16px_36px_-8px_rgba(154,104,155,0.18)] hover:border-[#caa35f]/60 transition-all duration-300 flex flex-col justify-between overflow-hidden">
    <!-- Centered Product Image Container (4:5 Luxury Ratio - 600x750 Framing) -->
    <div
      @click="$emit('select-product', product)"
      class="relative aspect-[4/5] w-full overflow-hidden bg-[#faf6f5] cursor-pointer flex items-center justify-center p-2 sm:p-2.5"
      title="Clic para ver detalles completos y contenido exacto"
    >
      <!-- Shimmer Placeholder while image loads -->
      <div
        v-if="!isImageLoaded"
        class="absolute inset-2 sm:inset-2.5 rounded-xl bg-gradient-to-tr from-[#faf3f9] via-[#f5eaf4] to-[#faf3f9] animate-pulse z-5"
      />

      <!-- Capa de fondo ambiental: se adapta dinámicamente si la foto no es 4:5 -->
      <img
        :src="product.image"
        alt=""
        aria-hidden="true"
        class="absolute inset-0 w-full h-full object-cover blur-md opacity-25 scale-110 pointer-events-none"
        loading="lazy"
        decoding="async"
      />

      <!-- Imagen del producto: se adapta y escala proporcionalmente (object-contain) para que NUNCA se corte ningún detalle -->
      <img
        :src="product.image"
        :alt="product.name"
        width="600"
        height="750"
        @load="isImageLoaded = true"
        class="relative z-10 w-full h-full object-contain object-center rounded-xl transition-all duration-300 ease-out"
        :class="[
          isImageLoaded ? 'opacity-100 group-hover:scale-104' : 'opacity-0',
          product.in_stock === false ? 'grayscale-[20%] opacity-90' : ''
        ]"
        loading="lazy"
        decoding="async"
      />

      <!-- TikTok Live Promo Badge -->
      <div
        v-if="hasLiveDiscount && product.in_stock !== false"
        class="absolute top-2.5 right-2.5 z-20 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-[#ff0050] text-white shadow-md flex items-center gap-1 border border-white/60 animate-pulse"
      >
        <span>🔥 LIVE -S/&nbsp;{{ liveDiscount }}</span>
      </div>

      <!-- Promo Badge if original_price exists and no live promo -->
      <div
        v-else-if="product.original_price"
        class="absolute top-2.5 right-2.5 z-20 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-2xs"
        :class="promoBadgeClass"
      >
        Promo
      </div>

      <!-- Agotado Badge if in_stock === false -->
      <div
        v-if="product.in_stock === false"
        class="absolute top-2.5 left-2.5 z-20 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-[#e11d48] text-white shadow-md flex items-center gap-1 border border-white/40 backdrop-blur-xs"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
        <span>Agotado</span>
      </div>
    </div>

    <!-- Product Info (Clean, Uncluttered, No Tag Overload) -->
    <div class="p-4 sm:p-5 flex flex-col flex-1 justify-between text-left">
      <div>
        <span
          class="text-[11px] font-medium tracking-wider uppercase block mb-1 transition-colors"
          :class="categoryColorClass"
        >
          {{ product.category }}
        </span>
        <h3
          @click="$emit('select-product', product)"
          class="text-sm sm:text-base font-semibold text-[#27172b] group-hover:text-[#965e9b] transition-colors leading-snug cursor-pointer mb-2 line-clamp-2"
        >
          {{ product.name }}
        </h3>
      </div>

      <div class="mt-2 pt-3 border-t border-[#f4eaf6] flex items-center justify-between gap-2">
        <div class="min-w-0 shrink">
          <span class="text-[11px] sm:text-xs text-gray-400 block -mb-0.5 font-light">Precio</span>
          <div class="flex items-baseline gap-1.5 flex-wrap sm:flex-nowrap whitespace-nowrap">
            <!-- TikTok Live Discount Price -->
            <template v-if="hasLiveDiscount">
              <span class="text-xs text-gray-400 line-through font-normal whitespace-nowrap shrink-0">
                S/&nbsp;{{ Number(product.price).toFixed(2) }}
              </span>
              <span class="text-base sm:text-xl font-extrabold text-[#c22b38] whitespace-nowrap shrink-0">
                S/&nbsp;{{ finalPrice.toFixed(2) }}
              </span>
            </template>
            <!-- Standard / Promo Price -->
            <template v-else>
              <span
                v-if="product.original_price"
                class="text-xs text-gray-400 line-through font-normal whitespace-nowrap shrink-0"
              >
                S/&nbsp;{{ Number(product.original_price).toFixed(2) }}
              </span>
              <span class="text-base sm:text-xl font-bold text-[#27172b] whitespace-nowrap shrink-0">
                S/&nbsp;{{ Number(product.price).toFixed(2) }}
              </span>
            </template>
          </div>
        </div>

        <!-- Add to Cart Action / Agotado Indicator -->
        <button
          v-if="product.in_stock !== false"
          @click.stop="addToCart"
          class="px-3.5 sm:px-4 py-2 rounded-full text-white text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer shadow-xs active:scale-95 shrink-0"
          :class="addToCartButtonClass"
        >
          Añadir
        </button>
        <button
          v-else
          @click.stop="$emit('select-product', product)"
          class="px-3 py-1.5 rounded-full bg-[#fff1f2] border border-[#fecdd3] text-[#e11d48] text-[10px] font-bold tracking-wider uppercase cursor-pointer hover:bg-[#ffe4e6] transition-colors shrink-0 shadow-2xs"
          title="Producto temporalmente agotado - Clic para ver opciones"
        >
          Agotado
        </button>
      </div>

      <!-- Discrete View Details Link -->
      <button
        @click="$emit('select-product', product)"
        class="text-[11px] text-[#965e9b] hover:text-[#caa35f] text-center mt-2.5 pt-2 border-t border-[#f4eaf6]/80 cursor-pointer font-medium tracking-wide transition-colors"
      >
        Ver qué incluye este detalle →
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '../stores/cart'
import { useSiteSettingsStore } from '../stores/siteSettings'

const isImageLoaded = ref(false)

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

defineEmits(['select-product'])

const cartStore = useCartStore()
const siteSettingsStore = useSiteSettingsStore()

const liveDiscount = computed(() => siteSettingsStore.getProductLiveDiscount(props.product))
const hasLiveDiscount = computed(() => liveDiscount.value > 0)
const finalPrice = computed(() => siteSettingsStore.getProductFinalPrice(props.product))

const categoryColorClass = computed(() => {
  const camp = props.product.campaign
  if (camp === 'hotwheels') return 'text-[#c22b38]'
  if (camp === 'graduacion') return 'text-[#b45309]'
  if (camp === 'cumpleanos') return 'text-[#c026d3]'
  return 'text-[#965e9b]'
})

const addToCartButtonClass = computed(() => {
  const camp = props.product.campaign
  if (camp === 'hotwheels') return 'bg-[#c22b38] hover:bg-[#991b1b]'
  if (camp === 'graduacion') return 'bg-[#854d0e] hover:bg-[#caa35f] hover:text-[#27172b] border border-amber-400/40'
  if (camp === 'cumpleanos') return 'bg-[#be185d] hover:bg-[#9d174d]'
  return 'bg-[#27172b] hover:bg-[#caa35f] hover:text-[#27172b] border border-[#caa35f]/40'
})

const promoBadgeClass = computed(() => {
  const camp = props.product.campaign
  if (camp === 'hotwheels') return 'bg-[#fee2e2] text-[#b91c1c] border border-[#fca5a5]/60'
  if (camp === 'graduacion') return 'bg-[#fefce8] text-[#854d0e] border border-[#fef08a]'
  if (camp === 'cumpleanos') return 'bg-[#fdf2f8] text-[#9d174d] border border-[#fbcfe8]'
  return 'bg-gradient-to-r from-[#caa35f] to-[#b0873b] text-white border border-[#f3e1b9]'
})

function addToCart() {
  const prodToAdd = {
    ...props.product,
    price: finalPrice.value,
    base_price: props.product.price,
    liveDiscount: liveDiscount.value
  }
  cartStore.addToCart(prodToAdd, 1)
}
</script>
