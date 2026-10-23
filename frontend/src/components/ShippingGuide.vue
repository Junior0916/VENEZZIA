<template>
  <section id="envios" class="py-14 sm:py-20 bg-white/70 backdrop-blur-xs border-t border-[#eedee9]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center max-w-xl mx-auto mb-10">
        <span class="text-xs uppercase tracking-widest font-semibold text-[#965e9b] block mb-1">
          Guía Oficial Venezzia
        </span>
        <h2 class="text-2xl sm:text-3xl font-serif font-bold text-[#27172b] tracking-tight">
          Proceso de Pedido y Tarifas de Envío
        </h2>
        <p class="text-xs sm:text-sm text-gray-500 mt-1">
          Atención personalizada inmediata y despachos coordinados en todo el Perú
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <!-- Card 1: Envíos en Lima -->
        <div class="bg-[#faf6fc] rounded-3xl p-6 sm:p-8 border border-[#eedee9] shadow-[0_2px_16px_-4px_rgba(154,104,155,0.06)]">
          <div class="flex items-center gap-2.5 mb-1">
            <Truck class="w-5 h-5 text-[#965e9b]" />
            <h3 class="text-base sm:text-lg font-serif font-bold text-[#27172b]">
              Envíos en Lima y Callao
            </h3>
          </div>
          <span class="text-xs text-[#965e9b] font-medium block mb-4">Entrega directa en la puerta de tu domicilio</span>

          <div class="space-y-3.5 text-xs text-gray-600 leading-relaxed">
            <div class="p-3.5 bg-white rounded-2xl border border-[#eedee9] space-y-2">
              <div class="flex items-center justify-between font-semibold text-gray-800">
                <span>Motorizado Lima Norte y Centro:</span>
                <span class="text-[#caa35f] font-bold text-sm">S/ 10.00</span>
              </div>
              <div class="flex items-center justify-between font-semibold text-gray-800">
                <span>Motorizado Lima Sur:</span>
                <span class="text-[#caa35f] font-bold text-sm">S/ 15.00</span>
              </div>
            </div>

            <p>
              <strong class="text-gray-900 font-semibold">• Despacho por InDrive:</strong>
              Coordinamos la tarifa exacta del aplicativo al momento del despacho hacia tu ubicación o distrito específico.
            </p>
            <p>
              <strong class="text-gray-900 font-semibold">• Anticipo para agendar:</strong>
              Todo pedido en Lima se agenda con un anticipo de <strong class="text-[#27172b]">S/ 30.00</strong> y la diferencia se abona al momento de la entrega.
            </p>
          </div>
        </div>

        <!-- Card 2: Envíos a Provincias por Shalom / Olva -->
        <div class="bg-[#faf6fc] rounded-3xl p-6 sm:p-8 border border-[#eedee9] shadow-[0_2px_16px_-4px_rgba(154,104,155,0.06)]">
          <div class="flex items-center gap-2.5 mb-1">
            <Package class="w-5 h-5 text-[#965e9b]" />
            <h3 class="text-base sm:text-lg font-serif font-bold text-[#27172b]">
              Envíos a Todo el Perú (Shalom / Olva)
            </h3>
          </div>
          <span class="text-xs text-[#965e9b] font-medium block mb-4">Llegamos a todas las ciudades del país</span>

          <div class="space-y-3.5 text-xs text-gray-600 leading-relaxed">
            <p>
              <strong class="text-gray-900 font-semibold">1. Agencias autorizadas:</strong>
              Enviamos mediante <strong class="text-gray-900 font-semibold">Shalom Courier</strong> y <strong class="text-gray-900 font-semibold">Olva Courier</strong> con retiro en agencia o a domicilio.
            </p>
            <p>
              <strong class="text-gray-900 font-semibold">2. Embalaje protegido:</strong>
              Caja especial para cuidar tu arreglo durante el viaje (+S/ 5.00 para Ramos / +S/ 3.00 para Boxes).
            </p>
            <p>
              <strong class="text-gray-900 font-semibold">3. Pago y seguimiento:</strong>
              Se reserva con el 50% de anticipo. Te compartimos la foto de la guía con código de seguimiento en tiempo real.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Truck, Package } from 'lucide-vue-next'
</script>
