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
                    ref="phoneInputRef"
                    :value="customer.phone"
                    @input="handlePhoneInput"
                    @blur="handlePhoneBlur"
                    type="tel"
                    maxlength="16"
                    placeholder="984 165 198"
                    :class="[
                      'w-full text-xs px-3.5 py-2.5 rounded-xl border bg-[#fbf7fc] focus:bg-white focus:outline-none focus:ring-2 transition-all',
                      phoneError
                        ? 'border-rose-400 focus:ring-rose-200 text-rose-900 bg-rose-50/20'
                        : 'border-[#eedee9] focus:ring-[#caa35f]/20 focus:border-[#caa35f]'
                    ]"
                  />
                  <span v-if="phoneError" class="text-[10px] text-rose-600 font-medium block mt-1 leading-tight">
                    {{ phoneError }}
                  </span>
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
                <div class="flex items-center justify-between mb-1">
                  <label class="block text-[11px] font-semibold text-gray-700">Dirección de Entrega</label>
                  <button
                    type="button"
                    @click="openMapModal"
                    class="text-[11px] font-semibold text-[#b0873b] hover:text-[#994c58] flex items-center gap-1 transition-colors cursor-pointer active:scale-95"
                  >
                    <MapPin class="w-3.5 h-3.5 text-[#caa35f]" />
                    <span>{{ customer.mapUrl ? 'Cambiar punto GPS' : 'Fijar en Mapa / GPS' }}</span>
                  </button>
                </div>
                <input
                  v-model="customer.address"
                  type="text"
                  placeholder="Av. Pardo 123, Dpto 502"
                  class="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#eedee9] bg-[#fbf7fc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#caa35f]/20 focus:border-[#caa35f]"
                />

                <!-- GPS Link Badge if selected -->
                <div
                  v-if="customer.mapUrl"
                  class="mt-2 p-2 px-3 rounded-xl bg-[#f0fbf5] border border-emerald-200/80 flex items-center justify-between gap-2 text-[11px] text-emerald-800 animate-in fade-in"
                >
                  <div class="flex items-center gap-1.5 truncate">
                    <span class="text-xs leading-none">📍</span>
                    <span class="font-medium truncate">Ubicación GPS fijada para delivery</span>
                  </div>
                  <div class="flex items-center gap-2 shrink-0">
                    <a
                      :href="customer.mapUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-emerald-700 hover:text-emerald-900 underline font-semibold text-[10px] flex items-center gap-0.5"
                    >
                      <span>Ver mapa</span>
                      <ExternalLink class="w-3 h-3" />
                    </a>
                    <button
                      type="button"
                      @click="removeMapLocation"
                      class="text-gray-400 hover:text-rose-600 transition-colors cursor-pointer p-0.5"
                      title="Quitar ubicación GPS"
                    >
                      <X class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
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

            <!-- Order via WhatsApp (Direct & Structured with validation) -->
            <button
              type="button"
              @click="handleWhatsAppOrder"
              class="w-full py-3.5 px-4 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider active:scale-[0.99] transition-all shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <IconWhatsApp customClass="w-4 h-4 text-white" />
              <span>Coordinar Pedido por WhatsApp</span>
            </button>

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

    <!-- Luxury Confirmation Modal (Venezzia Brand Colors & Logo) -->
    <div
      v-if="orderCompleted"
      class="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        class="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-[#eedee9] text-center my-auto"
      >
        <!-- Header with Venezzia Brand Colors -->
        <div class="p-6 bg-gradient-to-b from-[#27172b] via-[#351a3a] to-[#27172b] text-white relative">
          <!-- Top decorative gold bar -->
          <div class="h-1 w-full bg-gradient-to-r from-transparent via-[#caa35f] to-transparent absolute top-0 left-0"></div>

          <!-- Brand Logo -->
          <div class="flex items-center justify-center gap-2 mb-3">
            <img src="/marca_lila.webp" alt="Venezzia Detalles" class="h-8 w-auto object-contain brightness-0 invert" />
            <img src="/isotipo_lila.webp" alt="Venezzia Isotipo" class="h-7 w-auto object-contain" />
          </div>

          <!-- Success Icon with Glowing Gold Ring -->
          <div class="w-16 h-16 rounded-full bg-gradient-to-tr from-[#caa35f] to-[#e6c987] text-[#27172b] flex items-center justify-center mx-auto mb-3 shadow-lg ring-4 ring-[#caa35f]/30 border-2 border-white">
            <CheckCircle2 class="w-9 h-9 stroke-[2.5]" />
          </div>

          <h3 class="text-xl sm:text-2xl font-serif font-bold text-white mb-1 tracking-tight">
            ¡Pago Confirmado!
          </h3>
          <p class="text-xs text-[#eddcd9] leading-relaxed max-w-xs mx-auto">
            Tu pedido ha sido recibido con éxito en <strong class="text-[#caa35f]">Venezzia Detalles</strong>.
          </p>
        </div>

        <!-- Body / Luxury Ticket Details -->
        <div class="p-5 sm:p-6 space-y-4 bg-[#fdfafc]">
          <!-- Amount Paid & Transaction ID Card -->
          <div class="bg-white rounded-2xl p-4 border border-[#eedee9] shadow-xs text-left space-y-3">
            <div class="flex items-center justify-between pb-3 border-b border-[#f3e7f0]">
              <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Pagado</span>
              <span class="text-xl font-bold font-serif text-[#27172b]">
                {{ completedOrderInfo?.total || cartStore.formattedTotal }}
              </span>
            </div>

            <!-- Detail Grid -->
            <div class="space-y-1.5 text-xs text-gray-600">
              <div class="flex items-start justify-between gap-2">
                <span class="text-gray-400 shrink-0">N° Transacción:</span>
                <span class="font-mono text-gray-800 font-semibold truncate text-[11px] bg-gray-50 px-2 py-0.5 rounded border border-gray-200/80">
                  {{ lastChargeId }}
                </span>
              </div>
              <div class="flex items-start justify-between gap-2">
                <span class="text-gray-400 shrink-0">Comprobante a:</span>
                <span class="text-gray-800 font-medium truncate">{{ completedOrderInfo?.customer?.email || customer.email }}</span>
              </div>
              <div class="flex items-start justify-between gap-2">
                <span class="text-gray-400 shrink-0">Destinatario:</span>
                <span class="text-gray-900 font-bold truncate">{{ completedOrderInfo?.customer?.name || customer.name }}</span>
              </div>
              <div class="flex items-start justify-between gap-2">
                <span class="text-gray-400 shrink-0">Celular:</span>
                <span class="text-gray-800 font-medium">{{ completedOrderInfo?.customer?.phone || customer.phone }}</span>
              </div>
              <div class="flex items-start justify-between gap-2">
                <span class="text-gray-400 shrink-0">Entrega:</span>
                <span class="text-gray-800 font-medium text-right">
                  {{ completedOrderInfo?.customer?.address || customer.address }} ({{ completedOrderInfo?.customer?.city || customer.city }})
                </span>
              </div>
              <div v-if="completedOrderInfo?.customer?.mapUrl || customer.mapUrl" class="flex items-center justify-between pt-1">
                <span class="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                  <span>📍</span> Ubicación GPS:
                </span>
                <a
                  :href="completedOrderInfo?.customer?.mapUrl || customer.mapUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-[#caa35f] hover:text-[#994c58] font-bold text-[11px] underline flex items-center gap-0.5"
                >
                  <span>Ver en Google Maps</span>
                  <ExternalLink class="w-3 h-3" />
                </a>
              </div>
            </div>

            <!-- Dedicatoria if present -->
            <div
              v-if="completedOrderInfo?.customer?.notes || customer.notes"
              class="p-2.5 rounded-xl bg-[#faf5fb] border border-[#eedee9]/80 text-[11px] text-gray-700 italic space-y-0.5"
            >
              <div class="font-semibold text-gray-500 not-italic text-[10px] uppercase">Dedicatoria para tarjeta de regalo:</div>
              <div>"{{ completedOrderInfo?.customer?.notes || customer.notes }}"</div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-2 pt-1">
            <!-- Button WhatsApp Coordination -->
            <a
              :href="whatsappConfirmationUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="w-full py-3.5 px-4 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider active:scale-[0.99] transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <IconWhatsApp customClass="w-4 h-4 text-white" />
              <span>Coordinar Despacho por WhatsApp</span>
            </a>

            <!-- Button Close and keep shopping -->
            <button
              type="button"
              @click="closeSuccessModal"
              class="w-full py-3 px-4 rounded-full bg-gradient-to-r from-[#27172b] to-[#401f46] hover:from-[#caa35f] hover:to-[#b0873b] hover:text-[#27172b] text-white font-bold text-xs uppercase tracking-wider active:scale-[0.99] transition-all shadow-md shadow-purple-950/20 border border-[#caa35f]/50 cursor-pointer"
            >
              Aceptar y Seguir Comprando
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Rejection / Declined Payment Modal -->
    <div
      v-if="showRejectModal"
      class="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        class="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-rose-200 text-center my-auto"
      >
        <!-- Header -->
        <div class="p-6 bg-gradient-to-b from-[#2a1318] via-[#3d1a22] to-[#2a1318] text-white relative">
          <!-- Top decorative alert bar -->
          <div class="h-1 w-full bg-gradient-to-r from-transparent via-rose-500 to-transparent absolute top-0 left-0"></div>

          <!-- Brand Logo -->
          <div class="flex items-center justify-center gap-2 mb-3">
            <img src="/marca_lila.webp" alt="Venezzia Detalles" class="h-7 w-auto object-contain brightness-0 invert opacity-80" />
            <img src="/isotipo_lila.webp" alt="Venezzia Isotipo" class="h-6 w-auto object-contain opacity-80" />
          </div>

          <!-- Alert / X Icon with Rose Ring -->
          <div class="w-14 h-14 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3 shadow-lg ring-4 ring-rose-500/30 border-2 border-rose-400">
            <AlertCircle class="w-8 h-8" />
          </div>

          <h3 class="text-xl font-serif font-bold text-white mb-1 tracking-tight">
            Pago No Procesado
          </h3>
          <p class="text-xs text-rose-200 leading-relaxed">
            La pasarela de pago o el banco emisor no pudo autorizar el cargo.
          </p>
        </div>

        <!-- Body / Reason & Alternatives -->
        <div class="p-5 space-y-3.5 bg-[#fdfafc] text-left text-xs">
          <!-- Reason Box -->
          <div class="p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 space-y-1">
            <div class="font-semibold text-rose-900 flex items-center gap-1.5 text-[11px] uppercase tracking-wide">
              <span>⚠️</span> Detalle del Rechazo:
            </div>
            <p class="text-rose-700 leading-relaxed text-xs font-medium">
              {{ rejectReason || 'La transacción ha sido rechazada por el banco emisor o los datos de la tarjeta no son válidos.' }}
            </p>
          </div>

          <!-- Suggestions -->
          <div class="p-3 rounded-2xl bg-white border border-[#eedee9] space-y-1.5 text-gray-600 text-[11px]">
            <div class="font-semibold text-gray-700">Recomendaciones:</div>
            <ul class="list-disc list-inside space-y-1 text-gray-500">
              <li>Verifica que el número, fecha y CVV estén correctos.</li>
              <li>Asegúrate de tener compras por internet activadas en tu app bancaria.</li>
              <li>O coordina y paga directamente por <strong>Yape, Plin o Transferencia</strong> sin comisiones.</li>
            </ul>
          </div>

          <!-- Actions -->
          <div class="space-y-2 pt-1">
            <!-- Button Try another card -->
            <button
              type="button"
              @click="closeRejectModal"
              class="w-full py-3 px-4 rounded-full bg-gradient-to-r from-[#27172b] to-[#401f46] hover:from-[#caa35f] hover:to-[#b0873b] hover:text-[#27172b] text-white font-bold text-xs uppercase tracking-wider active:scale-[0.99] transition-all shadow-md shadow-purple-950/20 border border-[#caa35f]/50 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw class="w-3.5 h-3.5" />
              <span>Intentar con otra Tarjeta</span>
            </button>

            <!-- Button WhatsApp Alternative -->
            <button
              type="button"
              @click="closeRejectModalAndOpenWhatsApp"
              class="w-full py-3 px-4 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider active:scale-[0.99] transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <IconWhatsApp customClass="w-4 h-4 text-white" />
              <span>Pagar por Yape / Plin / WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Location / GPS Map Picker Modal -->
    <LocationPickerModal
      :is-open="isMapModalOpen"
      :initial-coords="customer.mapCoords"
      @close="isMapModalOpen = false"
      @select="handleLocationSelected"
    />
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
  AlertCircle,
  RefreshCw,
  Loader2,
  MapPin,
  ExternalLink
} from 'lucide-vue-next'
import IconWhatsApp from './icons/IconWhatsApp.vue'
import LocationPickerModal from './LocationPickerModal.vue'
import { useCartStore } from '../stores/cart'
import { openCulqiCheckout, sendChargeToBackend } from '../services/culqi'

const cartStore = useCartStore()

const customer = reactive({
  name: '',
  email: '',
  phone: '',
  city: '',
  address: '',
  mapUrl: '',
  mapCoords: null,
  notes: ''
})

const processing = ref(false)
const errorMessage = ref('')
const phoneError = ref('')
const phoneInputRef = ref(null)
const isMapModalOpen = ref(false)
const orderCompleted = ref(false)
const lastChargeId = ref('')
const completedOrderInfo = ref(null)
const showRejectModal = ref(false)
const rejectReason = ref('')

function openMapModal() {
  isMapModalOpen.value = true
}

function handleLocationSelected({ lat, lng, mapUrl, addressText }) {
  customer.mapUrl = mapUrl
  customer.mapCoords = { lat, lng }
  if (!customer.address.trim() && addressText) {
    customer.address = addressText
  }
}

function removeMapLocation() {
  customer.mapUrl = ''
  customer.mapCoords = null
}

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

  if (customer.name.trim() || customer.phone.trim() || customer.city.trim() || customer.address.trim() || customer.mapUrl) {
    lines.push(``)
    lines.push(`*Datos para la entrega:*`)
    if (customer.name.trim()) lines.push(`- Cliente: ${customer.name.trim()}`)
    if (customer.phone.trim()) lines.push(`- Teléfono: ${customer.phone.trim()}`)
    if (customer.city.trim()) lines.push(`- Distrito / Ciudad: ${customer.city.trim()}`)
    if (customer.address.trim()) lines.push(`- Dirección: ${customer.address.trim()}`)
    if (customer.mapUrl) lines.push(`- 📍 Ubicación GPS (Google Maps): ${customer.mapUrl}`)
  }

  if (customer.notes.trim()) {
    lines.push(``)
    lines.push(`*Dedicatoria tarjeta:* "${customer.notes.trim()}"`)
  }

  lines.push(``)
  lines.push(`¿Cómo coordinamos el anticipo y horario de despacho? Muchas gracias.`)

  return `https://wa.me/51932449996?text=${encodeURIComponent(lines.join('\n'))}`
})

const whatsappConfirmationUrl = computed(() => {
  const info = completedOrderInfo.value
  const c = info?.customer || customer
  const total = info?.total || cartStore.formattedTotal
  const tx = info?.chargeId || lastChargeId.value

  const lines = [
    `¡Hola Venezzia Detalles! 🌸`,
    `Acabo de realizar mi pago en línea por la página web:`,
    ``,
    `*N° de Transacción:* ${tx}`,
    `*Monto Pagado:* ${total}`,
    `*Cliente:* ${c.name || ''}`,
    `*Teléfono:* ${c.phone || ''}`,
    `*Destino:* ${c.address || ''} (${c.city || ''})`,
  ]
  if (c.mapUrl) {
    lines.push(`*Ubicación GPS:* ${c.mapUrl}`)
  }
  if (c.notes) {
    lines.push(`*Dedicatoria:* "${c.notes}"`)
  }
  lines.push(``)
  lines.push(`Adjunto mi confirmación para coordinar el horario de despacho. ¡Muchas gracias!`)
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

  // Despejar error si ya tiene la longitud requerida
  if (digitsOnly.startsWith('9')) {
    if (digitsOnly.length === 9) {
      phoneError.value = ''
      if (errorMessage.value.includes('dígitos') || errorMessage.value.includes('celular') || errorMessage.value.includes('teléfono')) {
        errorMessage.value = ''
      }
    }
  } else if (!digitsOnly.startsWith('9') && digitsOnly.length >= 6) {
    phoneError.value = ''
    if (errorMessage.value.includes('dígitos') || errorMessage.value.includes('celular') || errorMessage.value.includes('teléfono')) {
      errorMessage.value = ''
    }
  }
}

function validatePhone() {
  const cleanPhone = (customer.phone || '').replace(/\D/g, '')
  if (!cleanPhone) {
    phoneError.value = 'Por favor ingresa tu número de celular o WhatsApp.'
    return false
  }

  // Validación estricta: si empieza con 9, DEBE tener exactamente 9 dígitos
  if (cleanPhone.startsWith('9')) {
    if (cleanPhone.length !== 9) {
      phoneError.value = `El celular debe tener estrictamente 9 dígitos (ingresaste ${cleanPhone.length}).`
      return false
    }
  } else {
    // Si empieza por otro número (ej. extranjero), se comprueba longitud mínima
    if (cleanPhone.length < 6) {
      phoneError.value = 'Por favor ingresa un número de teléfono válido.'
      return false
    }
  }

  phoneError.value = ''
  return true
}

function handlePhoneBlur() {
  if (customer.phone && customer.phone.trim()) {
    validatePhone()
  } else {
    phoneError.value = ''
  }
}

function validateForm({ requireEmail = true } = {}) {
  errorMessage.value = ''

  if (!customer.name.trim()) {
    errorMessage.value = 'Por favor ingresa tu nombre completo.'
    return false
  }
  
  if (requireEmail) {
    if (!customer.email.trim() || !customer.email.includes('@')) {
      errorMessage.value = 'Por favor ingresa un correo electrónico válido para tu comprobante de pago.'
      return false
    }
  }

  if (!validatePhone()) {
    errorMessage.value = phoneError.value
    phoneInputRef.value?.focus()
    return false
  }

  if (!customer.city.trim()) {
    errorMessage.value = 'Por favor indica tu distrito o ciudad de entrega.'
    return false
  }

  errorMessage.value = ''
  return true
}

function handleWhatsAppOrder() {
  if (!validateForm({ requireEmail: false })) {
    return
  }

  // Abrir WhatsApp con el pedido y los datos validados
  window.open(whatsappCartUrl.value, '_blank')
}

async function handleCheckout() {
  if (!validateForm({ requireEmail: true })) return

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
              customer_address: `${customer.address || ''} (${customer.city})${customer.mapUrl ? ' | 📍 GPS: ' + customer.mapUrl : ''}`,
              customer_notes: customer.notes,
              location_url: customer.mapUrl || '',
              currency: 'PEN',
              items: cartStore.items.map(item => ({
                id: item.product.id,
                name: item.product.name,
                price: item.product.price,
                quantity: item.quantity
              }))
            }
          })

          completedOrderInfo.value = {
            chargeId: chargeResult.chargeId || token.id,
            total: cartStore.formattedTotal,
            totalAmount: cartStore.totalAmount,
            customer: { ...customer }
          }
          lastChargeId.value = chargeResult.chargeId || token.id
          orderCompleted.value = true
          cartStore.clearCart()
        } catch (err) {
          const msg = err.message || 'Error al procesar el cobro con Culqi.'
          errorMessage.value = msg
          rejectReason.value = msg
          showRejectModal.value = true
        } finally {
          processing.value = false
        }
      },
      onError: (err) => {
        processing.value = false
        const msg = err?.user_message || err?.message || 'Error en la pasarela Culqi.'
        errorMessage.value = msg
        rejectReason.value = msg
        showRejectModal.value = true
      }
    })
  } catch (err) {
    processing.value = false
    const msg = err.message || 'No se pudo iniciar el proceso de pago.'
    errorMessage.value = msg
    rejectReason.value = msg
    showRejectModal.value = true
  }
}

function closeSuccessModal() {
  orderCompleted.value = false
  completedOrderInfo.value = null
  cartStore.closeCart()
}

function closeRejectModal() {
  showRejectModal.value = false
}

function closeRejectModalAndOpenWhatsApp() {
  showRejectModal.value = false
  window.open(whatsappCartUrl.value, '_blank')
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
