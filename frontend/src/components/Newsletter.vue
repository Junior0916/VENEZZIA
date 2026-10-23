<template>
  <section class="py-8 sm:py-12 bg-[#faf7fb]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Rounded Soft Lilac & Velvet Plum Luxury Container with Champagne Gold Accent -->
      <div class="rounded-3xl bg-gradient-to-r from-[#6e3f73] via-[#86518c] to-[#9e67a3] p-7 sm:p-12 text-white shadow-[0_20px_45px_-15px_rgba(110,63,115,0.35)] border border-[#caa35f]/40 relative overflow-hidden">
        <!-- Subtle Glow Effects -->
        <div class="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          <!-- Text left -->
          <div class="lg:col-span-7">
            <span class="text-[10px] uppercase tracking-widest font-semibold text-purple-200 block mb-1">
              Comunidad Privada Venezzia
            </span>
            <h3 class="text-2xl sm:text-3xl font-serif tracking-tight mb-2">
              Suscríbete a Nuestro Club de Beneficios
            </h3>
            <p class="text-xs sm:text-sm text-purple-100 font-light leading-relaxed max-w-xl">
              Recibe acceso anticipado a nuestras colecciones de San Valentín, Día de la Madre y fechas especiales, además de descuentos exclusivos en flores seleccionadas.
            </p>
          </div>

          <!-- Form right -->
          <div class="lg:col-span-5">
            <form @submit.prevent="handleSubscribe" class="flex flex-col sm:flex-row items-center gap-2.5">
              <input
                v-model="email"
                type="email"
                required
                placeholder="Ingresa tu correo electrónico..."
                class="w-full bg-white text-[#27172b] text-xs px-5 py-3.5 rounded-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#caa35f] shadow-inner"
              />
              <button
                type="submit"
                class="w-full sm:w-auto shrink-0 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#caa35f] to-[#b0873b] hover:from-[#d4af37] hover:to-[#caa35f] text-[#27172b] text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-md active:scale-98"
              >
                Suscribirme
              </button>
            </form>
            <p v-if="subscribed" class="text-xs text-purple-100 mt-2 font-medium">
              ¡Gracias por unirte a Venezzia Detalles! Pronto recibirás novedades.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const subscribed = ref(false)

function handleSubscribe() {
  if (email.value) {
    subscribed.value = true
    email.value = ''
    setTimeout(() => {
      subscribed.value = false
    }, 4000)
  }
}
</script>
