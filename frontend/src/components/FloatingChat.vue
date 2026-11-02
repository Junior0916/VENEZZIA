<template>
  <div class="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
    <!-- Speech Bubble Tooltip -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-3 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="showTooltip"
        class="pointer-events-auto relative max-w-xs bg-white/95 backdrop-blur-md text-gray-800 text-xs p-4 rounded-2xl shadow-[0_10px_25px_-5px_rgba(37,211,102,0.2)] border border-emerald-100 flex items-start gap-3"
      >
        <div class="w-8 h-8 rounded-full bg-emerald-50 text-[#25D366] flex items-center justify-center shrink-0">
          <IconWhatsApp customClass="w-4 h-4" />
        </div>
        <div class="flex-1">
          <span class="block text-[10px] uppercase tracking-wider font-bold text-emerald-700 mb-0.5">
            Asesora Online Venezzia
          </span>
          <p class="leading-relaxed text-gray-600 font-medium">
            ¡Hola! ¿Deseas consultar disponibilidad o personalizar tu dedicatoria especial?
          </p>
        </div>
        <button
          @click="showTooltip = false"
          class="text-gray-400 hover:text-gray-600 cursor-pointer -mt-1 -mr-1 p-1"
          aria-label="Cerrar mensaje"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>
    </transition>

    <!-- Floating Official WhatsApp Action Button with Radar Glow -->
    <div class="relative pointer-events-auto">
      <!-- Radar Pulse Rings -->
      <span class="absolute -inset-1 rounded-full bg-emerald-400/40 animate-ping pointer-events-none"></span>

      <a
        :href="whatsappUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="relative w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-lg shadow-emerald-500/35 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer group"
        aria-label="Contactar a Venezzia Detalles por WhatsApp oficial"
        :title="'Escríbenos a ' + siteSettingsStore.formattedPhone"
      >
        <!-- Authentic Official WhatsApp Icon -->
        <IconWhatsApp customClass="w-7 h-7 text-white drop-shadow-xs" />
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { X } from 'lucide-vue-next'
import IconWhatsApp from './icons/IconWhatsApp.vue'
import { useSiteSettingsStore } from '../stores/siteSettings'

const siteSettingsStore = useSiteSettingsStore()
const showTooltip = ref(true)

const whatsappUrl = computed(() => {
  return siteSettingsStore.whatsappLink('Hola Venezzia Detalles, quisiera consultar sobre un arreglo de rosas eternas para entrega.')
})
</script>
