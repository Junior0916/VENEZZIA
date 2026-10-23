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
          <!-- Main Selected Image Container -->
          <div class="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-[#fbf7fc] border border-[#eedee9] p-3 flex items-center justify-center shadow-xs">
            <img
              :src="currentDisplayImage"
              :alt="product.name"
              class="w-full h-full object-contain transition-all duration-300"
            />
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
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { X, Link as LinkIcon } from 'lucide-vue-next'
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
  }
)

function handleKeydown(e) {
  if (e.key === 'Escape') {
    emit('close')
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
