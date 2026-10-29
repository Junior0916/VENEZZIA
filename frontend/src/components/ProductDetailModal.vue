<template>
  <div v-if="product" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div
      @click="$emit('close')"
      class="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
    ></div>

    <!-- Modal Card (Clean, Balanced, Editorial) -->
    <div class="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#eedee9] z-10 max-h-[92vh] overflow-y-auto">
      <!-- Close button -->
      <button
        @click="$emit('close')"
        class="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-[#f6eef8] transition-colors cursor-pointer"
        aria-label="Cerrar modal"
      >
        <X class="w-5 h-5" />
      </button>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
        <!-- Image & Gallery Showcase (Cols 1-5) -->
        <div class="md:col-span-5 flex flex-col items-center">
          <!-- Main Selected Image Container (4:5 Luxury Ratio - 600x750 Framing) -->
          <div
            @click="openLightbox"
            class="group relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-[#faf6f5] border border-[#eedee9] p-2.5 sm:p-3 flex items-center justify-center shadow-xs cursor-zoom-in"
            title="Clic para ampliar en alta definición"
          >
            <img
              :src="currentDisplayImage"
              :alt="product.name"
              class="w-full h-full object-cover object-center rounded-xl transition-all duration-300 group-hover:scale-[1.03]"
            />

            <!-- Visual Magnifier Hint Pill -->
            <div class="absolute bottom-4 right-4 bg-black/60 group-hover:bg-black/85 backdrop-blur-md text-white text-[11px] font-medium py-1.5 px-3 rounded-full flex items-center gap-1.5 shadow-lg opacity-90 group-hover:opacity-100 transition-all pointer-events-none">
              <ZoomIn class="w-3.5 h-3.5 text-[#caa35f]" />
              <span>Ampliar foto</span>
            </div>
          </div>

          <!-- Gallery Toggle (When Official Catalog Card Exists) -->
          <div v-if="product.catalog_card" class="flex items-center gap-2 mt-3 w-full">
            <button
              @click="activeImageView = 'product'"
              :class="[
                'flex-1 py-1.5 px-2 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer',
                activeImageView === 'product'
                  ? 'bg-[#27172b] text-white border-[#caa35f]/60 shadow-xs'
                  : 'bg-white text-gray-600 border-[#eedee9] hover:bg-[#fbf7fc]'
              ]"
            >
              Foto del Detalle
            </button>
            <button
              @click="activeImageView = 'card'"
              :class="[
                'flex-1 py-1.5 px-2 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer',
                activeImageView === 'card'
                  ? 'bg-[#c22b38] text-white border-[#c22b38] shadow-xs'
                  : 'bg-white text-gray-600 border-[#eedee9] hover:bg-[#fbf7fc]'
              ]"
            >
              Ficha del Catálogo
            </button>
          </div>

          <!-- Direct Link Copy Pill -->
          <button
            @click="copyDirectLink"
            class="mt-2.5 inline-flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-[#965e9b] transition-colors cursor-pointer"
            title="Copiar enlace directo de este producto"
          >
            <LinkIcon class="w-3.5 h-3.5" />
            <span>{{ copiedLink ? '¡Enlace copiado!' : 'Copiar enlace directo' }}</span>
          </button>
        </div>

        <!-- Product Information (Cols 6-12) -->
        <div class="md:col-span-7 flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span
                class="text-xs font-semibold uppercase tracking-wider block"
                :class="product.campaign === 'hotwheels' ? 'text-[#c22b38]' : 'text-[#965e9b]'"
              >
                {{ product.category }}
              </span>
              <span
                v-if="product.original_price"
                class="px-2 py-0.2 rounded-full text-[10px] font-bold uppercase"
                :class="product.campaign === 'hotwheels' ? 'bg-[#fee2e2] text-[#b91c1c]' : 'bg-[#fffdf5] text-[#926014] border border-[#f3e1b9]'"
              >
                Promoción
              </span>
            </div>

            <h3 class="text-xl sm:text-2xl font-serif font-bold text-[#27172b] mb-2 leading-snug">
              {{ product.name }}
            </h3>

            <!-- Price Breakdown -->
            <div class="flex items-baseline gap-2 mb-3">
              <span
                v-if="product.original_price && selectedAddon === 'none'"
                class="text-sm text-gray-400 line-through"
              >
                S/ {{ Number(product.original_price).toFixed(2) }}
              </span>
              <div class="text-2xl sm:text-3xl font-bold text-[#27172b]">
                S/ {{ computedFinalPrice.toFixed(2) }}
              </div>
              <span v-if="selectedAddon !== 'none'" class="text-[11px] text-gray-500 font-medium">
                (incluye auto adicional)
              </span>
            </div>

            <p class="text-xs text-gray-600 mb-4 leading-relaxed">
              {{ product.description }}
            </p>

            <!-- Optional Add-on for Hot Wheels Campaign (from Page 21) -->
            <div v-if="product.campaign === 'hotwheels'" class="bg-[#fff9fa] rounded-2xl p-3.5 border border-[#fee2e2] mb-4">
              <label class="text-[11px] font-bold uppercase tracking-wider text-gray-800 block mb-2 flex items-center justify-between">
                <span>¿Deseas añadir otro carrito Hot Wheels?</span>
                <span class="text-[10px] font-normal text-gray-500">Opcional</span>
              </label>
              <div class="space-y-1.5 text-xs">
                <label class="flex items-center justify-between p-2 rounded-xl border border-gray-200/80 hover:bg-white cursor-pointer transition-colors" :class="selectedAddon === 'none' ? 'bg-white border-[#c22b38] font-medium' : ''">
                  <div class="flex items-center gap-2">
                    <input type="radio" value="none" v-model="selectedAddon" class="accent-[#c22b38]" />
                    <span>Sin carrito adicional</span>
                  </div>
                  <span class="text-gray-400">+ S/ 0.00</span>
                </label>
                <label class="flex items-center justify-between p-2 rounded-xl border border-gray-200/80 hover:bg-white cursor-pointer transition-colors" :class="selectedAddon === 'clasico' ? 'bg-white border-[#c22b38] font-medium' : ''">
                  <div class="flex items-center gap-2">
                    <input type="radio" value="clasico" v-model="selectedAddon" class="accent-[#c22b38]" />
                    <span>+ 1 Auto Clásico adicional</span>
                  </div>
                  <span class="font-bold text-[#c22b38]">+ S/ 15.00</span>
                </label>
                <label class="flex items-center justify-between p-2 rounded-xl border border-gray-200/80 hover:bg-white cursor-pointer transition-colors" :class="selectedAddon === 'premium' ? 'bg-white border-[#c22b38] font-medium' : ''">
                  <div class="flex items-center gap-2">
                    <input type="radio" value="premium" v-model="selectedAddon" class="accent-[#c22b38]" />
                    <span>+ 1 Auto Premium adicional</span>
                  </div>
                  <span class="font-bold text-[#c22b38]">+ S/ 25.00</span>
                </label>
              </div>
            </div>

            <!-- Included Items List (Clean, High-end Checklist) -->
            <div class="bg-[#fbf7fc] rounded-2xl p-4 border border-[#eedee9] mb-5">
              <h4 class="text-xs font-semibold uppercase tracking-wider text-[#27172b] mb-2">
                Contenido exacto del detalle:
              </h4>
              <ul class="space-y-1.5 max-h-44 overflow-y-auto pr-1 text-xs text-gray-700">
                <li
                  v-for="(item, idx) in product.items_included"
                  :key="idx"
                  class="flex items-start gap-2"
                >
                  <span
                    class="font-bold"
                    :class="product.campaign === 'hotwheels' ? 'text-[#c22b38]' : 'text-[#caa35f]'"
                  >✓</span>
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Modal Actions -->
          <div class="space-y-2 pt-1">
            <div class="flex items-center gap-3">
              <!-- Add to Cart Button -->
              <button
                @click="handleAddToCart"
                class="flex-1 py-3.5 rounded-full text-white font-semibold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xs active:scale-98"
                :class="product.campaign === 'hotwheels' ? 'bg-[#c22b38] hover:bg-[#991b1b]' : 'bg-[#27172b] hover:bg-[#caa35f] hover:text-[#27172b] border border-[#caa35f]/40'"
              >
                Añadir a la Bolsa • S/ {{ computedFinalPrice.toFixed(2) }}
              </button>

              <!-- Structured WhatsApp Consultation / Order Button -->
              <a
                :href="whatsappUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="px-5 py-3.5 rounded-full bg-[#25D366] text-white hover:bg-[#20ba5a] transition-all hover:scale-103 shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer font-semibold text-xs shrink-0"
                title="Pedir directamente con la ficha completa por WhatsApp"
              >
                <IconWhatsApp customClass="w-5 h-5 text-white" />
                <span class="hidden sm:inline">Pedir por WhatsApp</span>
              </a>
            </div>

            <!-- Discrete advisor info note -->
            <p class="text-[11px] text-gray-400 text-center">
              El mensaje de WhatsApp incluye automáticamente la lista de contenido, precio y foto para atención inmediata.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Teleported Lightbox / Fullscreen High-Resolution Zoom Modal -->
    <teleport to="body">
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isLightboxOpen"
          class="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col justify-between select-none"
          @mousemove="handleMouseMove"
          @mouseup="handleMouseUp"
          @wheel.prevent="handleWheel"
        >
          <!-- Top Lightbox Header -->
          <div class="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-gradient-to-b from-black/80 to-transparent z-10 gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#caa35f]/20 text-[#caa35f] border border-[#caa35f]/40 shrink-0">
                Alta Definición
              </span>
              <div class="min-w-0">
                <h4 class="text-white text-sm sm:text-base font-serif font-bold truncate">
                  {{ product.name }}
                </h4>
                <p class="text-[11px] sm:text-xs text-gray-400 truncate">
                  {{ activeImageView === 'card' ? 'Ficha oficial de catálogo' : 'Detalle fotográfico original (600 × 750 px)' }}
                </p>
              </div>
            </div>

            <!-- Controls (Zoom - / % / + / Reset / Close) -->
            <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                @click="zoomOut"
                :disabled="zoomLevel <= 1"
                class="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                title="Alejar (-)"
              >
                <ZoomOut class="w-5 h-5" />
              </button>

              <button
                @click="resetZoom"
                class="px-2.5 py-1 rounded-full text-xs font-semibold text-white/90 bg-white/10 hover:bg-white/20 transition cursor-pointer min-w-[54px] text-center"
                title="Restablecer tamaño (100%)"
              >
                {{ Math.round(zoomLevel * 100) }}%
              </button>

              <button
                @click="zoomIn"
                :disabled="zoomLevel >= 3"
                class="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                title="Acercar (+)"
              >
                <ZoomIn class="w-5 h-5" />
              </button>

              <div class="w-px h-5 bg-white/20 mx-1"></div>

              <button
                @click="closeLightbox"
                class="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/15 transition cursor-pointer"
                aria-label="Cerrar ampliación"
                title="Cerrar (Esc)"
              >
                <X class="w-6 h-6" />
              </button>
            </div>
          </div>

          <!-- Main Zoomable Viewport -->
          <div
            class="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center p-3 sm:p-6"
            @click.self="closeLightbox"
          >
            <img
              :src="currentDisplayImage"
              :alt="product.name"
              class="max-h-[82vh] max-w-[92vw] md:max-w-[85vw] object-contain select-none pointer-events-auto drop-shadow-2xl rounded-xl"
              :style="{
                transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomLevel})`,
                cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
                transition: isDragging ? 'none' : 'transform 0.18s cubic-bezier(0.2, 0, 0, 1)'
              }"
              @mousedown="handleMouseDown"
              @touchstart="handleTouchStart"
              @touchmove="handleTouchMove"
              @touchend="handleTouchEnd"
              @dblclick="toggleZoom"
              draggable="false"
            />
          </div>

          <!-- Bottom Bar: Instructions & Quick Switching -->
          <div class="px-4 py-3 bg-gradient-to-t from-black/80 to-transparent flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-400 z-10">
            <div class="flex items-center gap-2">
              <span class="inline-block w-1.5 h-1.5 rounded-full bg-[#caa35f]"></span>
              <span>Doble clic o rueda para zoom &bull; Arrastra para mover &bull; Esc para salir</span>
            </div>

            <!-- Optional catalog card switcher if product has one -->
            <div v-if="product.catalog_card" class="flex items-center gap-1.5">
              <button
                @click="activeImageView = 'product'; resetZoom()"
                :class="[
                  'py-1 px-2.5 rounded-lg text-[10px] font-semibold transition cursor-pointer',
                  activeImageView === 'product'
                    ? 'bg-[#caa35f] text-black font-bold'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                ]"
              >
                Foto Detalle
              </button>
              <button
                @click="activeImageView = 'card'; resetZoom()"
                :class="[
                  'py-1 px-2.5 rounded-lg text-[10px] font-semibold transition cursor-pointer',
                  activeImageView === 'card'
                    ? 'bg-[#c22b38] text-white font-bold'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                ]"
              >
                Ficha Catálogo
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, reactive, onMounted, onUnmounted } from 'vue'
import { X, Link as LinkIcon, ZoomIn, ZoomOut } from 'lucide-vue-next'
import IconWhatsApp from './icons/IconWhatsApp.vue'
import { useCartStore } from '../stores/cart'

const props = defineProps({
  product: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close'])
const cartStore = useCartStore()

const activeImageView = ref('product')
const selectedAddon = ref('none')
const copiedLink = ref(false)

// Lightbox & High-Resolution Zoom State
const isLightboxOpen = ref(false)
const zoomLevel = ref(1)
const panPosition = reactive({ x: 0, y: 0 })
const isDragging = ref(false)
const dragStart = reactive({ x: 0, y: 0 })
let touchStartDistance = 0

function openLightbox() {
  zoomLevel.value = 1
  panPosition.x = 0
  panPosition.y = 0
  isLightboxOpen.value = true
}

function closeLightbox() {
  isLightboxOpen.value = false
  zoomLevel.value = 1
  panPosition.x = 0
  panPosition.y = 0
  isDragging.value = false
}

function zoomIn() {
  zoomLevel.value = Math.min(3, +(zoomLevel.value + 0.5).toFixed(1))
}

function zoomOut() {
  zoomLevel.value = Math.max(1, +(zoomLevel.value - 0.5).toFixed(1))
  if (zoomLevel.value === 1) {
    panPosition.x = 0
    panPosition.y = 0
  }
}

function resetZoom() {
  zoomLevel.value = 1
  panPosition.x = 0
  panPosition.y = 0
}

function toggleZoom() {
  if (zoomLevel.value > 1) {
    resetZoom()
  } else {
    zoomLevel.value = 2
  }
}

function handleWheel(e) {
  if (!isLightboxOpen.value) return
  if (e.deltaY < 0) {
    zoomLevel.value = Math.min(3, +(zoomLevel.value + 0.25).toFixed(2))
  } else {
    zoomLevel.value = Math.max(1, +(zoomLevel.value - 0.25).toFixed(2))
    if (zoomLevel.value === 1) {
      panPosition.x = 0
      panPosition.y = 0
    }
  }
}

function handleMouseDown(e) {
  if (zoomLevel.value <= 1) return
  isDragging.value = true
  dragStart.x = e.clientX - panPosition.x
  dragStart.y = e.clientY - panPosition.y
}

function handleMouseMove(e) {
  if (!isDragging.value || zoomLevel.value <= 1) return
  panPosition.x = e.clientX - dragStart.x
  panPosition.y = e.clientY - dragStart.y
}

function handleMouseUp() {
  isDragging.value = false
}

function handleTouchStart(e) {
  if (e.touches.length === 1 && zoomLevel.value > 1) {
    isDragging.value = true
    dragStart.x = e.touches[0].clientX - panPosition.x
    dragStart.y = e.touches[0].clientY - panPosition.y
  } else if (e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX
    const dy = e.touches[0].clientY - e.touches[1].clientY
    touchStartDistance = Math.hypot(dx, dy)
  }
}

function handleTouchMove(e) {
  if (e.touches.length === 1 && isDragging.value && zoomLevel.value > 1) {
    panPosition.x = e.touches[0].clientX - dragStart.x
    panPosition.y = e.touches[0].clientY - dragStart.y
  } else if (e.touches.length === 2 && touchStartDistance > 0) {
    const dx = e.touches[0].clientX - e.touches[1].clientX
    const dy = e.touches[0].clientY - e.touches[1].clientY
    const dist = Math.hypot(dx, dy)
    const factor = dist / touchStartDistance
    zoomLevel.value = Math.min(3, Math.max(1, +(zoomLevel.value * factor).toFixed(2)))
    touchStartDistance = dist
  }
}

function handleTouchEnd() {
  isDragging.value = false
  touchStartDistance = 0
  if (zoomLevel.value <= 1) {
    panPosition.x = 0
    panPosition.y = 0
  }
}

const currentDisplayImage = computed(() => {
  if (activeImageView.value === 'card' && props.product?.catalog_card) {
    return props.product.catalog_card
  }
  return props.product?.image || '/products/box_basico_centered.jpg'
})

const addonPrice = computed(() => {
  if (selectedAddon.value === 'clasico') return 15.00
  if (selectedAddon.value === 'premium') return 25.00
  return 0.00
})

const computedFinalPrice = computed(() => {
  if (!props.product) return 0
  return Number(props.product.price) + addonPrice.value
})

// Generate the complete structured message so the advisor never needs to look up anything
const whatsappUrl = computed(() => {
  if (!props.product) return '#'
  
  const isHw = props.product.campaign === 'hotwheels'
  const campaignName = isHw ? 'Día de Regalar Hot Wheels' : 'Día de Regalar Maquillaje'
  const directUrl = `${window.location.origin}/?prod=${props.product.id}`

  // Build the message parts cleanly without emojis or clutter
  let lines = [
    `¡Hola Venezzia Detalles!`,
    `Deseo solicitar información / agendar el siguiente detalle:`,
    ``,
    `*Producto:* ${props.product.name}`,
    `*Colección:* ${campaignName}`,
    `*Categoría:* ${props.product.category || 'General'}`,
    `*Precio:* S/ ${Number(props.product.price).toFixed(2)}`
  ]

  // Add-on info if selected
  if (selectedAddon.value === 'clasico') {
    lines.push(`*Adicional:* 1 Auto Clásico adicional (+S/ 15.00)`)
    lines.push(`*Precio Total:* S/ ${computedFinalPrice.value.toFixed(2)}`)
  } else if (selectedAddon.value === 'premium') {
    lines.push(`*Adicional:* 1 Auto Premium adicional (+S/ 25.00)`)
    lines.push(`*Precio Total:* S/ ${computedFinalPrice.value.toFixed(2)}`)
  }

  // Exact checklist of included items
  if (props.product.items_included && props.product.items_included.length > 0) {
    lines.push(``)
    lines.push(`*Contenido del arreglo:*`)
    props.product.items_included.forEach(item => {
      lines.push(`- ${item}`)
    })
  }

  // Direct clickable link to the photo and product modal
  lines.push(``)
  lines.push(`*Ficha y fotografía:*`)
  lines.push(`${directUrl}`)
  lines.push(``)
  lines.push(`¿Tienen disponibilidad y cobertura de entrega? Muchas gracias.`)

  const fullText = lines.join('\n')
  return `https://wa.me/51932449996?text=${encodeURIComponent(fullText)}`
})

function copyDirectLink() {
  if (!props.product) return
  const directUrl = `${window.location.origin}/?prod=${props.product.id}`
  navigator.clipboard.writeText(directUrl).then(() => {
    copiedLink.value = true
    setTimeout(() => {
      copiedLink.value = false
    }, 2500)
  })
}

function handleAddToCart() {
  if (!props.product) return

  const itemToAdd = {
    ...props.product,
    price: computedFinalPrice.value,
    addon: selectedAddon.value !== 'none' ? selectedAddon.value : null
  }

  if (selectedAddon.value === 'clasico') {
    itemToAdd.name = `${props.product.name} (+ 1 Auto Clásico)`
  } else if (selectedAddon.value === 'premium') {
    itemToAdd.name = `${props.product.name} (+ 1 Auto Premium)`
  }

  cartStore.addToCart(itemToAdd, 1)
  emit('close')
  cartStore.openCart()
}

// Reset state when product changes
watch(
  () => props.product,
  () => {
    selectedAddon.value = 'none'
    activeImageView.value = 'product'
    closeLightbox()
  }
)

function handleKeydown(e) {
  if (e.key === 'Escape') {
    if (isLightboxOpen.value) {
      closeLightbox()
    } else {
      emit('close')
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden'
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})
</script>
