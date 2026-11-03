<template>
  <div class="py-10 sm:py-16 bg-[#faf7fb] min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <router-link to="/" class="hover:text-[#965e9b] transition-colors flex items-center gap-1">
          <Home class="w-3.5 h-3.5" />
          <span>Inicio</span>
        </router-link>
        <span>/</span>
        <span class="text-[#27172b] font-semibold">Duplicador de Productos PocketBase</span>
      </nav>

      <!-- Header Card -->
      <div class="bg-white rounded-3xl p-6 sm:p-10 border border-[#eedee9] shadow-[0_2px_16px_-4px_rgba(154,104,155,0.06)] mb-8">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#f4eaf6]">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f6eef8] border border-[#e8d5ec] text-xs font-semibold text-[#753d77] mb-2">
              <Sparkles class="w-3.5 h-3.5 text-[#caa35f]" />
              <span>Gestión de Catálogo & Product Cloner</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-serif font-bold text-[#27172b] tracking-tight">
              Duplicador Rápido de Productos
            </h1>
            <p class="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl leading-relaxed">
              Clona cualquier producto existente con su foto, descripción, campaña, categoría y elementos incluidos con un solo clic para no tener que crear productos similares desde cero.
            </p>
          </div>

          <!-- Environment Selector & Status -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div class="p-3 bg-[#faf5fb] rounded-2xl border border-[#eedee9] text-left shrink-0">
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Destino</span>
              <select
                v-model="targetServer"
                @change="onServerChange"
                class="text-xs font-semibold text-[#27172b] bg-transparent outline-none cursor-pointer mt-0.5"
              >
                <option value="remote">Servidor VPS (admin.venezzia.shop)</option>
                <option value="local">Local (127.0.0.1:8090)</option>
              </select>
            </div>

            <a
              :href="adminUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-[#27172b] text-white text-xs font-semibold hover:bg-[#3d2444] transition-all shadow-sm shrink-0"
            >
              <span>Abrir PocketBase Admin</span>
              <ArrowUpRight class="w-4 h-4 text-[#caa35f]" />
            </a>
          </div>
        </div>

        <!-- Bookmarklet Banner (Directly inside PocketBase Admin) -->
        <div class="mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#fbf7fc] via-[#fff] to-[#fcf9f5] border border-[#caa35f]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div class="flex items-start gap-3">
            <div class="w-9 h-9 rounded-xl bg-[#caa35f]/15 flex items-center justify-center shrink-0 text-[#caa35f]">
              <Copy class="w-5 h-5" />
            </div>
            <div>
              <h4 class="text-xs sm:text-sm font-bold text-[#27172b] flex items-center gap-2">
                <span>¿Prefieres duplicar con 1 clic directamente dentro de PocketBase?</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#caa35f]/20 text-[#8a6829] uppercase">Tip</span>
              </h4>
              <p class="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                Arrastra este botón a tu <strong>barra de marcadores de tu navegador</strong>. Cuando estés editando cualquier producto en PocketBase Admin, haz clic en el marcador y se duplicará al instante.
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 w-full md:w-auto shrink-0">
            <a
              :href="bookmarkletHref"
              onclick="alert('¡Excelente! Para instalarlo, arrastra este botón a la barra de marcadores de tu navegador (Chrome/Edge/Firefox). Luego, cuando estés en PocketBase viendo un producto, solo dale clic para duplicarlo.'); return false;"
              title="Arrastra este botón a tu barra de marcadores"
              class="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#caa35f] text-[#27172b] text-xs font-bold shadow-sm hover:bg-[#b8914c] transition-all cursor-grab active:cursor-grabbing border border-[#caa35f]"
            >
              <Sparkles class="w-4 h-4" />
              <span>⚡ Duplicar en PocketBase</span>
            </a>
            <button
              @click="copyBookmarkletCode"
              class="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
              :title="copiedBookmarklet ? '¡Código copiado!' : 'Copiar código del marcador'"
            >
              <Check v-if="copiedBookmarklet" class="w-4 h-4 text-green-600" />
              <Copy v-else class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Auth Prompt if not logged in as superuser -->
      <div v-if="!isAuthenticated" class="bg-white rounded-3xl p-8 border border-[#eedee9] max-w-md mx-auto text-center shadow-md mb-8">
        <div class="w-12 h-12 rounded-2xl bg-[#f6eef8] text-[#965e9b] flex items-center justify-center mx-auto mb-4">
          <Package class="w-6 h-6" />
        </div>
        <h3 class="text-lg font-bold text-[#27172b] mb-1">Acceso de Administrador</h3>
        <p class="text-xs text-gray-500 mb-6">
          Ingresa tus credenciales de PocketBase para duplicar productos directamente en la base de datos.
        </p>

        <form @submit.prevent="loginAsAdmin" class="space-y-4 text-left">
          <div>
            <label class="block text-[11px] font-bold text-gray-600 uppercase mb-1">Correo Administrador</label>
            <input
              type="email"
              v-model="loginEmail"
              required
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#965e9b] focus:outline-none"
              placeholder="venezzia@gmail.com"
            />
          </div>

          <div>
            <label class="block text-[11px] font-bold text-gray-600 uppercase mb-1">Contraseña</label>
            <input
              type="password"
              v-model="loginPassword"
              required
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#965e9b] focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <div v-if="loginError" class="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
            <AlertCircle class="w-4 h-4 shrink-0" />
            <span>{{ loginError }}</span>
          </div>

          <button
            type="submit"
            :disabled="isLoggingIn"
            class="w-full py-3 rounded-xl bg-[#27172b] text-white text-xs font-bold hover:bg-[#3d2444] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <RefreshCw v-if="isLoggingIn" class="w-4 h-4 animate-spin text-[#caa35f]" />
            <span>{{ isLoggingIn ? 'Conectando...' : 'Conectar con PocketBase' }}</span>
          </button>
        </form>
      </div>

      <!-- Main Workspace (Catalog Browser & Duplicator) -->
      <div v-else class="space-y-6">
        <!-- Filter & Search Toolbar -->
        <div class="bg-white rounded-2xl p-4 border border-[#eedee9] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <!-- Campaign Pills -->
          <div class="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              v-for="camp in campaignsList"
              :key="camp.id"
              @click="selectedCampaign = camp.id"
              :class="[
                'px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer',
                selectedCampaign === camp.id
                  ? 'bg-[#27172b] text-white shadow-xs'
                  : 'bg-[#faf7fb] text-gray-600 hover:bg-[#f3edf5]'
              ]"
            >
              {{ camp.name }}
            </button>
          </div>

          <!-- Search Input -->
          <div class="relative min-w-[240px]">
            <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Buscar producto por nombre..."
              class="w-full pl-9 pr-4 py-2 rounded-xl bg-[#faf7fb] border border-gray-200 text-xs text-[#27172b] focus:border-[#965e9b] focus:bg-white focus:outline-none transition-all"
            />
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoadingProducts" class="py-20 text-center">
          <RefreshCw class="w-8 h-8 animate-spin text-[#965e9b] mx-auto mb-3" />
          <p class="text-xs text-gray-500">Cargando productos de PocketBase...</p>
        </div>

        <!-- Products Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <div
            v-for="prod in filteredProducts"
            :key="prod.id"
            class="bg-white rounded-2xl border border-[#eedee9] p-4 flex flex-col justify-between hover:border-[#caa35f]/60 hover:shadow-md transition-all group"
          >
            <div>
              <!-- Product Image Thumbnail -->
              <div class="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-[#faf6f5] mb-3 flex items-center justify-center p-2">
                <img
                  v-if="prod.image"
                  :src="prod.displayImage"
                  :alt="prod.name"
                  class="w-full h-full object-contain object-center rounded-lg"
                  loading="lazy"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                  <Package class="w-8 h-8" />
                </div>

                <div class="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 shadow-2xs backdrop-blur-xs text-[#27172b]">
                  S/ {{ Number(prod.price).toFixed(2) }}
                </div>
              </div>

              <!-- Product Info -->
              <span class="text-[10px] font-bold tracking-wider uppercase text-[#965e9b] block mb-1">
                {{ prod.category || prod.campaign }}
              </span>
              <h3 class="text-sm font-semibold text-[#27172b] line-clamp-2 leading-snug mb-1">
                {{ prod.name }}
              </h3>
              <p class="text-[11px] text-gray-400 font-mono mb-3">
                ID: {{ prod.id }}
              </p>
            </div>

            <!-- Actions -->
            <div class="pt-3 border-t border-[#f4eaf6] flex items-center gap-2">
              <button
                @click="openDuplicateModal(prod)"
                class="flex-1 py-2 px-3 rounded-xl bg-[#27172b] text-white text-xs font-semibold hover:bg-[#965e9b] transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Copy class="w-3.5 h-3.5 text-[#caa35f]" />
                <span>Duplicar</span>
              </button>

              <a
                :href="getRecordAdminUrl(prod.id)"
                target="_blank"
                rel="noopener noreferrer"
                title="Abrir este producto en PocketBase Admin"
                class="p-2 rounded-xl border border-gray-200 text-gray-500 hover:text-[#965e9b] hover:border-[#965e9b] transition-all"
              >
                <ExternalLink class="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Duplicate Confirmation Modal -->
      <div v-if="activeModalProduct" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        <div class="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-[#eedee9]">
          <div class="flex items-center justify-between pb-4 border-b border-[#f4eaf6] mb-5">
            <div>
              <span class="text-[10px] font-bold tracking-wider uppercase text-[#965e9b] block">Clonar Producto</span>
              <h3 class="text-lg font-bold text-[#27172b]">Confirmar Duplicación</h3>
            </div>
            <button
              @click="closeDuplicateModal"
              class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center text-sm transition-colors"
            >
              ✕
            </button>
          </div>

          <!-- Form Fields for the clone -->
          <div class="space-y-4">
            <!-- Image & Original preview -->
            <div class="p-3.5 rounded-2xl bg-[#faf7fb] border border-[#eedee9] flex items-center gap-3">
              <img
                v-if="activeModalProduct.image"
                :src="activeModalProduct.displayImage"
                class="w-14 h-14 object-contain rounded-xl bg-white border border-[#eedee9] shrink-0"
              />
              <div class="min-w-0">
                <span class="text-[10px] text-gray-400 font-medium block">Producto base a clonar:</span>
                <h4 class="text-xs font-semibold text-[#27172b] truncate">{{ activeModalProduct.name }}</h4>
                <span class="text-[11px] text-[#caa35f] font-bold">S/ {{ Number(activeModalProduct.price).toFixed(2) }}</span>
              </div>
            </div>

            <!-- New Name Input -->
            <div>
              <label class="block text-[11px] font-bold text-gray-700 uppercase mb-1">Nombre del nuevo producto:</label>
              <input
                type="text"
                v-model="duplicateForm.name"
                class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-[#965e9b] focus:outline-none"
                placeholder="Nombre para el nuevo producto"
              />
            </div>

            <!-- Price & Compare Price -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[11px] font-bold text-gray-700 uppercase mb-1">Precio (S/):</label>
                <input
                  type="number"
                  step="0.5"
                  v-model="duplicateForm.price"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#27172b] focus:border-[#965e9b] focus:outline-none"
                />
              </div>

              <div>
                <label class="block text-[11px] font-bold text-gray-700 uppercase mb-1">Precio Promo / Anterior (S/):</label>
                <input
                  type="number"
                  step="0.5"
                  v-model="duplicateForm.compare_at_price"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-500 focus:border-[#965e9b] focus:outline-none"
                  placeholder="Opcional"
                />
              </div>
            </div>

            <!-- Campaign & Category -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[11px] font-bold text-gray-700 uppercase mb-1">Campaña:</label>
                <select
                  v-model="duplicateForm.campaign"
                  class="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#965e9b] focus:outline-none cursor-pointer"
                >
                  <option value="maquillaje">Maquillaje</option>
                  <option value="hotwheels">Hot Wheels</option>
                  <option value="graduacion">Graduación</option>
                  <option value="cumpleanos">Cumpleaños</option>
                </select>
              </div>

              <div>
                <label class="block text-[11px] font-bold text-gray-700 uppercase mb-1">Categoría:</label>
                <input
                  type="text"
                  v-model="duplicateForm.category"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#965e9b] focus:outline-none"
                />
              </div>
            </div>

            <!-- Items Included Textarea -->
            <div>
              <label class="block text-[11px] font-bold text-gray-700 uppercase mb-1">Elementos Incluidos (uno por línea):</label>
              <textarea
                v-model="duplicateForm.items_included"
                rows="4"
                class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono focus:border-[#965e9b] focus:outline-none leading-relaxed"
                placeholder="1 Ramo&#10;Luces LED&#10;Tarjeta dedicatoria"
              ></textarea>
            </div>

            <!-- Options: Clone Image checkbox -->
            <label class="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                v-model="duplicateForm.copyImage"
                class="w-4 h-4 rounded text-[#965e9b] accent-[#965e9b]"
              />
              <span class="text-xs text-gray-700 font-medium">Clonar y transferir la misma foto al nuevo producto</span>
            </label>

            <!-- Success message card if already duplicated -->
            <div v-if="duplicateSuccess" class="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-xs space-y-2">
              <div class="flex items-center gap-2 font-bold text-green-900">
                <CheckCircle2 class="w-4 h-4 text-green-600" />
                <span>¡Producto duplicado con éxito!</span>
              </div>
              <p class="text-[11px] text-green-700">
                Nuevo producto creado con ID <code>{{ duplicateSuccess.id }}</code>.
              </p>
              <div class="flex items-center gap-2 pt-1">
                <a
                  :href="getRecordAdminUrl(duplicateSuccess.id)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-700 text-white font-bold text-[11px] hover:bg-green-800 transition-colors"
                >
                  <span>Abrir en PocketBase</span>
                  <ExternalLink class="w-3 h-3" />
                </a>
                <router-link
                  :to="`/?prod=${duplicateSuccess.id}`"
                  target="_blank"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-green-300 text-green-800 font-semibold text-[11px] hover:bg-green-100 transition-colors"
                >
                  <span>Ver en la Tienda</span>
                </router-link>
              </div>
            </div>

            <!-- Error message if failed -->
            <div v-if="duplicateError" class="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
              <AlertCircle class="w-4 h-4 shrink-0" />
              <span>{{ duplicateError }}</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="mt-6 pt-4 border-t border-[#f4eaf6] flex items-center justify-end gap-3">
            <button
              @click="closeDuplicateModal"
              class="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              {{ duplicateSuccess ? 'Cerrar' : 'Cancelar' }}
            </button>

            <button
              v-if="!duplicateSuccess"
              @click="executeDuplication"
              :disabled="isDuplicating"
              class="px-5 py-2.5 rounded-xl bg-[#27172b] text-white text-xs font-bold hover:bg-[#965e9b] transition-all flex items-center gap-2 disabled:opacity-50 shadow-sm cursor-pointer"
            >
              <RefreshCw v-if="isDuplicating" class="w-3.5 h-3.5 animate-spin text-[#caa35f]" />
              <span>{{ isDuplicating ? 'Duplicando...' : 'Confirmar y Duplicar Ahora' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import PocketBase from 'pocketbase'
import {
  Copy, Check, Search, ExternalLink, Sparkles, Filter,
  ArrowRight, RefreshCw, AlertCircle, Home, CheckCircle2,
  Package, Tag, DollarSign, Layers, PlusCircle, ArrowUpRight
} from 'lucide-vue-next'

const targetServer = ref('remote')
const currentPbClient = ref(null)

const isAuthenticated = ref(false)
const loginEmail = ref('venezzia@gmail.com')
const loginPassword = ref('venezzia2026')
const isLoggingIn = ref(false)
const loginError = ref('')

const products = ref([])
const isLoadingProducts = ref(false)
const selectedCampaign = ref('all')
const searchQuery = ref('')

const activeModalProduct = ref(null)
const isDuplicating = ref(false)
const duplicateSuccess = ref(null)
const duplicateError = ref('')
const copiedBookmarklet = ref(false)

const duplicateForm = ref({
  name: '',
  price: 0,
  compare_at_price: null,
  campaign: 'maquillaje',
  category: '',
  items_included: '',
  copyImage: true
})

const campaignsList = [
  { id: 'all', name: 'Todos los Productos' },
  { id: 'maquillaje', name: 'Maquillaje' },
  { id: 'hotwheels', name: 'Hot Wheels' },
  { id: 'graduacion', name: 'Graduación' },
  { id: 'cumpleanos', name: 'Cumpleaños' }
]

function getTargetBaseUrl() {
  return targetServer.value === 'remote' ? 'https://admin.venezzia.shop' : 'http://127.0.0.1:8090'
}

const adminUrl = computed(() => {
  return `${getTargetBaseUrl()}/_/`
})

function getRecordAdminUrl(recordId) {
  return `${getTargetBaseUrl()}/_/#/collections?collectionId=pbc_products_01&recordId=${recordId}`
}

function initPbClient() {
  const url = getTargetBaseUrl()
  currentPbClient.value = new PocketBase(url)
  // Check if already authenticated
  if (currentPbClient.value.authStore.isValid && currentPbClient.value.authStore.isSuperuser) {
    isAuthenticated.value = true
    loadProducts()
  } else {
    // Attempt auto-login with default superuser credentials
    attemptAutoLogin()
  }
}

async function attemptAutoLogin() {
  isLoggingIn.value = true
  try {
    await currentPbClient.value.collection('_superusers').authWithPassword(loginEmail.value, loginPassword.value)
    isAuthenticated.value = true
    loginError.value = ''
    await loadProducts()
  } catch (err) {
    isAuthenticated.value = false
  } finally {
    isLoggingIn.value = false
  }
}

async function loginAsAdmin() {
  isLoggingIn.value = true
  loginError.value = ''
  try {
    await currentPbClient.value.collection('_superusers').authWithPassword(loginEmail.value, loginPassword.value)
    isAuthenticated.value = true
    await loadProducts()
  } catch (err) {
    loginError.value = err?.message || 'Credenciales incorrectas de PocketBase.'
  } finally {
    isLoggingIn.value = false
  }
}

function onServerChange() {
  initPbClient()
}

async function loadProducts() {
  if (!currentPbClient.value) return
  isLoadingProducts.value = true
  try {
    const records = await currentPbClient.value.collection('products').getFullList()
    products.value = records.map(r => {
      let displayImg = ''
      if (r.image) {
        displayImg = currentPbClient.value.files.getURL(r, r.image, { thumb: '0x800' })
      }
      return {
        ...r,
        displayImage: displayImg
      }
    })
  } catch (err) {
    console.error('Error loading products:', err)
  } finally {
    isLoadingProducts.value = false
  }
}

const filteredProducts = computed(() => {
  let list = products.value
  if (selectedCampaign.value !== 'all') {
    list = list.filter(p => (p.campaign || 'maquillaje') === selectedCampaign.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(p => (p.name || '').toLowerCase().includes(q) || (p.category || '').toLowerCase().includes(q))
  }
  return list
})

function openDuplicateModal(product) {
  activeModalProduct.value = product
  duplicateSuccess.value = null
  duplicateError.value = ''
  duplicateForm.value = {
    name: `${product.name} (Copia)`,
    price: product.price || 0,
    compare_at_price: product.compare_at_price || null,
    campaign: product.campaign || 'maquillaje',
    category: product.category || 'General',
    items_included: typeof product.items_included === 'string'
      ? product.items_included
      : Array.isArray(product.items_included)
        ? product.items_included.join('\n')
        : '',
    copyImage: true
  }
}

function closeDuplicateModal() {
  activeModalProduct.value = null
  duplicateSuccess.value = null
  duplicateError.value = ''
}

async function executeDuplication() {
  if (!activeModalProduct.value || !currentPbClient.value) return
  isDuplicating.value = true
  duplicateError.value = ''
  duplicateSuccess.value = null

  try {
    const orig = activeModalProduct.value
    const formData = new FormData()
    formData.append('name', duplicateForm.value.name.trim())
    formData.append('campaign', duplicateForm.value.campaign)
    formData.append('description', orig.description || '')
    formData.append('price', String(duplicateForm.value.price))
    if (duplicateForm.value.compare_at_price) {
      formData.append('compare_at_price', String(duplicateForm.value.compare_at_price))
    }
    formData.append('category', duplicateForm.value.category || 'General')
    formData.append('in_stock', 'true')
    formData.append('items_included', duplicateForm.value.items_included || '')

    // Download original image file and append to FormData as Blob
    if (duplicateForm.value.copyImage && orig.image) {
      const origImgUrl = currentPbClient.value.files.getURL(orig, orig.image)
      const res = await fetch(origImgUrl)
      if (res.ok) {
        const blob = await res.blob()
        formData.append('image', blob, orig.image)
      }
    }

    const newRecord = await currentPbClient.value.collection('products').create(formData)
    duplicateSuccess.value = newRecord

    // Refresh products list
    await loadProducts()
  } catch (err) {
    console.error('Duplication error:', err)
    duplicateError.value = err?.message || 'Error al duplicar el producto en PocketBase.'
  } finally {
    isDuplicating.value = false
  }
}

// Bookmarklet Code that runs directly inside PocketBase Admin
const bookmarkletRawCode = `javascript:(async function(){try{if(!window.location.href.includes('/_/')){alert('Por favor abre esta herramienta mientras estes dentro de PocketBase Admin (https://admin.venezzia.shop/_/)');return;}let token='';const cookieMatch=document.cookie.match(/pb_auth=([^;]+)/);if(cookieMatch){try{token=JSON.parse(decodeURIComponent(cookieMatch[1])).token;}catch(_){}}if(!token){for(let i=0;i<localStorage.length;i++){try{const val=JSON.parse(localStorage.getItem(localStorage.key(i)));if(val&&val.token){token=val.token;break;}}catch(_){}}}if(!token){alert('No se detecto sesion de PocketBase. Por favor inicia sesion primero.');return;}let recordId='';const hash=window.location.hash;const urlParams=new URLSearchParams(hash.includes('?')?hash.split('?')[1]:'');recordId=urlParams.get('recordId')||'';if(!recordId){const idInput=document.querySelector('input[readonly][value]');if(idInput&&idInput.value&&idInput.value.length>=15){recordId=idInput.value;}}if(!recordId){recordId=prompt('Ingresa el ID del producto que deseas duplicar:');if(!recordId)return;}const toast=document.createElement('div');toast.style.cssText='position:fixed;top:20px;right:20px;background:#27172b;color:#fff;padding:16px 24px;border-radius:12px;font-family:sans-serif;font-size:14px;z-index:999999;box-shadow:0 10px 30px rgba(0,0,0,0.3);border:2px solid #caa35f;';toast.innerHTML='⏳ Obteniendo producto y duplicando imagen...';document.body.appendChild(toast);const recRes=await fetch('/api/collections/products/records/'+recordId,{headers:{Authorization:token}});if(!recRes.ok){toast.remove();alert('Error al obtener el producto con ID: '+recordId);return;}const orig=await recRes.json();const newName=prompt('Nombre para el nuevo producto duplicado:',orig.name+' (Copia)');if(!newName){toast.remove();return;}const formData=new FormData();formData.append('name',newName);formData.append('campaign',orig.campaign||'maquillaje');formData.append('description',orig.description||'');formData.append('price',String(orig.price));if(orig.compare_at_price)formData.append('compare_at_price',String(orig.compare_at_price));formData.append('category',orig.category||'General');formData.append('in_stock',String(orig.in_stock));if(orig.items_included)formData.append('items_included',orig.items_included);if(orig.image){toast.innerHTML='⏳ Copiando imagen del producto...';const imgUrl='/api/files/'+orig.collectionId+'/'+orig.id+'/'+orig.image;const imgRes=await fetch(imgUrl);const imgBlob=await imgRes.blob();formData.append('image',imgBlob,orig.image);}toast.innerHTML='⏳ Guardando nuevo producto en PocketBase...';const createRes=await fetch('/api/collections/products/records',{method:'POST',headers:{Authorization:token},body:formData});if(!createRes.ok){const errData=await createRes.json();toast.remove();alert('Error al duplicar: '+(errData.message||'Error'));return;}const newRec=await createRes.json();toast.style.background='#15803d';toast.innerHTML='✅ ¡Producto duplicado con exito!<br>Abriendo nueva copia...';setTimeout(()=>{toast.remove();window.location.hash='#/collections?collectionId='+orig.collectionId+'&recordId='+newRec.id;window.location.reload();},1200);}catch(e){alert('Error al duplicar: '+e.message);}})();`

const bookmarkletHref = computed(() => bookmarkletRawCode)

function copyBookmarkletCode() {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(bookmarkletRawCode)
    copiedBookmarklet.value = true
    setTimeout(() => {
      copiedBookmarklet.value = false
    }, 2500)
  }
}

onMounted(() => {
  initPbClient()
})
</script>
