<template>
  <footer id="contacto" class="bg-[#f7eff8] text-[#341d38] pt-14 pb-10 border-t border-[#ebd8e8]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
        <!-- Col 1: Brand & Bio (Cols 1-4) -->
        <div class="lg:col-span-4">
          <!-- Logo footer: nombre + isotipo -->
          <div class="mb-5 flex items-center gap-2.5">
            <img
              src="/marca.png"
              alt="Venezzia Detalles"
              class="h-11 w-auto object-contain drop-shadow-xs"
            />
            <img
              src="/isotipo.png"
              alt="Venezzia Isotipo"
              class="h-9 w-auto object-contain"
            />
          </div>
          <p class="text-xs text-gray-600 leading-relaxed mb-6 pr-4">
            En <strong>Venezzia Detalles</strong> transformamos sentimientos en arreglos únicos y regalos inolvidables. Cuidamos cada flor, color y textura para que tu sorpresa sea perfecta y conmovedora.
          </p>

          <!-- Social Links with Authentic Company Logos -->
          <div class="flex items-center gap-3">
            <!-- Official WhatsApp -->
            <a
              href="https://wa.me/51932449996?text=Hola%20Venezzia%20Detalles"
              target="_blank"
              rel="noopener noreferrer"
              class="w-9 h-9 rounded-full bg-white shadow-xs border border-[#eedee9] flex items-center justify-center text-[#25D366] hover:bg-emerald-50 hover:scale-110 transition-all duration-300"
              title="WhatsApp Oficial (+51 932 449 996)"
            >
              <IconWhatsApp customClass="w-4 h-4" />
            </a>

            <!-- Official Instagram -->
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              class="w-9 h-9 rounded-full bg-white shadow-xs border border-[#eedee9] flex items-center justify-center text-[#E4405F] hover:bg-pink-50 hover:scale-110 transition-all duration-300"
              title="Instagram Oficial"
            >
              <IconInstagram customClass="w-4 h-4" />
            </a>

            <!-- Official TikTok -->
            <a
              href="https://www.tiktok.com/@venezzia.detalles"
              target="_blank"
              rel="noopener noreferrer"
              class="w-9 h-9 rounded-full bg-white shadow-xs border border-[#eedee9] flex items-center justify-center text-gray-900 hover:bg-gray-100 hover:scale-110 transition-all duration-300"
              title="TikTok Oficial (@venezzia.detalles)"
            >
              <IconTikTok customClass="w-4 h-4" />
            </a>

            <!-- Official Facebook -->
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              class="w-9 h-9 rounded-full bg-white shadow-xs border border-[#eedee9] flex items-center justify-center text-[#1877F2] hover:bg-blue-50 hover:scale-110 transition-all duration-300"
              title="Facebook Oficial"
            >
              <IconFacebook customClass="w-4 h-4" />
            </a>
          </div>
        </div>

        <!-- Col 2: Fechas Especiales & Catálogos (Cols 5-6) -->
        <div class="lg:col-span-2">
          <h4 class="text-xs font-serif font-bold uppercase tracking-widest text-[#27172b] mb-4">
            Fechas Especiales
          </h4>
          <ul class="space-y-2.5 text-xs text-gray-600">
            <li>
              <button
                @click="selectCampaign('maquillaje')"
                class="hover:text-[#965e9b] transition-colors text-left flex items-center gap-1.5 cursor-pointer"
              >
                <span>Día del Maquillaje</span>
              </button>
            </li>
            <li>
              <button
                @click="selectCampaign('hotwheels')"
                class="hover:text-[#c22b38] transition-colors text-left flex items-center gap-1.5 cursor-pointer"
              >
                <span>Día Hot Wheels</span>
              </button>
            </li>
            <li><a href="#envios" class="hover:text-[#965e9b] transition-colors">Tarifas de Envíos</a></li>
            <li><a href="#inicio" class="hover:text-[#965e9b] transition-colors">Volver al Inicio</a></li>
          </ul>
        </div>

        <!-- Col 3: Atención al Cliente (Cols 7-8) -->
        <div class="lg:col-span-2">
          <h4 class="text-xs font-serif font-bold uppercase tracking-widest text-[#27172b] mb-4">
            Atención
          </h4>
          <ul class="space-y-2.5 text-xs text-gray-600">
            <li><a href="#" class="hover:text-[#965e9b] transition-colors">Términos y condiciones</a></li>
            <li><a href="#" class="hover:text-[#965e9b] transition-colors">Políticas de entrega</a></li>
            <li><a href="#" class="hover:text-[#965e9b] transition-colors">Cuidados de flores</a></li>
            <li><a href="#" class="hover:text-[#965e9b] transition-colors">Preguntas frecuentes</a></li>
          </ul>
        </div>

        <!-- Col 4: Información de Contacto con WhatsApp (Cols 9-10) -->
        <div class="lg:col-span-2">
          <h4 class="text-xs font-serif font-bold uppercase tracking-widest text-[#27172b] mb-4">
            Contacto
          </h4>
          <ul class="space-y-2.5 text-xs text-gray-600">
            <li class="flex items-center gap-1.5"><MapPin class="w-3.5 h-3.5 text-[#caa35f] shrink-0" /> Lima, Perú</li>
            <li>
              <a
                href="https://wa.me/51932449996?text=Hola%20Venezzia%20Detalles,%20quisiera%20hacer%20un%20pedido"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 text-emerald-700 font-bold hover:underline"
              >
                <IconWhatsApp customClass="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                <span>+51 932 449 996</span>
              </a>
            </li>
            <li class="flex items-center gap-1.5"><Mail class="w-3.5 h-3.5 text-[#caa35f] shrink-0" /> pedidos@venezziadetalles.pe</li>
            <li class="text-[11px] text-gray-500 pt-1">Atención personalizada y dedicatorias por WhatsApp.</li>
          </ul>
        </div>

        <!-- Col 5: Formas de Pago con Logos Oficiales de Empresas (Cols 11-12) -->
        <div class="lg:col-span-2">
          <h4 class="text-xs font-serif font-bold uppercase tracking-widest text-[#27172b] mb-4">
            Medios de Pago
          </h4>
          <p class="text-[11px] text-gray-500 mb-3.5 leading-relaxed">
            Transacciones 100% cifradas y protegidas vía pasarela <strong>Culqi</strong>.
          </p>

          <!-- Authentic Brand Payment Badges (Real Official Logos) -->
          <div class="flex flex-wrap gap-2 items-center">
            <!-- Visa -->
            <div class="h-8.5 px-2 bg-white rounded-xl border border-[#eedee9] shadow-2xs hover:scale-105 transition-transform flex items-center justify-center" title="Visa Oficial">
              <img src="/payments/visa.png" alt="Visa" class="h-5 w-auto object-contain" />
            </div>

            <!-- Mastercard -->
            <div class="h-8.5 px-2 bg-white rounded-xl border border-[#eedee9] shadow-2xs hover:scale-105 transition-transform flex items-center justify-center" title="Mastercard Oficial">
              <img src="/payments/mastercard.png" alt="Mastercard" class="h-5 w-auto object-contain" />
            </div>

            <!-- Yape Oficial -->
            <div class="h-8.5 px-2 bg-white rounded-xl border border-[#eedee9] shadow-2xs hover:scale-105 transition-transform flex items-center justify-center" title="Yape Oficial">
              <img src="/payments/yape.png" alt="Yape" class="h-6 w-auto object-contain" />
            </div>

            <!-- Plin Oficial -->
            <div class="h-8.5 px-2 bg-white rounded-xl border border-[#eedee9] shadow-2xs hover:scale-105 transition-transform flex items-center justify-center" title="Plin Oficial">
              <img src="/payments/plin.png" alt="Plin" class="h-6 w-auto object-contain" />
            </div>

            <!-- BCP Oficial -->
            <div class="h-8.5 px-2.5 bg-white rounded-xl border border-[#eedee9] shadow-2xs hover:scale-105 transition-transform flex items-center justify-center" title="Banco de Crédito BCP">
              <img src="/payments/bcp.png" alt="BCP" class="h-4 w-auto object-contain" />
            </div>

            <!-- BBVA Oficial -->
            <div class="h-8.5 px-2.5 bg-white rounded-xl border border-[#eedee9] shadow-2xs hover:scale-105 transition-transform flex items-center justify-center" title="BBVA">
              <img src="/payments/bbva.png" alt="BBVA" class="h-3.5 w-auto object-contain" />
            </div>

            <!-- Culqi Oficial -->
            <div class="h-8.5 px-2.5 bg-white rounded-xl border border-[#eedee9] shadow-2xs hover:scale-105 transition-transform flex items-center justify-center" title="Culqi Pasarela Segura">
              <img src="/payments/culqi.svg" alt="Culqi" class="h-4 w-auto object-contain" />
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom bar: Libro de Reclamaciones & Copyright -->
      <div class="pt-6 border-t border-[#ebd8e8] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <div class="flex items-center gap-3">
          <div class="px-3 py-1.5 rounded-lg bg-white border border-[#eedee9] flex items-center gap-2 shadow-2xs">
            <BookOpen class="w-4 h-4 text-[#caa35f]" />
            <span class="text-[10px] font-bold text-[#27172b] uppercase tracking-wider">Libro de Reclamaciones</span>
          </div>
        </div>
        <div>
          <span>VENEZZIA DETALLES - Todos los Derechos Reservados {{ new Date().getFullYear() }}</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import {
  MapPin,
  Mail,
  BookOpen
} from 'lucide-vue-next'
import IconWhatsApp from './icons/IconWhatsApp.vue'
import IconInstagram from './icons/IconInstagram.vue'
import IconTikTok from './icons/IconTikTok.vue'
import IconFacebook from './icons/IconFacebook.vue'
import { useCampaignStore } from '../stores/campaign'

const campaignStore = useCampaignStore()

function selectCampaign(id) {
  campaignStore.setCampaign(id)
  const el = document.getElementById('catalogo')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>
