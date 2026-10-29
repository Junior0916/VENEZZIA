<template>
  <section id="inicio" class="py-6 sm:py-10 bg-[#faf7fb]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Campaign Switcher Banner (Interactive, High-end) -->
      <div class="mb-6 p-1.5 sm:p-2 bg-white/85 backdrop-blur-xs rounded-2xl sm:rounded-full border border-[#eedee9] shadow-[0_2px_16px_-4px_rgba(154,104,155,0.06)] flex flex-col sm:flex-row items-center justify-between gap-2">
        <div class="px-4 py-1 text-xs text-gray-500 font-medium flex items-center gap-2">
          <span class="w-2 h-2 rounded-full animate-pulse" :class="campaignStore.activeCampaignId === 'hotwheels' ? 'bg-[#c22b38]' : 'bg-[#caa35f]'"></span>
          <span class="font-semibold text-gray-700">Explorar por Fecha Especial:</span>
        </div>

        <div class="grid grid-cols-2 gap-1.5 sm:gap-2 w-full sm:w-auto">
          <!-- Switcher Button 1: Maquillaje -->
          <button
            @click="campaignStore.setCampaign('maquillaje')"
            :class="[
              'px-4 sm:px-6 py-2 rounded-xl sm:rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer flex items-center justify-center',
              campaignStore.activeCampaignId === 'maquillaje'
                ? 'bg-gradient-to-r from-[#27172b] to-[#401f46] text-white shadow-sm ring-2 ring-[#caa35f]/30 border border-[#caa35f]/50'
                : 'bg-[#faf6fc] text-gray-700 hover:bg-[#f5edf8] hover:text-[#965e9b]'
            ]"
          >
            <span>Día del Maquillaje</span>
          </button>

          <!-- Switcher Button 2: Hot Wheels -->
          <button
            @click="campaignStore.setCampaign('hotwheels')"
            :class="[
              'px-4 sm:px-6 py-2 rounded-xl sm:rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer flex items-center justify-center',
              campaignStore.activeCampaignId === 'hotwheels'
                ? 'bg-[#c22b38] text-white shadow-sm ring-2 ring-red-500/20'
                : 'bg-[#fff1f2] text-gray-800 hover:bg-[#ffe4e6] hover:text-[#c22b38]'
            ]"
          >
            <span>Día Hot Wheels</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-7 items-stretch">
        <!-- Main Hero Card (Col 1-8) -->
        <div class="lg:col-span-8 rounded-3xl bg-white border border-[#eedee9] shadow-[0_4px_30px_-10px_rgba(154,104,155,0.08)] p-6 sm:p-10 flex flex-col justify-center transition-all duration-500">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
            <!-- Centered Real Product Photo (Cols 1-5) -->
            <div class="md:col-span-5 order-2 md:order-1 flex justify-center">
              <div
                class="w-56 sm:w-64 aspect-[4/5] rounded-2xl overflow-hidden border border-[#eedee9] p-3 flex items-center justify-center shadow-xs transition-colors duration-500"
                :class="campaignStore.activeCampaignId === 'hotwheels' ? 'bg-[#7c1a26]/10' : 'bg-[#fbf7fc]'"
              >
                <img
                  :src="campaignStore.activeCampaign.heroPrimaryImage"
                  :alt="campaignStore.activeCampaign.heroPrimaryTitle"
                  width="600"
                  height="750"
                  class="w-full h-full object-contain transition-all duration-500"
                  fetchpriority="high"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>

            <!-- Content (Cols 6-12) -->
            <div class="md:col-span-7 order-1 md:order-2 text-center md:text-left">
              <span
                class="text-xs font-semibold uppercase tracking-widest block mb-2 transition-colors duration-300 justify-center md:justify-start"
                :class="campaignStore.activeCampaignId === 'hotwheels' ? 'text-[#c22b38]' : 'text-[#965e9b]'"
              >
                {{ campaignStore.activeCampaign.badge }}
              </span>

              <h1 class="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#27172b] tracking-tight leading-[1.15] mb-4">
                {{ campaignStore.activeCampaign.heroTitle }}
              </h1>

              <p class="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6 max-w-md">
                {{ campaignStore.activeCampaign.heroSubtitle }}
              </p>

              <div class="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                <a
                  href="#catalogo"
                  class="px-7 py-3 rounded-full text-white text-xs font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer shadow-xs active:scale-95"
                  :class="campaignStore.activeCampaignId === 'hotwheels' ? 'bg-[#c22b38] hover:bg-[#991b1b]' : 'bg-[#27172b] hover:bg-[#caa35f] hover:text-[#27172b] border border-[#caa35f]/50'"
                >
                  Ver Catálogo Completo
                </a>
                <a
                  :href="whatsappCtaUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50 text-xs font-semibold tracking-wide transition-colors cursor-pointer shadow-2xs"
                >
                  <IconWhatsApp customClass="w-4 h-4 text-[#25D366]" />
                  <span>WhatsApp Directo</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Featured Side Showcase (Col 9-12) -->
        <div class="lg:col-span-4 rounded-3xl bg-gradient-to-b from-[#fbf7fc] to-[#f4eaf7] border border-[#eedee9] p-6 sm:p-8 flex flex-col justify-between text-center transition-all duration-500 shadow-[0_4px_24px_-10px_rgba(154,104,155,0.06)]">
          <div>
            <span
              class="text-[11px] font-medium tracking-wider uppercase block mb-1"
              :class="campaignStore.activeCampaignId === 'hotwheels' ? 'text-[#c22b38]' : 'text-[#965e9b]'"
            >
              Destacado • {{ campaignStore.activeCampaign.shortName }}
            </span>
            <h2 class="text-xl sm:text-2xl font-serif font-bold text-[#27172b] tracking-tight mb-1">
              {{ campaignStore.activeCampaign.heroSideTitle }}
            </h2>
            <p class="text-xs text-gray-500 mb-3">
              {{ campaignStore.activeCampaignId === 'hotwheels' ? 'Peluche importado, 2 autos Hot Wheels y rosas eternas.' : 'Peluche original, 3 rosas eternas y maquillaje.' }}
            </p>
            <div class="text-xl font-bold text-[#27172b] mb-4 whitespace-nowrap">
              <span class="text-xs text-[#caa35f] font-semibold uppercase tracking-wider mr-1">Precio</span>
              <span class="whitespace-nowrap">S/&nbsp;{{ Number(campaignStore.activeCampaign.heroSidePrice).toFixed(2) }}</span>
            </div>
          </div>

          <!-- Centered Product Photo -->
          <div class="w-48 sm:w-56 aspect-[4/5] mx-auto rounded-2xl overflow-hidden bg-white border border-[#eedee9] p-3 flex items-center justify-center shadow-xs">
            <img
              :src="campaignStore.activeCampaign.heroSideImage"
              :alt="campaignStore.activeCampaign.heroSideTitle"
              width="600"
              height="750"
              class="w-full h-full object-contain transition-all duration-500"
              fetchpriority="high"
              loading="eager"
              decoding="async"
            />
          </div>

          <div class="mt-4">
            <a
              href="#catalogo"
              class="inline-block w-full py-2.5 rounded-full border border-[#caa35f] text-[#27172b] hover:bg-[#caa35f] hover:text-[#27172b] text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer bg-white/60"
            >
              Explorar Catálogo
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import IconWhatsApp from './icons/IconWhatsApp.vue'
import { useCampaignStore } from '../stores/campaign'

const campaignStore = useCampaignStore()

const whatsappCtaUrl = computed(() => {
  const campaignName = campaignStore.activeCampaign.name
  const text = encodeURIComponent(`Hola Venezzia Detalles, quisiera consultar por el catálogo de ${campaignName}.`)
  return `https://wa.me/51932449996?text=${text}`
})
</script>
