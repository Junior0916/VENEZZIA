<template>
  <section id="catalogo" class="py-16 sm:py-20 bg-gray-50/50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
            Nuestros Productos
          </span>
          <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight">
            Catálogo Disponible
          </h2>
          <p class="mt-2 text-sm text-gray-500 max-w-xl">
            Gestionado en tiempo real desde el panel administrable de PocketBase.
          </p>
        </div>

        <!-- Category Filters -->
        <div v-if="categories.length > 1" class="flex flex-wrap items-center gap-2">
          <button
            @click="selectedCategory = 'all'"
            :class="[
              'px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer',
              selectedCategory === 'all'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            ]"
          >
            Todos
          </button>
          <button
            v-for="cat in categories"
            :key="cat"
            @click="selectedCategory = cat"
            :class="[
              'px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer',
              selectedCategory === cat
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            ]"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          v-for="n in 4"
          :key="n"
          class="bg-white rounded-2xl p-4 border border-gray-100 animate-pulse flex flex-col gap-4"
        >
          <div class="aspect-square bg-gray-200 rounded-xl"></div>
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          <div class="h-8 bg-gray-200 rounded mt-auto"></div>
        </div>
      </div>

      <!-- Products Grid -->
      <div v-else-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200 p-8">
        <PackageX class="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h3 class="text-base font-semibold text-gray-800">No hay productos en esta categoría</h3>
        <p class="text-xs text-gray-500 mt-1">Intenta seleccionar otra categoría o revisa más tarde.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { PackageX } from 'lucide-vue-next'
import ProductCard from './ProductCard.vue'
import { fetchProducts } from '../services/pocketbase'

const products = ref([])
const loading = ref(true)
const selectedCategory = ref('all')

const categories = computed(() => {
  const set = new Set(products.value.map(p => p.category).filter(Boolean))
  return Array.from(set)
})

const filteredProducts = computed(() => {
  if (selectedCategory.value === 'all') {
    return products.value
  }
  return products.value.filter(p => p.category === selectedCategory.value)
})

onMounted(async () => {
  try {
    products.value = await fetchProducts()
  } catch (err) {
    console.error('Error al cargar productos:', err)
  } finally {
    loading.value = false
  }
})
</script>
