<template>
  <teleport to="body">
    <!-- Backdrop Dimmer Overlay -->
    <transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/65 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        @click.self="handleClose"
        aria-modal="true"
        role="dialog"
      >
        <!-- Modal Window -->
        <div
          class="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#eedee9] overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          <!-- Top Accent Gradient Line -->
          <div class="h-1.5 w-full bg-gradient-to-r from-[#27172b] via-[#965e9b] to-[#caa35f]" />

          <!-- Modal Header (Boutique Venezzia Style) -->
          <div class="p-5 sm:p-6 pb-4 border-b border-[#f4eaf6] bg-[#faf7fb] flex items-start justify-between gap-4 shrink-0">
            <div class="flex items-start gap-3">
              <div
                class="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#965e9b] to-[#7a3f80] text-white flex items-center justify-center shadow-xs shrink-0"
              >
                <CalendarHeart class="w-6 h-6 text-[#caa35f]" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-extrabold uppercase tracking-wider text-[#965e9b] bg-white px-2 py-0.5 rounded-full border border-[#eedee9]">
                    VENEZZIA RECORDATORIOS
                  </span>
                  <span
                    v-if="specialDatesStore.totalDates > 0"
                    class="text-[10px] font-bold text-[#caa35f] bg-[#fbf8f2] px-2 py-0.5 rounded-full border border-[#eedee9]"
                  >
                    {{ specialDatesStore.totalDates }} guardada(s)
                  </span>
                </div>
                <h2 class="text-xl sm:text-2xl font-serif font-bold text-[#27172b] tracking-tight mt-1">
                  Fechas Especiales
                </h2>
                <p class="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Guarda tus fechas importantes y recibe asesoría con anticipación para no olvidarte de ningún detalle especial.
                </p>
              </div>
            </div>

            <!-- Close Button -->
            <button
              @click="handleClose"
              class="w-8 h-8 rounded-full bg-white hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center border border-[#eedee9] transition-colors cursor-pointer shrink-0"
              aria-label="Cerrar modal"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <!-- Navigation Tabs: "Nueva Fecha" vs "Mis Fechas Guardadas" -->
          <div class="px-5 sm:px-6 pt-3 pb-2 bg-[#faf7fb] border-b border-[#f4eaf6] flex items-center gap-2 shrink-0">
            <button
              @click="activeTab = 'add'"
              :class="[
                'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer',
                activeTab === 'add'
                  ? 'bg-[#27172b] text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:text-[#965e9b] border border-[#eedee9]'
              ]"
            >
              <Plus class="w-3.5 h-3.5 text-[#caa35f]" />
              <span>Agregar nueva fecha</span>
            </button>

            <button
              @click="activeTab = 'list'"
              :class="[
                'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer',
                activeTab === 'list'
                  ? 'bg-[#27172b] text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:text-[#965e9b] border border-[#eedee9]'
              ]"
            >
              <Calendar class="w-3.5 h-3.5 text-[#caa35f]" />
              <span>Mis fechas guardadas</span>
              <span
                v-if="specialDatesStore.totalDates > 0"
                class="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold"
                :class="activeTab === 'list' ? 'bg-[#965e9b] text-white' : 'bg-gray-100 text-gray-700'"
              >
                {{ specialDatesStore.totalDates }}
              </span>
            </button>
          </div>

          <!-- Modal Scrollable Body -->
          <div class="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            <!-- ============================================== -->
            <!-- TAB 1: AGREGAR NUEVA FECHA (FORMULARIO ROSATEL) -->
            <!-- ============================================== -->
            <div v-if="activeTab === 'add'" class="space-y-5">
              <!-- Success Banner if just saved -->
              <div
                v-if="showSuccessAlert"
                class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between gap-3 animate-fade-in"
              >
                <div class="flex items-center gap-2">
                  <CheckCircle2 class="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span class="font-bold">¡Fecha guardada con éxito!</span>
                    <p class="text-emerald-700 text-[11px] mt-0.5">Te avisaremos con anticipación para preparar el detalle ideal.</p>
                  </div>
                </div>
                <button
                  @click="activeTab = 'list'"
                  class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] whitespace-nowrap cursor-pointer"
                >
                  Ver mis fechas →
                </button>
              </div>

              <form @submit.prevent="handleSubmitDate" class="space-y-5">
                <!-- 1. Nombre de evento / agasajado -->
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Nombre del evento o persona agasajada <span class="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    v-model="form.title"
                    required
                    placeholder="Ej: Cumpleaños de Marianela, Aniversario con Mi Amor..."
                    class="w-full px-4 py-2.5 rounded-xl border border-[#ecdbe8] focus:border-[#965e9b] focus:ring-2 focus:ring-[#965e9b]/15 text-xs text-[#27172b] outline-none transition-all placeholder-gray-400"
                  />
                </div>

                <!-- 2. Ocasión (Pills/Chips seleccionables estilo Rosatel) -->
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Ocasión <span class="text-rose-500">*</span>
                  </label>
                  <div class="flex flex-wrap gap-2">
                    <button
                      type="button"
                      v-for="occ in occasions"
                      :key="occ.id"
                      @click="form.occasion = occ.id"
                      :class="[
                        'px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border',
                        form.occasion === occ.id
                          ? 'bg-[#27172b] text-white border-[#27172b] shadow-xs scale-102 ring-2 ring-[#caa35f]/50'
                          : 'bg-white text-gray-700 border-[#eedee9] hover:bg-[#faf4f9] hover:border-[#965e9b]'
                      ]"
                    >
                      <span>{{ occ.icon }}</span>
                      <span>{{ occ.label }}</span>
                    </button>
                  </div>
                </div>

                <!-- 3. Fecha del evento -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Fecha del evento <span class="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      v-model="form.date"
                      required
                      class="w-full px-4 py-2.5 rounded-xl border border-[#ecdbe8] focus:border-[#965e9b] focus:ring-2 focus:ring-[#965e9b]/15 text-xs text-[#27172b] outline-none transition-all cursor-pointer"
                    />
                    <p v-if="previewDaysRemaining" class="text-[11px] font-semibold text-[#965e9b] mt-1.5 flex items-center gap-1">
                      <Clock class="w-3.5 h-3.5 text-[#caa35f]" />
                      <span>{{ previewDaysRemaining }}</span>
                    </p>
                  </div>

                  <!-- 4. Anticipación de notificación -->
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Anticipación del recordatorio
                    </label>
                    <select
                      v-model="form.anticipationDays"
                      :disabled="!form.hasReminder"
                      class="w-full px-4 py-2.5 rounded-xl border border-[#ecdbe8] focus:border-[#965e9b] focus:ring-2 focus:ring-[#965e9b]/15 text-xs text-[#27172b] outline-none transition-all bg-white disabled:bg-gray-100 disabled:text-gray-400 cursor-pointer"
                    >
                      <option
                        v-for="opt in anticipationOptions"
                        :key="opt.value"
                        :value="opt.value"
                      >
                        {{ opt.label }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- 5. Toggle de Recordatorio Activo -->
                <div class="p-3.5 rounded-2xl bg-[#faf5fb] border border-[#eedee9] flex items-center justify-between gap-4">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-white border border-[#eedee9] text-[#965e9b] flex items-center justify-center shadow-2xs">
                      <Bell class="w-4 h-4 text-[#965e9b]" />
                    </div>
                    <div>
                      <span class="text-xs font-bold text-[#27172b] block">Recordatorio por WhatsApp</span>
                      <span class="text-[11px] text-gray-500 block">
                        Te enviaremos un mensaje oportuno con ideas y opciones exclusivas para que sorprendas.
                      </span>
                    </div>
                  </div>

                  <!-- Toggle Switch -->
                  <label class="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      v-model="form.hasReminder"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#965e9b]"></div>
                  </label>
                </div>

                <!-- 6. Datos de Contacto (Sin contraseñas ni registros pesados) -->
                <div class="p-4 rounded-2xl bg-white border border-[#eedee9] space-y-3">
                  <div class="flex items-center gap-2">
                    <Sparkles class="w-3.5 h-3.5 text-[#caa35f]" />
                    <span class="text-xs font-bold uppercase tracking-wider text-gray-700">
                      Tus datos de contacto (Para enviarte el aviso)
                    </span>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label class="block text-[11px] font-semibold text-gray-600 mb-1">Tu Nombre</label>
                      <input
                        type="text"
                        v-model="form.customerName"
                        placeholder="Ej: Carlos Gómez"
                        class="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:border-[#965e9b] outline-none"
                      />
                    </div>

                    <div>
                      <label class="block text-[11px] font-semibold text-gray-600 mb-1">Tu WhatsApp (+51)</label>
                      <input
                        type="tel"
                        v-model="form.customerPhone"
                        placeholder="987654321"
                        maxlength="15"
                        class="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:border-[#965e9b] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-[11px] font-semibold text-gray-600 mb-1">
                      Preferencias / Flores o detalles favoritos (Opcional)
                    </label>
                    <input
                      type="text"
                      v-model="form.notes"
                      placeholder="Ej: Le encantan los tulipanes amarillos y chocolates Ferrero..."
                      class="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:border-[#965e9b] outline-none"
                    />
                  </div>
                </div>

                <!-- 7. Botones de Acción -->
                <div class="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <!-- Botón Principal: Guardar -->
                  <button
                    type="submit"
                    class="w-full sm:flex-1 py-3 px-6 rounded-2xl bg-[#27172b] hover:bg-[#3d2444] text-white text-xs font-bold tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <CheckCircle2 class="w-4 h-4 text-[#caa35f]" />
                    <span>Guardar Fecha Especial</span>
                  </button>

                  <!-- Botón Secundario: Guardar y Enviar a WhatsApp Venezzia -->
                  <button
                    type="button"
                    @click="handleSaveAndSendWhatsApp"
                    class="w-full sm:w-auto py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98 whitespace-nowrap"
                    title="Guardar y registrar con nuestra asesora por WhatsApp"
                  >
                    <IconWhatsApp customClass="w-4 h-4 text-white" />
                    <span>Registrar por WhatsApp</span>
                  </button>
                </div>
              </form>
            </div>

            <!-- ============================================== -->
            <!-- TAB 2: MIS FECHAS GUARDADAS (LISTADO ROSATEL)  -->
            <!-- ============================================== -->
            <div v-else class="space-y-4">
              <!-- Empty State -->
              <div
                v-if="specialDatesStore.totalDates === 0"
                class="py-12 px-4 text-center rounded-3xl bg-[#faf5fb] border border-dashed border-[#eedee9]"
              >
                <div class="w-14 h-14 rounded-2xl bg-white border border-[#eedee9] text-[#965e9b] flex items-center justify-center mx-auto mb-3 shadow-xs">
                  <CalendarHeart class="w-7 h-7 text-[#caa35f]" />
                </div>
                <h3 class="text-base font-serif font-bold text-[#27172b] mb-1">
                  Aún no tienes fechas especiales guardadas
                </h3>
                <p class="text-xs text-gray-500 max-w-sm mx-auto mb-4 leading-relaxed">
                  Registra los cumpleaños y aniversarios de tus seres queridos para que nunca más se te pase una ocasión especial.
                </p>
                <button
                  @click="activeTab = 'add'"
                  class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#27172b] hover:bg-[#3d2444] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  <Plus class="w-4 h-4 text-[#caa35f]" />
                  <span>Agregar mi primera fecha</span>
                </button>
              </div>

              <!-- List of Saved Cards -->
              <div v-else class="space-y-3">
                <div
                  v-for="item in sortedDates"
                  :key="item.id"
                  class="p-4 sm:p-5 rounded-2xl bg-white border border-[#eedee9] hover:border-[#965e9b]/50 shadow-xs transition-all hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <!-- Left: Icon, Title & Details -->
                  <div class="flex items-start gap-3.5 min-w-0">
                    <div
                      class="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-2xs"
                      :style="{ backgroundColor: getOccasionColor(item.occasion) + '15', color: getOccasionColor(item.occasion) }"
                    >
                      <span>{{ getOccasionIcon(item.occasion) }}</span>
                    </div>

                    <div class="min-w-0">
                      <div class="flex items-center gap-2 flex-wrap">
                        <span
                          class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                          :style="{ backgroundColor: getOccasionColor(item.occasion) + '20', color: getOccasionColor(item.occasion) }"
                        >
                          {{ getOccasionLabel(item.occasion) }}
                        </span>

                        <!-- Countdown Pill -->
                        <span
                          class="px-2 py-0.5 rounded-full text-[10px] font-extrabold"
                          :class="item.daysUntil <= 7 ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-purple-100 text-purple-800'"
                        >
                          {{ item.daysUntil === 0 ? '🎉 ¡Hoy es el gran día!' : `Faltan ${item.daysUntil} día(s)` }}
                        </span>
                      </div>

                      <h4 class="text-sm sm:text-base font-bold text-[#27172b] truncate mt-1">
                        {{ item.title }}
                      </h4>

                      <div class="flex items-center gap-3 text-xs text-gray-500 mt-1 flex-wrap">
                        <span class="flex items-center gap-1 font-semibold text-gray-700">
                          <Calendar class="w-3.5 h-3.5 text-[#caa35f]" />
                          <span>{{ item.formattedNextDate }}</span>
                        </span>

                        <span v-if="item.hasReminder" class="flex items-center gap-1 text-[11px] text-[#965e9b]">
                          <Bell class="w-3 h-3 text-[#965e9b]" />
                          <span>Aviso: {{ item.anticipationDays }} días antes</span>
                        </span>

                        <span v-if="item.customerName" class="text-[11px] text-gray-400">
                          • {{ item.customerName }}
                        </span>
                      </div>

                      <p v-if="item.notes" class="text-[11px] text-gray-500 italic mt-1 truncate">
                        "{{ item.notes }}"
                      </p>
                    </div>
                  </div>

                  <!-- Right: Actions -->
                  <div class="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 justify-end">
                    <!-- WhatsApp Direct Advice Link -->
                    <a
                      :href="specialDatesStore.generateClientWhatsAppLink(item, siteSettingsStore.phone)"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Pedir asesoría personalizada para esta fecha por WhatsApp"
                    >
                      <IconWhatsApp customClass="w-3.5 h-3.5 text-[#25D366]" />
                      <span>Pedir Asesoría</span>
                    </a>

                    <!-- Delete Button -->
                    <button
                      @click="handleRemoveDate(item.id)"
                      class="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Eliminar esta fecha"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="p-4 sm:p-5 border-t border-[#f4eaf6] bg-[#faf7fb] flex items-center justify-between gap-3 shrink-0">
            <div class="text-[11px] text-gray-500 flex items-center gap-1.5">
              <Sparkles class="w-3.5 h-3.5 text-[#caa35f]" />
              <span class="hidden sm:inline">Tus fechas se guardan de forma privada en tu dispositivo y cuentan con asesoría VIP.</span>
              <span class="sm:hidden">Asesoría VIP en cada fecha.</span>
            </div>

            <button
              @click="handleClose"
              class="px-4 py-2 rounded-xl bg-white border border-[#eedee9] hover:bg-gray-50 text-gray-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import {
  CalendarHeart,
  Calendar,
  Sparkles,
  Plus,
  Clock,
  Bell,
  CheckCircle2,
  Trash2,
  X
} from 'lucide-vue-next'
import IconWhatsApp from './icons/IconWhatsApp.vue'
import {
  useSpecialDatesStore,
  OCCASIONS_LIST,
  ANTICIPATION_OPTIONS,
  calculateDaysUntil
} from '../stores/specialDates'
import { useSiteSettingsStore } from '../stores/siteSettings'

const specialDatesStore = useSpecialDatesStore()
const siteSettingsStore = useSiteSettingsStore()

const isOpen = computed(() => specialDatesStore.isModalOpen)
const activeTab = ref(specialDatesStore.modalTab || 'add')
const showSuccessAlert = ref(false)

watch(() => specialDatesStore.modalTab, (newTab) => {
  if (newTab) activeTab.value = newTab
})

const occasions = OCCASIONS_LIST
const anticipationOptions = ANTICIPATION_OPTIONS

const form = reactive({
  title: '',
  occasion: 'cumpleanos',
  date: '',
  hasReminder: true,
  anticipationDays: 5,
  customerName: '',
  customerPhone: '',
  notes: ''
})

const previewDaysRemaining = computed(() => {
  if (!form.date) return null
  const calc = calculateDaysUntil(form.date)
  if (calc.days === 0) return '¡Ocurre hoy!'
  return `Próximo: ${calc.formattedNextDate} (Faltan ${calc.days} días)`
})

const sortedDates = computed(() => specialDatesStore.sortedUpcomingDates)

function getOccasionIcon(occId) {
  const occ = occasions.find(o => o.id === occId)
  return occ ? occ.icon : '🌸'
}

function getOccasionLabel(occId) {
  const occ = occasions.find(o => o.id === occId)
  return occ ? occ.label : occId
}

function getOccasionColor(occId) {
  const occ = occasions.find(o => o.id === occId)
  return occ ? occ.color : '#965e9b'
}

function handleClose() {
  specialDatesStore.closeModal()
  showSuccessAlert.value = false
}

function handleSubmitDate() {
  if (!form.title || !form.date) return

  specialDatesStore.addDate({
    title: form.title,
    occasion: form.occasion,
    date: form.date,
    hasReminder: form.hasReminder,
    anticipationDays: form.anticipationDays,
    customerName: form.customerName,
    customerPhone: form.customerPhone,
    notes: form.notes
  })

  // Reset form
  form.title = ''
  form.notes = ''
  // keep customer name/phone for convenience

  showSuccessAlert.value = true
  setTimeout(() => {
    activeTab.value = 'list'
    showSuccessAlert.value = false
  }, 900)
}

function handleSaveAndSendWhatsApp() {
  if (!form.title || !form.date) {
    alert('Por favor completa el nombre del evento y la fecha.')
    return
  }

  const saved = specialDatesStore.addDate({
    title: form.title,
    occasion: form.occasion,
    date: form.date,
    hasReminder: form.hasReminder,
    anticipationDays: form.anticipationDays,
    customerName: form.customerName,
    customerPhone: form.customerPhone,
    notes: form.notes
  })

  const waUrl = specialDatesStore.generateClientWhatsAppLink(saved, siteSettingsStore.phone)

  // Reset form
  form.title = ''
  form.notes = ''
  activeTab.value = 'list'

  if (typeof window !== 'undefined') {
    window.open(waUrl, '_blank')
  }
}

function handleRemoveDate(id) {
  if (confirm('¿Deseas eliminar esta fecha especial guardada?')) {
    specialDatesStore.removeDate(id)
  }
}
</script>
