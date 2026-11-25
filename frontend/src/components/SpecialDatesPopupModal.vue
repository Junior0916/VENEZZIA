<template>
  <transition
    enter-active-class="transition-all duration-400 cubic-bezier(0.16, 1, 0.3, 1)"
    enter-from-class="opacity-0 translate-y-6 sm:translate-y-4 scale-95"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition-all duration-300 ease-in"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 translate-y-4 scale-95"
  >
    <div
      v-if="isOpen"
      class="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 z-45 max-w-sm w-[calc(100vw-2rem)] sm:w-96"
      role="dialog"
      aria-labelledby="dates-popup-title"
    >
      <!-- Boutique Rosatel-style Card -->
      <div
        class="relative bg-white/98 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-[#eedee9] shadow-[0_12px_40px_-10px_rgba(150,94,155,0.22)] ring-1 ring-[#965e9b]/10 overflow-hidden"
      >
        <!-- Soft Ambient Background Gradient Glow -->
        <div
          class="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br from-[#f5ebf7] to-[#faedd6]/60 blur-2xl pointer-events-none"
          aria-hidden="true"
        />

        <!-- Close Button -->
        <button
          @click="handleDismiss"
          class="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-gray-100/80 hover:bg-[#faf4f9] text-gray-400 hover:text-[#965e9b] flex items-center justify-center transition-all cursor-pointer z-10"
          aria-label="Cerrar aviso de fechas especiales"
          title="Cerrar"
        >
          <X class="w-4 h-4" />
        </button>

        <div class="relative z-1">
          <!-- Header: Icon & Category Tag -->
          <div class="flex items-center gap-2.5 mb-3">
            <div
              class="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#965e9b] to-[#7a3f80] text-[#fdf8ee] flex items-center justify-center shadow-sm shrink-0"
            >
              <CalendarHeart class="w-5 h-5 text-[#caa35f]" />
            </div>
            <div>
              <span class="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-[#965e9b] bg-[#fbf2fc] px-2 py-0.5 rounded-full border border-[#eedee9]">
                <Sparkles class="w-2.5 h-2.5 text-[#caa35f]" />
                <span>NUEVO EN VENEZZIA</span>
              </span>
            </div>
          </div>

          <!-- Title -->
          <h3
            id="dates-popup-title"
            class="text-base sm:text-lg font-serif font-bold text-[#27172b] leading-snug tracking-tight mb-2"
          >
            ¡Ya puedes guardar tus fechas especiales!
          </h3>

          <!-- Description -->
          <p class="text-xs text-gray-600 leading-relaxed mb-4">
            Registra cumpleaños, aniversarios y esas fechas que no quieres olvidar. Nosotros te recordaremos por WhatsApp con la anticipación que elijas para que prepares su detalle con tiempo.
          </p>

          <!-- CTA Actions -->
          <div class="flex items-center gap-2 pt-1">
            <button
              @click="handleOpenDates"
              class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#27172b] via-[#432049] to-[#7a3f80] hover:from-[#7a3f80] hover:to-[#965e9b] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group active:scale-98"
            >
              <span>Ir a Mis fechas especiales</span>
              <ArrowRight class="w-3.5 h-3.5 text-[#caa35f] group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              @click="handleDismiss"
              class="px-3 py-2.5 rounded-2xl text-xs font-semibold text-gray-400 hover:text-gray-600 hover:bg-gray-100/70 transition-colors cursor-pointer shrink-0"
            >
              Ahora no
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'
import { CalendarHeart, Sparkles, ArrowRight, X } from 'lucide-vue-next'
import { useSpecialDatesStore } from '../stores/specialDates'

const specialDatesStore = useSpecialDatesStore()

const isOpen = computed(() => specialDatesStore.isPopupOpen)

function handleDismiss() {
  specialDatesStore.closePopup()
}

function handleOpenDates() {
  specialDatesStore.openModal('add')
}
</script>
