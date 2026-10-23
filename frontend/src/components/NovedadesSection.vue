<template>
  <section id="novedades" class="py-12 sm:py-16 bg-[#fdfaf8]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <!-- Products Grid (Cols 1-8) with Carousel Arrows -->
        <div class="lg:col-span-8 relative">
          <!-- Left Arrow indicator -->
          <button
            class="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white shadow-md border border-[#eddcd9] items-center justify-center text-[#b76e79] hover:bg-[#faf0f2] transition-colors cursor-pointer"
            aria-label="Anterior"
          >
            <ChevronLeft class="w-5 h-5" />
          </button>

          <!-- Product Cards with Authentic Canva Catalog Items -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 h-full">
            <ProductCard
              v-for="product in products"
              :key="product.id"
              :product="product"
              @select-product="$emit('select-product', $event)"
            />
          </div>

          <!-- Right Arrow indicator -->
          <button
            class="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white shadow-md border border-[#eddcd9] items-center justify-center text-[#b76e79] hover:bg-[#faf0f2] transition-colors cursor-pointer"
            aria-label="Siguiente"
          >
            <ChevronRight class="w-5 h-5" />
          </button>
        </div>

        <!-- Banner Right: "NOVEDADES" with Authentic Venezzia Product (Cols 9-12) -->
        <div class="lg:col-span-4 relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#fae7eb] via-[#f7d6dc] to-[#f2c7d0] p-6 sm:p-8 flex flex-col justify-between shadow-[0_15px_35px_-12px_rgba(183,110,121,0.2)] border border-[#edd1d7] min-h-[360px]">
          <!-- Top Title with Haute Horlogerie / Atelier Serif -->
          <div class="text-center">
            <span class="text-[10px] uppercase tracking-widest font-semibold text-[#9c414d] block mb-1">
              Atelier Venezzia
            </span>
            <h2 class="text-3xl sm:text-4xl font-serif tracking-[0.2em] text-[#3d2429] font-normal uppercase">
              NOVEDADES
            </h2>
            <div class="w-10 h-0.5 bg-[#b76e79]/50 mx-auto mt-2"></div>
          </div>

          <!-- Authentic Box Kitty Premium Visual -->
          <div class="relative flex justify-center items-center my-4">
            <div class="relative w-48 sm:w-56 h-56 sm:h-64 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/80 bg-white">
              <img
                src="/products/box_kitty_premium.png"
                alt="Novedades en Boxes Venezzia"
                class="w-full h-full object-cover"
              />
            </div>
          </div>

          <!-- Callout -->
          <div class="text-center">
            <span class="text-xs font-serif italic text-[#78464f]">
              "Cajas y ramos de maquillaje diseñados para enamorar"
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import ProductCard from './ProductCard.vue'

defineProps({
  products: {
    type: Array,
    default: () => []
  }
})

defineEmits(['select-product'])
</script>
