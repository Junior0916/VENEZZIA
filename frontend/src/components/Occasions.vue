<template>
  <section id="ocasiones" class="py-10 sm:py-14 bg-white/70 backdrop-blur-xs border-y border-[#eedee9]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-xl mx-auto mb-8 sm:mb-10">
        <span
          class="text-xs font-semibold uppercase tracking-widest block mb-1 transition-colors"
          :class="campaignStore.activeCampaignId === 'hotwheels' ? 'text-[#c22b38]' : 'text-[#965e9b]'"
        >
          {{ campaignStore.activeCampaign.name }}
        </span>
        <h2 class="text-xl sm:text-2xl font-serif font-bold text-[#27172b] tracking-tight">
          Explora por Categoría
        </h2>
        <p class="text-xs text-gray-500 mt-1">
          Elige el detalle ideal según el estilo, club o personaje favorito
        </p>
      </div>

      <!-- Categories Row -->
      <div class="flex items-center justify-start sm:justify-center gap-6 sm:gap-10 overflow-x-auto pb-2 no-scrollbar">
        <button
          v-for="item in currentCategories"
          :key="item.name"
          @click="$emit('select-category', item.filter)"
          class="flex flex-col items-center group shrink-0 cursor-pointer focus:outline-none"
        >
          <!-- Circular Centered Photo Frame -->
          <div class="w-20 sm:w-24 h-20 sm:h-24 rounded-full bg-[#fbf7fc] border border-[#eedee9] group-hover:border-[#caa35f] group-hover:shadow-[0_4px_16px_rgba(202,163,95,0.22)] group-hover:ring-2 group-hover:ring-[#caa35f]/25 transition-all duration-300 p-2 flex items-center justify-center">
            <img
              :src="item.image"
              :alt="item.name"
              class="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300"
            />
          </div>

          <span class="mt-2.5 text-xs font-medium text-gray-700 group-hover:text-[#965e9b] transition-colors text-center">
            {{ item.name }}
          </span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useCampaignStore } from '../stores/campaign'

defineEmits(['select-category'])

const campaignStore = useCampaignStore()

const currentCategories = computed(() => {
  return campaignStore.activeCampaign.categories || []
})
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
