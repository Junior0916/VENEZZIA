<template>
  <div class="group bg-white rounded-2xl border border-[#eedee9] shadow-[0_2px_12px_-4px_rgba(39,23,43,0.04)] hover:shadow-[0_16px_36px_-8px_rgba(154,104,155,0.18)] hover:border-[#caa35f]/60 transition-all duration-300 flex flex-col justify-between overflow-hidden">
    <!-- Centered Product Image Container (4:5 Luxury Ratio - 600x750 Framing) -->
    <div
      @click="$emit('select-product', product)"
      class="relative aspect-[4/5] w-full overflow-hidden bg-[#faf6f5] cursor-pointer flex items-center justify-center p-2.5 sm:p-3"
      title="Clic para ver detalles completos y contenido exacto"
    >
      <img
        :src="product.image"
        :alt="product.name"
        class="w-full h-full object-cover object-center rounded-xl group-hover:scale-104 transition-transform duration-500 ease-out"
        loading="lazy"
      />

      <!-- Promo Badge if original_price exists (Refined Gold or Red for Hot Wheels) -->
      <div
        v-if="product.original_price"
        class="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-2xs"
        :class="product.campaign === 'hotwheels' ? 'bg-[#fee2e2] text-[#b91c1c] border border-[#fca5a5]/60' : 'bg-gradient-to-r from-[#caa35f] to-[#b0873b] text-white border border-[#f3e1b9]'"
      >
        Promo
      </div>
    </div>

    <!-- Product Info (Clean, Uncluttered, No Tag Overload) -->
    <div class="p-4 sm:p-5 flex flex-col flex-1 justify-between text-left">
      <div>
        <span
          class="text-[11px] font-medium tracking-wider uppercase block mb-1 transition-colors"
          :class="product.campaign === 'hotwheels' ? 'text-[#c22b38]' : 'text-[#965e9b]'"
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

      <div class="mt-2 pt-3 border-t border-[#f4eaf6] flex items-center justify-between gap-3">
        <div>
          <span class="text-xs text-gray-400 block -mb-0.5 font-light">Precio</span>
          <div class="flex items-baseline gap-1.5">
            <span
              v-if="product.original_price"
              class="text-xs text-gray-400 line-through font-normal"
            >
              S/ {{ Number(product.original_price).toFixed(2) }}
            </span>
            <span class="text-lg sm:text-xl font-bold text-[#27172b]">
              S/ {{ Number(product.price).toFixed(2) }}
            </span>
          </div>
        </div>

        <!-- Add to Cart Action -->
        <button
          @click="addToCart"
          class="px-4 py-2 rounded-full text-white text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer shadow-xs active:scale-95 shrink-0"
          :class="product.campaign === 'hotwheels' ? 'bg-[#c22b38] hover:bg-[#991b1b]' : 'bg-[#27172b] hover:bg-[#caa35f] hover:text-[#27172b] border border-[#caa35f]/40'"
        >
          Añadir
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
import { useCartStore } from '../stores/cart'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

defineEmits(['select-product'])

const cartStore = useCartStore()

function addToCart() {
  cartStore.addToCart(props.product, 1)
}
</script>
