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
        <span class="text-[#27172b] font-semibold">Términos y Condiciones</span>
      </nav>

      <!-- Main Header Card -->
      <div class="bg-white rounded-3xl p-6 sm:p-10 border border-[#eedee9] shadow-[0_2px_16px_-4px_rgba(154,104,155,0.06)] mb-8">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f6eef8] border border-[#e8d5ec] text-xs font-semibold text-[#753d77] mb-3">
          <ShieldCheck class="w-4 h-4 text-[#caa35f]" />
          <span>Marco Legal y Transparencia Comercial</span>
        </div>
        <h1 class="text-2xl sm:text-4xl font-serif font-bold text-[#27172b] tracking-tight mb-2">
          Términos y Condiciones de Uso
        </h1>
        <p class="text-xs sm:text-sm text-gray-500">
          Última actualización: <strong>Octubre 2026</strong> • VENEZZIA DETALLES (venezzia.shop)
        </p>
      </div>

      <!-- Legal Content Sections -->
      <div class="bg-white rounded-3xl p-6 sm:p-10 border border-[#eedee9] shadow-[0_2px_16px_-4px_rgba(154,104,155,0.06)] space-y-8 text-xs sm:text-sm text-gray-700 leading-relaxed">
        <!-- 1. Generalidades -->
        <section class="space-y-3">
          <h2 class="text-base sm:text-lg font-serif font-bold text-[#27172b] pb-2 border-b border-[#f4eaf6] flex items-center gap-2">
            <span class="text-[#caa35f]">1.</span> Identificación de la Empresa y Aceptación
          </h2>
          <p>
            El presente documento establece los Términos y Condiciones que rigen el acceso y uso del sitio web oficial
            <strong>https://venezzia.shop</strong>, de propiedad y operación comercial bajo la marca
            <strong>VENEZZIA DETALLES</strong>, con domicilio en la ciudad de Lima, República del Perú, y canales
            de contacto oficiales: correo electrónico <strong>contacto@venezzia.shop</strong> y línea de atención al cliente
            WhatsApp <strong>+51 932 449 996</strong>.
          </p>
          <p>
            Al navegar en nuestra plataforma, registrar un pedido o efectuar un pago electrónico, el usuario declara haber leído,
            entendido y aceptado íntegramente las cláusulas aquí descritas conforme a la legislación peruana vigente.
          </p>
        </section>

        <!-- 2. Catálogo y Productos -->
        <section class="space-y-3">
          <h2 class="text-base sm:text-lg font-serif font-bold text-[#27172b] pb-2 border-b border-[#f4eaf6] flex items-center gap-2">
            <span class="text-[#caa35f]">2.</span> Productos, Catálogo y Disponibilidad
          </h2>
          <p>
            <strong>Venezzia Detalles</strong> se especializa en el diseño de arreglos florales boutique con rosas eternas
            preservadas, boxes temáticos de autor, sets de cosmética con productos oficiales de marcas autorizadas como
            <strong>Jarusa</strong> y <strong>Reve'l</strong>, peluches importados y piezas coleccionables Hot Wheels en empaques
            personalizados.
          </p>
          <p>
            Las fotografías y descripciones de nuestro catálogo representan con fidelidad el contenido de cada arreglo.
            Por tratarse de productos elaborados artesanalmente y flores naturales preservadas, pueden presentarse leves
            variaciones en tonalidad o disposición que no alteran la calidad ni la cantidad de elementos garantizados en la
            ficha técnica del producto.
          </p>
        </section>

        <!-- 3. Precios y Moneda -->
        <section class="space-y-3">
          <h2 class="text-base sm:text-lg font-serif font-bold text-[#27172b] pb-2 border-b border-[#f4eaf6] flex items-center gap-2">
            <span class="text-[#caa35f]">3.</span> Precios y Moneda de Pago
          </h2>
          <p>
            Todos los precios publicados en la plataforma están expresados en <strong>Soles peruanos (PEN - S/.)</strong>
            e incluyen los tributos correspondientes. Los costos de envío o embalaje especial para provincias se informan y
            desglosan con claridad antes de la confirmación final de la compra.
          </p>
        </section>

        <!-- 4. Pasarela de Pago y Seguridad -->
        <section class="space-y-3">
          <h2 class="text-base sm:text-lg font-serif font-bold text-[#27172b] pb-2 border-b border-[#f4eaf6] flex items-center gap-2">
            <span class="text-[#caa35f]">4.</span> Medios de Pago y Pasarela Segura Culqi
          </h2>
          <p>
            Para garantizar la máxima seguridad en las transacciones digitales, los pagos electrónicos con tarjetas de crédito
            o débito (Visa, Mastercard, American Express, Diners Club) y billeteras móviles (Yape y Plin) son procesados
            directamente a través de la pasarela de pagos autorizada <strong>Culqi</strong>.
          </p>
          <div class="p-4 bg-[#faf5fb] rounded-2xl border border-[#eedee9] space-y-2">
            <div class="flex items-center gap-2 text-[#27172b] font-semibold text-xs sm:text-sm">
              <Lock class="w-4 h-4 text-[#caa35f]" />
              <span>Seguridad de Datos Bancarios (Estándar PCI-DSS)</span>
            </div>
            <p class="text-xs text-gray-600">
              Venezzia Detalles nunca almacena ni tiene acceso a los números de tarjeta, códigos CVV o contraseñas bancarias
              del comprador. Toda la información financiera viaja encriptada mediante protocolo SSL (Secure Socket Layer) y
              es procesada de forma segura por los servidores certificados de Culqi.
            </p>
          </div>
          <p>
            Asimismo, disponemos de la modalidad de coordinación y reserva directa mediante WhatsApp con abonos por Yape, Plin
            o transferencias bancarias a cuentas oficiales de la empresa (BCP e Interbank).
          </p>
        </section>

        <!-- 5. Envíos y Despacho -->
        <section class="space-y-3">
          <h2 class="text-base sm:text-lg font-serif font-bold text-[#27172b] pb-2 border-b border-[#f4eaf6] flex items-center gap-2">
            <span class="text-[#caa35f]">5.</span> Políticas de Entrega y Despacho
          </h2>
          <ul class="list-disc pl-5 space-y-2 text-gray-600">
            <li>
              <strong>Envíos en Lima y Callao:</strong> Se efectúan mediante motorizados especializados y servicio de aplicativo
              (InDrive/taxi coordinado). Los despachos se programan con un anticipo mínimo de S/ 30.00 o pago total vía Culqi,
              pudiéndose cancelar la diferencia contraentrega si aplica.
            </li>
            <li>
              <strong>Envíos a Provincias:</strong> Se gestionan a través de empresas de transporte autorizadas (Shalom Courier
              y Olva Courier). Todo despacho a provincia se envía debidamente acondicionado en caja de embalaje reforzada
              y con fotografía de la guía de remisión compartida al cliente para seguimiento en tiempo real.
            </li>
            <li>
              <strong>Responsabilidad de la Dirección:</strong> El cliente es responsable de consignar una dirección válida,
              referencias precisas y número telefónico operativo del destinatario. En caso de ausencia en el domicilio tras los
              intentos coordinados, el reenvío generará un costo adicional de transporte.
            </li>
          </ul>
        </section>

        <!-- 6. Protección de Datos -->
        <section class="space-y-3">
          <h2 class="text-base sm:text-lg font-serif font-bold text-[#27172b] pb-2 border-b border-[#f4eaf6] flex items-center gap-2">
            <span class="text-[#caa35f]">6.</span> Protección de Datos Personales (Ley N° 29733)
          </h2>
          <p>
            En cumplimiento de la <strong>Ley N° 29733 (Ley de Protección de Datos Personales de la República del Perú)</strong>
            y su Reglamento, Venezzia Detalles garantiza que los datos personales recabados (nombres, números telefónicos,
            direcciones de despacho y correos) serán tratados de manera confidencial y utilizados exclusivamente para la
            gestión de pedidos, facturación, entrega de comprobantes y comunicación del estado de su entrega. En ningún caso
            serán vendidos o cedidos a terceros.
          </p>
        </section>

        <!-- 7. Libro de Reclamaciones -->
        <section class="space-y-3">
          <h2 class="text-base sm:text-lg font-serif font-bold text-[#27172b] pb-2 border-b border-[#f4eaf6] flex items-center gap-2">
            <span class="text-[#caa35f]">7.</span> Libro de Reclamaciones y Solución de Controversias
          </h2>
          <p>
            Conforme a lo dispuesto por el <strong>Código de Protección y Defensa del Consumidor (Ley N° 29571)</strong> y las
            directivas de <strong>INDECOPI</strong>, ponemos a disposición de nuestros usuarios nuestro
            <router-link to="/libro-de-reclamaciones" class="text-[#965e9b] font-bold hover:underline">
              Libro de Reclamaciones Virtual
            </router-link>,
            el cual se encuentra 100% integrado a esta plataforma web para registrar cualquier queja o reclamo con código
            correlativo y respuesta formal en un plazo no mayor a 15 días hábiles improrrogables.
          </p>
        </section>

        <!-- 8. Ley Aplicable y Jurisdicción -->
        <section class="space-y-3">
          <h2 class="text-base sm:text-lg font-serif font-bold text-[#27172b] pb-2 border-b border-[#f4eaf6] flex items-center gap-2">
            <span class="text-[#caa35f]">8.</span> Legislación Aplicable y Jurisdicción
          </h2>
          <p>
            Los presentes Términos y Condiciones se rigen e interpretan bajo las leyes de la República del Perú. Para cualquier
            controversia que pudiera suscitarse respecto a la validez, ejecución o interpretación de los mismos, las partes se
            someten a la competencia de los jueces y tribunales del distrito judicial de Lima.
          </p>
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
            to="/politicas-de-cambio"
            class="text-xs text-[#965e9b] hover:text-[#caa35f] font-semibold transition-colors"
          >
            Ver Políticas de Cambios y Devoluciones →
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Home, ShieldCheck, Lock } from 'lucide-vue-next'
</script>
