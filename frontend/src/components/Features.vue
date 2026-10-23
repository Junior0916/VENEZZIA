<template>
  <section id="beneficios" class="py-16 sm:py-24 bg-white border-y border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto mb-16">
        <span class="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
          Nuestra Promesa
        </span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          ¿Por qué comprar con nosotros?
        </h2>
        <p class="mt-3 text-base text-gray-500">
          Diseñado para brindarte una experiencia de compra online sin fricciones, rápida y transparente.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Feature 1 -->
        <div class="p-8 rounded-2xl bg-gray-50/70 border border-gray-100 hover:border-amber-200 hover:shadow-lg transition-all group">
          <div class="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Zap class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">Compra en 1 Solo Paso</h3>
          <p class="text-sm text-gray-600 leading-relaxed">
            Sin registros largos ni formularios confusos. Elige tu producto, añade tu dirección y paga en segundos.
          </p>
        </div>

        <!-- Feature 2 -->
        <div class="p-8 rounded-2xl bg-gray-50/70 border border-gray-100 hover:border-amber-200 hover:shadow-lg transition-all group">
          <div class="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Lock class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">Pasarela Culqi Segura</h3>
          <p class="text-sm text-gray-600 leading-relaxed">
            Tus transacciones se procesan bajo los más altos estándares de seguridad bancaria con tokenización de Culqi.
          </p>
        </div>

        <!-- Feature 3 -->
        <div class="p-8 rounded-2xl bg-gray-50/70 border border-gray-100 hover:border-amber-200 hover:shadow-lg transition-all group">
          <div class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Headphones class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">Soporte por WhatsApp</h3>
          <p class="text-sm text-gray-600 leading-relaxed">
            ¿Dudas con tu pedido? Comunícate directamente con nosotros para resolver cualquier inquietud al instante.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Zap, Lock, Headphones } from 'lucide-vue-next'
</script>
