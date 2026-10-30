<template>
  <div class="relative z-50">
    <!-- Backdrop -->
    <transition
      enter-active-class="transition-opacity ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="cartStore.isOpen"
        @click="cartStore.closeCart"
        class="fixed inset-0 bg-[#1c1214]/50 backdrop-blur-xs"
      ></div>
    </transition>

    <!-- Slide-over Panel -->
    <transition
      enter-active-class="transform transition ease-out duration-300"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transform transition ease-in duration-200"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div
        v-if="cartStore.isOpen"
        class="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10"
      >
        <div class="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          <!-- Header -->
          <div class="p-5 sm:p-6 border-b border-[#eedee9] flex items-center justify-between bg-[#faf5fb]">
            <div class="flex items-center gap-2.5">
              <ShoppingBag class="w-5 h-5 text-[#caa35f]" />
              <h2 class="text-base sm:text-lg font-serif font-bold text-[#27172b]">Bolsa de Compras</h2>
              <span class="text-xs px-2.5 py-0.5 bg-gradient-to-r from-[#caa35f] to-[#b0873b] text-white rounded-full font-bold shadow-2xs">
                {{ cartStore.totalCount }}
              </span>
            </div>
            <button
              @click="cartStore.closeCart"
              class="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-white transition-colors cursor-pointer"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            <!-- Items list -->
            <div v-if="cartStore.items.length > 0" class="divide-y divide-[#f2e6f0]">
              <div
                v-for="item in cartStore.items"
                :key="item.id || item.product.id"
                class="py-4 first:pt-0 last:pb-0 flex gap-4"
              >
                <!-- Thumbnail -->
                <img
                  :src="item.product.image"
                  :alt="item.product.name"
                  class="w-16 h-16 rounded-2xl object-cover border border-[#eedee9] bg-[#fbf7fc] shrink-0"
                />

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <h4 class="text-xs sm:text-sm font-semibold text-[#27172b] line-clamp-2 leading-snug">
                    {{ item.product.name }}
                  </h4>
                  <p class="text-xs text-[#965e9b] font-bold mt-1 whitespace-nowrap">
                    S/&nbsp;{{ Number(item.product.price).toFixed(2) }}
                  </p>

                  <!-- Stepper & Delete -->
                  <div class="flex items-center justify-between mt-3">
                    <div class="inline-flex items-center bg-[#fbf7fc] border border-[#eedee9] rounded-full px-2.5 py-1 gap-2">
                      <button
                        @click="cartStore.updateQuantity(item.id || item.product.id, item.quantity - 1)"
                        class="w-4 h-4 flex items-center justify-center text-gray-600 hover:text-[#caa35f] font-bold text-xs cursor-pointer"
                      >
                        -
                      </button>
                      <span class="text-xs font-bold text-gray-800 min-w-[12px] text-center">
                        {{ item.quantity }}
                      </span>
                      <button
                        @click="cartStore.updateQuantity(item.id || item.product.id, item.quantity + 1)"
                        class="w-4 h-4 flex items-center justify-center text-gray-600 hover:text-[#caa35f] font-bold text-xs cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <button
                      @click="cartStore.removeFromCart(item.id || item.product.id)"
                      class="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Trash2 class="w-3.5 h-3.5" />
                      <span>Quitar</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty Cart -->
            <div v-else class="text-center py-12">
              <ShoppingBag class="w-12 h-12 text-[#d8c3d6] mx-auto mb-3" />
              <p class="text-sm font-serif font-bold text-[#27172b]">Tu bolsa está vacía</p>
              <p class="text-xs text-gray-400 mt-1">Elige un arreglo floral de autor en Venezzia Detalles para continuar.</p>
            </div>

            <!-- Customer Shipping Info Form -->
            <div v-if="cartStore.items.length > 0" class="pt-4 border-t border-[#f2e6f0] space-y-3">
              <h3 class="text-xs font-serif font-bold uppercase tracking-wider text-[#27172b]">
                Datos de Envío y Contacto
              </h3>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1">Nombre Completo *</label>
                <input
                  v-model="customer.name"
                  type="text"
                  placeholder="Ej. María Sánchez"
                  class="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#eedee9] bg-[#fbf7fc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#caa35f]/20 focus:border-[#caa35f]"
                />
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1">Correo Electrónico (para tu boleta y Culqi) *</label>
                <input
                  v-model="customer.email"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  class="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#eedee9] bg-[#fbf7fc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#caa35f]/20 focus:border-[#caa35f]"
                />
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Teléfono / Celular *</label>
                  <input
                    :value="customer.phone"
                    @input="handlePhoneInput"
                    type="tel"
                    maxlength="16"
                    placeholder="984 165 198"
                    class="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#eedee9] bg-[#fbf7fc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#caa35f]/20 focus:border-[#caa35f]"
                  />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Distrito / Ciudad *</label>
                  <input
                    v-model="customer.city"
                    type="text"
                    placeholder="Miraflores, Lima..."
                    class="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#eedee9] bg-[#fbf7fc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#caa35f]/20 focus:border-[#caa35f]"
                  />
                </div>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1">Dirección de Entrega</label>
                <input
                  v-model="customer.address"
                  type="text"
                  placeholder="Av. Pardo 123, Dpto 502"
                  class="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#eedee9] bg-[#fbf7fc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#caa35f]/20 focus:border-[#caa35f]"
                />
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1">Dedicatoria para la Tarjeta de Regalo (Opcional)</label>
                <textarea
                  v-model="customer.notes"
                  rows="2"
                  placeholder="Escribe el mensaje especial para el destinatario..."
                  class="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#eedee9] bg-[#fbf7fc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#caa35f]/20 focus:border-[#caa35f]"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Footer Summary & Checkout Button -->
          <div v-if="cartStore.items.length > 0" class="p-5 sm:p-6 border-t border-[#eedee9] bg-[#faf5fb] space-y-4">
            <div class="space-y-1.5 text-xs text-gray-600">
              <div class="flex justify-between">
                <span>Subtotal</span>
                <span>{{ cartStore.formattedTotal }}</span>
              </div>
              <div class="flex justify-between text-emerald-700 font-semibold">
                <span>Envío</span>
                <span>Coordinación directa</span>
              </div>
              <div class="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-[#eedee9]">
                <span>Total a Pagar</span>
                <span class="text-[#27172b] font-bold text-lg">{{ cartStore.formattedTotal }}</span>
              </div>
            </div>

            <!-- Error message if any -->
            <div v-if="errorMessage" class="text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200 leading-relaxed space-y-1">
              <div class="flex items-start gap-2">
                <span class="text-rose-500 font-bold shrink-0">⚠️</span>
                <span>{{ errorMessage }}</span>
              </div>
            </div>

            <!-- Order via WhatsApp (Direct & Structured) -->
            <a
              :href="whatsappCartUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="w-full py-3.5 px-4 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider active:scale-[0.99] transition-all shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <IconWhatsApp customClass="w-4 h-4 text-white" />
              <span>Coordinar Pedido por WhatsApp</span>
            </a>

            <!-- Or Pay with Card/Culqi -->
            <button
              @click="handleCheckout"
              :disabled="processing"
              class="w-full py-3.5 px-4 rounded-full bg-gradient-to-r from-[#27172b] to-[#401f46] hover:from-[#caa35f] hover:to-[#b0873b] hover:text-[#27172b] text-white font-bold text-xs uppercase tracking-wider active:scale-[0.99] transition-all shadow-md shadow-purple-950/20 border border-[#caa35f]/50 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Loader2 v-if="processing" class="w-4 h-4 animate-spin" />
              <Lock v-else class="w-4 h-4 text-[#caa35f]" />
              <span>{{ processing ? 'Procesando pago...' : `Pagar con Tarjeta / Culqi` }}</span>
            </button>

            <!-- Authentic Payment Brands in Drawer (Real Official Logos) -->
            <div class="pt-1 flex flex-col items-center gap-2">
              <div class="flex items-center justify-center gap-1.5 flex-wrap">
                <div class="h-6 px-1.5 bg-white rounded border border-[#eddcd9] flex items-center justify-center shadow-2xs">
                  <img src="/payments/visa.png" alt="Visa" class="h-3.5 w-auto object-contain" />
                </div>
                <div class="h-6 px-1.5 bg-white rounded border border-[#eddcd9] flex items-center justify-center shadow-2xs">
                  <img src="/payments/mastercard.png" alt="Mastercard" class="h-3.5 w-auto object-contain" />
                </div>
                <div class="h-6 px-1.5 bg-white rounded border border-[#eddcd9] flex items-center justify-center shadow-2xs">
                  <img src="/payments/yape.png" alt="Yape" class="h-4.5 w-auto object-contain" />
                </div>
                <div class="h-6 px-1.5 bg-white rounded border border-[#eddcd9] flex items-center justify-center shadow-2xs">
                  <img src="/payments/plin.png" alt="Plin" class="h-4.5 w-auto object-contain" />
                </div>
                <div class="h-6 px-1.5 bg-white rounded border border-[#eddcd9] flex items-center justify-center shadow-2xs">
                  <img src="/payments/bcp.png" alt="BCP" class="h-3 w-auto object-contain" />
                </div>
                <div class="h-6 px-1.5 bg-white rounded border border-[#eddcd9] flex items-center justify-center shadow-2xs">
                  <img src="/payments/bbva.png" alt="BBVA" class="h-2.5 w-auto object-contain" />
                </div>
                <div class="h-6 px-1.5 bg-white rounded border border-[#eddcd9] flex items-center justify-center shadow-2xs">
                  <img src="/payments/culqi.svg" alt="Culqi" class="h-3 w-auto object-contain" />
                </div>
              </div>
              <div class="flex items-center justify-center gap-1.5 text-[10px] text-gray-500">
                <ShieldCheck class="w-3.5 h-3.5 text-emerald-600" />
                <span>Pago 100% seguro con Tarjetas, Yape o Plin vía Culqi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Success Modal -->
    <div
      v-if="orderCompleted"
      class="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-[#eedcd8]">
        <div class="w-14 h-14 bg-[#f8e5e8] text-[#994c58] rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 class="w-8 h-8" />
        </div>
        <h3 class="text-xl font-serif font-bold text-gray-900 mb-2">¡Pago Confirmado!</h3>
        <p class="text-xs text-gray-600 mb-4 leading-relaxed">
          Tu pedido ha sido recibido en <strong>Venezzia Detalles</strong>. Hemos enviado el comprobante a
          <strong class="text-gray-800">{{ customer.email }}</strong>.
        </p>
        <div class="bg-[#faf5f6] rounded-2xl p-3 text-xs text-gray-600 mb-6 text-left space-y-1 border border-[#eedcd8]/50">
          <div><strong class="text-gray-800">Transacción:</strong> {{ lastChargeId }}</div>
          <div><strong class="text-gray-800">Destinatario:</strong> {{ customer.name }}</div>
          <div><strong class="text-gray-800">Distrito:</strong> {{ customer.city }}</div>
        </div>
        <button
          @click="closeSuccessModal"
          class="w-full py-3 rounded-full bg-gradient-to-r from-[#b76e79] to-[#994c58] text-white font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-all cursor-pointer"
        >
          Aceptar y Seguir Comprando
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import {
  ShoppingBag,
  X,
  Trash2,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Loader2
} from 'lucide-vue-next'
import IconWhatsApp from './icons/IconWhatsApp.vue'
import { useCartStore } from '../stores/cart'
import { openCulqiCheckout, sendChargeToBackend } from '../services/culqi'

const cartStore = useCartStore()

const customer = reactive({
  name: '',
  email: '',
  phone: '',
  city: '',
  address: '',
  notes: ''
})

const processing = ref(false)
const errorMessage = ref('')
const orderCompleted = ref(false)
const lastChargeId = ref('')

const whatsappCartUrl = computed(() => {
  if (cartStore.items.length === 0) return '#'

  let lines = [
    `¡Hola Venezzia Detalles!`,
    `Deseo coordinar el pedido de mi bolsa de compras:`,
    ``,
    `*Detalles seleccionados:*`
  ]

  cartStore.items.forEach(item => {
    const p = item.product
    lines.push(`- ${item.quantity}x ${p.name} — S/ ${(p.price * item.quantity).toFixed(2)}`)
    lines.push(`  ↳ Ficha: ${window.location.origin}/?prod=${p.id}`)
  })

  lines.push(``)
  lines.push(`*Total a pagar:* ${cartStore.formattedTotal}`)

  if (customer.name.trim() || customer.phone.trim() || customer.city.trim()) {
    lines.push(``)
    lines.push(`*Datos para la entrega:*`)
    if (customer.name.trim()) lines.push(`- Cliente: ${customer.name.trim()}`)
    if (customer.phone.trim()) lines.push(`- Teléfono: ${customer.phone.trim()}`)
    if (customer.city.trim()) lines.push(`- Distrito / Ciudad: ${customer.city.trim()}`)
    if (customer.address.trim()) lines.push(`- Dirección: ${customer.address.trim()}`)
  }

  if (customer.notes.trim()) {
    lines.push(``)
    lines.push(`*Dedicatoria tarjeta:* "${customer.notes.trim()}"`)
  }

  lines.push(``)
  lines.push(`¿Cómo coordinamos el anticipo y horario de despacho? Muchas gracias.`)

  return `https://wa.me/51932449996?text=${encodeURIComponent(lines.join('\n'))}`
})

function handlePhoneInput(e) {
  let raw = e.target.value || ''
  let hasLeadingPlus = raw.trim().startsWith('+')
  let digitsOnly = raw.replace(/\D/g, '')

  // Si empieza con 9 (número celular estándar de Perú)
  if (digitsOnly.startsWith('9')) {
    if (digitsOnly.length > 9) {
      digitsOnly = digitsOnly.slice(0, 9)
    }
  } else {
    // Si empieza por otro número (extranjero u otro formato), hasta 15 dígitos internacionales
    if (digitsOnly.length > 15) {
      digitsOnly = digitsOnly.slice(0, 15)
    }
  }

  let formatted = (hasLeadingPlus ? '+' : '') + digitsOnly
  customer.phone = formatted
  if (e.target.value !== formatted) {
    e.target.value = formatted
  }
}

function validateForm() {
  if (!customer.name.trim()) {
    errorMessage.value = 'Por favor ingresa tu nombre completo.'
    return false
  }
  if (!customer.email.trim() || !customer.email.includes('@')) {
    errorMessage.value = 'Por favor ingresa un correo electrónico válido para tu comprobante.'
    return false
  }
  
  const cleanPhone = (customer.phone || '').replace(/\D/g, '')
  if (!cleanPhone) {
    errorMessage.value = 'Por favor ingresa tu número de teléfono o WhatsApp.'
    return false
  }

  // Validación interna: si empieza con 9, debe tener obligatoriamente 9 dígitos
  if (cleanPhone.startsWith('9')) {
    if (cleanPhone.length !== 9) {
      errorMessage.value = `El número de celular debe tener exactamente 9 dígitos (ingresaste ${cleanPhone.length}).`
      return false
    }
  } else {
    // Si empieza por otro número (ej. extranjero), solo se comprueba una longitud mínima válida
    if (cleanPhone.length < 6) {
      errorMessage.value = 'Por favor ingresa un número de teléfono válido.'
      return false
    }
  }

  if (!customer.city.trim()) {
    errorMessage.value = 'Por favor indica tu distrito o ciudad de entrega.'
    return false
  }
  errorMessage.value = ''
  return true
}

async function handleCheckout() {
  if (!validateForm()) return

  processing.value = true
  errorMessage.value = ''

  try {
    const amountInCents = Math.round(cartStore.totalAmount * 100)

    await openCulqiCheckout({
      title: 'Venezzia Detalles',
      currency: 'PEN',
      amount: amountInCents,
      description: `Pedido de ${cartStore.totalCount} detalles florales`,
      onToken: async (token) => {
        try {
          const chargeResult = await sendChargeToBackend({
            token: token,
            email: customer.email,
            amount: amountInCents,
            orderInfo: {
              customer_name: customer.name,
              customer_phone: customer.phone,
              customer_address: `${customer.address} (${customer.city})`,
              customer_notes: customer.notes,
              currency: 'PEN',
              items: cartStore.items.map(item => ({
                id: item.product.id,
                name: item.product.name,
                price: item.product.price,
                quantity: item.quantity
              }))
            }
          })

          lastChargeId.value = chargeResult.chargeId || token.id
          orderCompleted.value = true
          cartStore.clearCart()
        } catch (err) {
          errorMessage.value = err.message || 'Error al procesar el cobro con Culqi.'
        } finally {
          processing.value = false
        }
      },
      onError: (err) => {
        processing.value = false
        errorMessage.value = err?.user_message || err?.message || 'Error en la pasarela Culqi.'
      }
    })
  } catch (err) {
    processing.value = false
    errorMessage.value = err.message || 'No se pudo iniciar el proceso de pago.'
  }
}

function closeSuccessModal() {
  orderCompleted.value = false
  cartStore.closeCart()
}

// Lock body scrolling when cart is open
watch(
  () => cartStore.isOpen,
  (val) => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = val ? 'hidden' : ''
    }
  }
)

function handleGlobalKeydown(e) {
  if (e.key === 'Escape' && cartStore.isOpen) {
    cartStore.closeCart()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})
</script>
