<template>
  <div class="py-12 sm:py-16 bg-[#faf7fb] min-h-screen">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <router-link to="/" class="hover:text-[#965e9b] transition-colors flex items-center gap-1">
          <Home class="w-3.5 h-3.5" />
          <span>Inicio</span>
        </router-link>
        <span>/</span>
        <span class="text-[#27172b] font-semibold">Políticas de Cambios y Devoluciones</span>
      </nav>

      <!-- Main Header Card -->
      <div class="bg-white rounded-3xl p-6 sm:p-10 border border-[#eedee9] shadow-[0_2px_16px_-4px_rgba(154,104,155,0.06)] mb-8">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f6eef8] border border-[#e8d5ec] text-xs font-semibold text-[#753d77] mb-3">
          <RotateCcw class="w-4 h-4 text-[#caa35f]" />
          <span>Garantía de Satisfacción y Transparencia</span>
        </div>
        <h1 class="text-2xl sm:text-4xl font-serif font-bold text-[#27172b] tracking-tight mb-2">
          Política de Cambios, Devoluciones y Cancelaciones
        </h1>
        <p class="text-xs sm:text-sm text-gray-500">
          Última actualización: <strong>Octubre 2026</strong> • VENEZZIA DETALLES (venezzia.shop)
        </p>
      </div>

      <!-- Policy Content Sections -->
      <div class="bg-white rounded-3xl p-6 sm:p-10 border border-[#eedee9] shadow-[0_2px_16px_-4px_rgba(154,104,155,0.06)] space-y-8 text-xs sm:text-sm text-gray-700 leading-relaxed">
        <!-- 1. Compromiso de Calidad -->
        <section class="space-y-3">
          <h2 class="text-base sm:text-lg font-serif font-bold text-[#27172b] pb-2 border-b border-[#f4eaf6] flex items-center gap-2">
            <span class="text-[#caa35f]">1.</span> Nuestro Compromiso de Calidad Boutique
          </h2>
          <p>
            En <strong>Venezzia Detalles</strong> cada arreglo, bouquet y box de regalo se elabora de manera artesanal y minuciosa,
            utilizando rosas eternas naturales preservadas de alta duración (más de 3 años), cosméticos originales de marcas
            reconocidas como <strong>Jarusa</strong> y <strong>Reve'l</strong>, y elementos decorativos de calidad superior.
          </p>
          <p>
            Nuestro objetivo es garantizar una experiencia memorable tanto para quien obsequia como para quien recibe.
            Por ello, establecemos lineamientos claros, justos y conformes a la legislación de protección al consumidor
            de la República del Perú.
          </p>
        </section>

        <!-- 2. Plazos y Procedimiento de Reporte -->
        <section class="space-y-3">
          <h2 class="text-base sm:text-lg font-serif font-bold text-[#27172b] pb-2 border-b border-[#f4eaf6] flex items-center gap-2">
            <span class="text-[#caa35f]">2.</span> Plazo y Procedimiento para Solicitar Cambios o Reposiciones
          </h2>
          <p>
            Si al momento de recibir el producto existe alguna disconformidad o daño visible ocasionado durante el transporte,
            el cliente o receptor deberá reportarlo en un plazo máximo de <strong>24 a 48 horas</strong> posteriores a la entrega.
          </p>
          <div class="p-4 bg-[#faf5fb] rounded-2xl border border-[#eedee9] space-y-2">
            <span class="text-xs font-bold text-[#27172b] block">Pasos para reportar una incidencia:</span>
            <ol class="list-decimal pl-5 space-y-1 text-xs text-gray-600">
              <li>Tomar 2 a 3 fotografías o un video corto donde se aprecie claramente el estado del producto y el empaque.</li>
              <li>Escribir a nuestra línea oficial de atención WhatsApp <strong>+51 932 449 996</strong> o al correo <strong>contacto@venezzia.shop</strong>.</li>
              <li>Indicar el número de pedido o nombre del comprador y describir brevemente lo ocurrido.</li>
              <li>Nuestro equipo de atención evaluará el caso de manera inmediata (tiempo de respuesta promedio: menor a 2 horas en horario de atención).</li>
            </ol>
          </div>
        </section>

        <!-- 3. Causales Aceptadas -->
        <section class="space-y-3">
          <h2 class="text-base sm:text-lg font-serif font-bold text-[#27172b] pb-2 border-b border-[#f4eaf6] flex items-center gap-2">
            <span class="text-[#caa35f]">3.</span> Causales Válidas para Cambio o Reposición Inmediata
          </h2>
          <ul class="list-disc pl-5 space-y-2 text-gray-600">
            <li>
              <strong>Daño en Transporte:</strong> Si el arreglo floral, globo, luces LED o caja llegan con roturas o deformaciones
              imputables al servicio de despacho motorizado o courier. En tal caso, se procede a la reposición o cambio sin ningún
              costo adicional para el cliente.
            </li>
            <li>
              <strong>Error en el Contenido del Detalle:</strong> Si el producto entregado no coincide con el modelo o personaje
              solicitado (ejemplo: se envió un personaje distinto al acordado, o faltó un cosmético estipulado en la lista de items incluidos).
              Se enviará inmediatamente el complemento faltante o el producto correcto.
            </li>
            <li>
              <strong>Defecto de Fabricación:</strong> Falla técnica en luces LED integradas o componentes electrónicos del box al momento de la entrega inicial.
            </li>
          </ul>
        </section>

        <!-- 4. Exclusiones por Higiene y Personalización -->
        <section class="space-y-3">
          <h2 class="text-base sm:text-lg font-serif font-bold text-[#27172b] pb-2 border-b border-[#f4eaf6] flex items-center gap-2">
            <span class="text-[#caa35f]">4.</span> Exclusiones y Restricciones por Salubridad
          </h2>
          <p>
            Por la naturaleza de nuestros productos, no se aceptan cambios ni devoluciones en los siguientes casos:
          </p>
          <ul class="list-disc pl-5 space-y-2 text-gray-600">
            <li>
              <strong>Cosméticos Abiertos o Manipulados:</strong> Por razones estrictas de higiene y salud pública (normativa DIGEMID y sanidad),
              los productos cosméticos y de cuidado facial (labiales, rubores, sombras, polvos compactos, mascarillas) que hayan sido
              desprecintados, abiertos o utilizados por el cliente no admiten devolución alguna.
            </li>
            <li>
              <strong>Productos Personalizados:</strong> Blisters Hot Wheels con fotografías impresas personalizadas o dedicatorias de autor
              una vez impresos y ensamblados.
            </li>
            <li>
              <strong>Errores de Dirección o Ausencia del Receptor:</strong> No procederá devolución de dinero cuando el pedido no haya podido
              ser entregado debido a una dirección incorrecta o inexistente brindada por el comprador, o ante la imposibilidad de contactar
              al receptor en la fecha y rango horario acordados. En tal situación, el pedido retorna al taller para coordinar un reenvío
              con costo de flete a cargo del comprador.
            </li>
          </ul>
        </section>

        <!-- 5. Cancelaciones de Pedidos -->
        <section class="space-y-3">
          <h2 class="text-base sm:text-lg font-serif font-bold text-[#27172b] pb-2 border-b border-[#f4eaf6] flex items-center gap-2">
            <span class="text-[#caa35f]">5.</span> Cancelación y Reprogramación de Pedidos
          </h2>
          <ul class="list-disc pl-5 space-y-2 text-gray-600">
            <li>
              <strong>Cancelación con Reembolso Total:</strong> Podrá solicitarse con un mínimo de <strong>24 horas de anticipación</strong>
              a la fecha y hora programada para la entrega.
            </li>
            <li>
              <strong>Cancelación el Mismo Día o en Ruta:</strong> Los pedidos que ya han sido confeccionados artesanalmente o que ya se
              encuentran en manos del motorizado para entrega no admiten cancelación ni reembolso, debido a que las rosas y materiales
              ya han sido destinados al diseño específico.
            </li>
            <li>
              <strong>Reprogramación de Fecha:</strong> El cliente puede solicitar el cambio de fecha de entrega sin costo alguno avisando
              con al menos 12 horas de anticipación.
            </li>
          </ul>
        </section>

        <!-- 6. Mecanismo de Reembolso Culqi -->
        <section class="space-y-3">
          <h2 class="text-base sm:text-lg font-serif font-bold text-[#27172b] pb-2 border-b border-[#f4eaf6] flex items-center gap-2">
            <span class="text-[#caa35f]">6.</span> Procesamiento y Plazos de Reembolso (Vía Culqi / Transferencia)
          </h2>
          <p>
            Cuando proceda una devolución de dinero aprobada por nuestro equipo de atención:
          </p>
          <ul class="list-disc pl-5 space-y-2 text-gray-600">
            <li>
              <strong>Pagos con Tarjeta vía Culqi:</strong> El reembolso se solicita directamente a través de la pasarela de pagos
              <strong>Culqi</strong> hacia la misma tarjeta (crédito o débito) con la que se efectuó la compra. El tiempo en que el saldo
              se refleja en el estado de cuenta bancario del titular oscila entre <strong>5 y 15 días hábiles</strong>, dependiendo de las
              políticas de liquidación del banco emisor de la tarjeta.
            </li>
            <li>
              <strong>Pagos vía Yape, Plin o Transferencia Bancaria:</strong> Se efectuará la devolución directa a la cuenta de origen
              en un plazo no mayor a <strong>24 a 48 horas hábiles</strong>.
            </li>
            <li>
              <strong>Opción de Vale o Nota de Crédito:</strong> A elección del cliente, se puede emitir una nota de crédito sin fecha
              de vencimiento para ser canjeada en cualquier fecha especial del año en nuestro catálogo.
            </li>
          </ul>
        </section>

        <!-- Action Back Button -->
        <div class="pt-6 border-t border-[#eedee9] flex flex-col sm:flex-row items-center justify-between gap-4">
          <router-link
            to="/"
            class="px-6 py-2.5 rounded-full bg-[#27172b] hover:bg-[#caa35f] hover:text-[#27172b] text-white text-xs font-semibold tracking-wide transition-all border border-[#caa35f]/40 cursor-pointer"
          >
            ← Volver al Catálogo
          </router-link>
          <router-link
            to="/terminos-y-condiciones"
            class="text-xs text-[#965e9b] hover:text-[#caa35f] font-semibold transition-colors"
          >
            Ver Términos y Condiciones Generales →
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Home, RotateCcw } from 'lucide-vue-next'
</script>
