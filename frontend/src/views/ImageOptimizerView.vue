<template>
  <div class="py-10 sm:py-16 bg-[#faf7fb] min-h-screen">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <router-link to="/" class="hover:text-[#965e9b] transition-colors flex items-center gap-1">
          <Home class="w-3.5 h-3.5" />
          <span>Inicio</span>
        </router-link>
        <span>/</span>
        <span class="text-[#27172b] font-semibold">Herramienta de Recorte y Optimización</span>
      </nav>

      <!-- Header Card -->
      <div class="bg-white rounded-3xl p-6 sm:p-10 border border-[#eedee9] shadow-[0_2px_16px_-4px_rgba(154,104,155,0.06)] mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#f4eaf6]">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f6eef8] border border-[#e8d5ec] text-xs font-semibold text-[#753d77] mb-2">
              <Crop class="w-4 h-4 text-[#caa35f]" />
              <span>Estándar Oficial de Catálogo Venezzia</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-serif font-bold text-[#27172b] tracking-tight">
              Optimizador de Imágenes de Catálogo
            </h1>
            <p class="text-xs sm:text-sm text-gray-500 mt-1">
              Convierte, recorta y centra automáticamente cualquier fotografía al tamaño exacto de <strong>Ramo 2 La Ovejita</strong>.
            </p>
          </div>

          <!-- Dimension Badge -->
          <div class="p-4 bg-[#faf5fb] rounded-2xl border border-[#eedee9] text-center shrink-0">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Tamaño Estándar</span>
            <span class="text-lg font-bold text-[#27172b] font-mono">600 × 750 px</span>
            <span class="text-[11px] text-[#caa35f] font-semibold block mt-0.5">Ratio 4:5 Vertical</span>
          </div>
        </div>

        <!-- Dimension Specs Card -->
        <div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-600">
          <div class="p-3.5 rounded-2xl bg-[#faf7fb] border border-[#eedee9]">
            <strong class="text-gray-900 block mb-1">📐 Dimensiones Exactas:</strong>
            <span><strong>600 píxeles de ancho</strong> por <strong>750 píxeles de alto</strong>. Proporción 4:5 boutique.</span>
          </div>
          <div class="p-3.5 rounded-2xl bg-[#faf7fb] border border-[#eedee9]">
            <strong class="text-gray-900 block mb-1">🎨 Fondo Suave Oficial:</strong>
            <span>Color <code>#faf6f5</code> (rgb: 250, 246, 245), tono crema que combina con la web.</span>
          </div>
          <div class="p-3.5 rounded-2xl bg-[#faf7fb] border border-[#eedee9]">
            <strong class="text-gray-900 block mb-1">⚖️ Encuadre y Centrado:</strong>
            <span>El ramo o caja queda centrado con respiración de ~60px a los lados y ~20px arriba/abajo.</span>
          </div>
        </div>
      </div>

      <!-- Main Tool Workspace -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Left: Upload & Controls (Cols 1-5) -->
        <div class="lg:col-span-5 space-y-6">
          <!-- Dropzone -->
          <div
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
            :class="[
              'p-6 sm:p-8 rounded-3xl border-2 border-dashed text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[220px]',
              isDragging ? 'border-[#caa35f] bg-[#fbf7fd]' : 'border-[#eedee9] bg-white hover:border-[#caa35f] hover:bg-[#fcf9fd]'
            ]"
            @click="triggerFileInput"
          >
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleFileSelect"
            />
            <div class="w-12 h-12 rounded-2xl bg-[#faf5fb] text-[#965e9b] flex items-center justify-center mb-3">
              <Upload class="w-6 h-6" />
            </div>
            <h3 class="text-sm font-semibold text-[#27172b] mb-1">
              {{ originalFileName ? 'Cambiar imagen' : 'Selecciona o arrastra una imagen aquí' }}
            </h3>
            <p class="text-xs text-gray-400 max-w-xs">
              Soporta cualquier tamaño o formato (JPG, PNG, WebP). La herramienta la recortará a 600×750 px.
            </p>
            <button
              type="button"
              class="mt-4 px-4 py-2 rounded-full bg-[#27172b] text-white text-xs font-semibold tracking-wide hover:bg-[#caa35f] hover:text-[#27172b] transition-all cursor-pointer"
            >
              Buscar en mi equipo
            </button>
          </div>

          <!-- Controls if image loaded -->
          <div v-if="loadedImage" class="bg-white rounded-3xl p-6 border border-[#eedee9] shadow-xs space-y-5">
            <h4 class="text-xs font-bold uppercase tracking-wider text-[#27172b]">
              Ajustes de Recorte y Encuadre
            </h4>

            <!-- Mode Selector -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-2">Modo de Procesamiento:</label>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  @click="mode = 'smart'; updateCanvas()"
                  :class="[
                    'p-2.5 rounded-xl border text-left transition-all cursor-pointer font-medium',
                    mode === 'smart'
                      ? 'bg-[#27172b] text-white border-[#caa35f] shadow-xs'
                      : 'bg-[#faf7fb] text-gray-700 border-[#eedee9] hover:bg-white'
                  ]"
                >
                  <span class="block font-bold">Estilo Ovejita</span>
                  <span class="text-[10px] opacity-80 block mt-0.5">Ajuste con margen suave</span>
                </button>

                <button
                  type="button"
                  @click="mode = 'cover'; updateCanvas()"
                  :class="[
                    'p-2.5 rounded-xl border text-left transition-all cursor-pointer font-medium',
                    mode === 'cover'
                      ? 'bg-[#27172b] text-white border-[#caa35f] shadow-xs'
                      : 'bg-[#faf7fb] text-gray-700 border-[#eedee9] hover:bg-white'
                  ]"
                >
                  <span class="block font-bold">Recorte Cover</span>
                  <span class="text-[10px] opacity-80 block mt-0.5">Llena el cuadro al 100%</span>
                </button>
              </div>
            </div>

            <!-- Zoom Slider -->
            <div>
              <div class="flex justify-between text-xs mb-1">
                <span class="font-semibold text-gray-700">Escala / Zoom:</span>
                <span class="font-mono text-gray-500">{{ Math.round(scale * 100) }}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                v-model.number="scale"
                @input="updateCanvas"
                class="w-full accent-[#caa35f] cursor-pointer"
              />
            </div>

            <!-- Position Offset Sliders -->
            <div class="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span class="block font-semibold text-gray-700 mb-1">Mover X (horizontal):</span>
                <input
                  type="range"
                  min="-150"
                  max="150"
                  step="5"
                  v-model.number="offsetX"
                  @input="updateCanvas"
                  class="w-full accent-[#caa35f] cursor-pointer"
                />
              </div>
              <div>
                <span class="block font-semibold text-gray-700 mb-1">Mover Y (vertical):</span>
                <input
                  type="range"
                  min="-150"
                  max="150"
                  step="5"
                  v-model.number="offsetY"
                  @input="updateCanvas"
                  class="w-full accent-[#caa35f] cursor-pointer"
                />
              </div>
            </div>

            <!-- Reset Button -->
            <button
              type="button"
              @click="resetOffsets"
              class="w-full py-2 text-xs text-gray-500 hover:text-[#965e9b] transition-colors cursor-pointer text-center"
            >
              Restablecer posición y zoom
            </button>
          </div>
        </div>

        <!-- Right: Live Canvas Preview & Download (Cols 6-12) -->
        <div class="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#eedee9] shadow-xs flex flex-col items-center">
          <div class="w-full flex items-center justify-between pb-4 border-b border-[#f4eaf6] mb-5">
            <div>
              <h3 class="text-sm sm:text-base font-serif font-bold text-[#27172b]">
                Vista Previa en Vivo (Lienzo 600×750 px)
              </h3>
              <p class="text-[11px] text-gray-400">
                Así se verá exactamente en las tarjetas de producto de tu catálogo
              </p>
            </div>
            <span class="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold font-mono">
              600 × 750
            </span>
          </div>

          <!-- Canvas Container matching 4:5 Ratio -->
          <div class="relative w-full max-w-[340px] aspect-[4/5] rounded-2xl overflow-hidden shadow-lg border-2 border-[#eedee9] bg-[#faf6f5] flex items-center justify-center">
            <!-- Hidden Actual Resolution Canvas for Export -->
            <canvas
              ref="canvas"
              width="600"
              height="750"
              class="w-full h-full object-contain"
            ></canvas>

            <!-- Placeholder if no image -->
            <div
              v-if="!loadedImage"
              class="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-gray-400 space-y-2 pointer-events-none"
            >
              <ImageIcon class="w-12 h-12 stroke-[1.2]" />
              <p class="text-xs">Sube o arrastra una imagen para ver el recorte automático</p>
            </div>
          </div>

          <!-- Download Action -->
          <div class="mt-6 w-full max-w-sm space-y-3">
            <button
              type="button"
              :disabled="!loadedImage"
              @click="downloadOptimized"
              class="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#27172b] to-[#401f46] hover:from-[#caa35f] hover:to-[#b0873b] hover:text-[#27172b] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md border border-[#caa35f]/50 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Download class="w-4 h-4" />
              <span>Descargar Imagen Optimizada (600×750 px)</span>
            </button>

            <p class="text-[11px] text-gray-400 text-center">
              Archivo listo para subir a PocketBase o guardar en tu carpeta de productos.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Home, Crop, Upload, Download, Image as ImageIcon } from 'lucide-vue-next'

const fileInput = ref(null)
const canvas = ref(null)
const isDragging = ref(false)
const originalFileName = ref('')
const loadedImage = ref(null)

const mode = ref('smart') // 'smart' (padded fit like ovejita) or 'cover' (fill 4:5)
const scale = ref(1.0)
const offsetX = ref(0)
const offsetY = ref(0)

const TARGET_W = 600
const TARGET_H = 750
const BG_COLOR = '#faf6f5'

function triggerFileInput() {
  if (fileInput.value) fileInput.value.click()
}

function handleFileSelect(e) {
  const file = e.target.files?.[0]
  if (file) loadImageFile(file)
}

function handleDrop(e) {
  isDragging.value = false
  const file = e.dataTransfer.files?.[0]
  if (file && file.type.startsWith('image/')) {
    loadImageFile(file)
  }
}

function loadImageFile(file) {
  originalFileName.value = file.name
  const reader = new FileReader()
  reader.onload = (event) => {
    const img = new Image()
    img.onload = () => {
      loadedImage.value = img
      resetOffsets()
      updateCanvas()
    }
    img.src = event.target.result
  }
  reader.readAsDataURL(file)
}

function resetOffsets() {
  scale.value = 1.0
  offsetX.value = 0
  offsetY.value = 0
  updateCanvas()
}

function updateCanvas() {
  if (!canvas.value) return
  const ctx = canvas.value.getContext('2d')
  if (!ctx) return

  // 1. Clear & paint soft boutique background
  ctx.fillStyle = BG_COLOR
  ctx.fillRect(0, 0, TARGET_W, TARGET_H)

  if (!loadedImage.value) return

  const img = loadedImage.value
  const origW = img.width
  const origH = img.height

  let drawW = 0
  let drawH = 0

  if (mode.value === 'smart') {
    // Leave breathing room like Ramo Ovejita (~60px margins on width, ~40px on height)
    const maxW = TARGET_W - 60
    const maxH = TARGET_H - 40
    const fitRatio = Math.min(maxW / origW, maxH / origH) * scale.value
    drawW = origW * fitRatio
    drawH = origH * fitRatio
  } else {
    // Cover mode: fill 600x750 completely
    const targetAspect = TARGET_W / TARGET_H
    const origAspect = origW / origH
    let coverRatio = 1
    if (origAspect > targetAspect) {
      coverRatio = (TARGET_H / origH) * scale.value
    } else {
      coverRatio = (TARGET_W / origW) * scale.value
    }
    drawW = origW * coverRatio
    drawH = origH * coverRatio
  }

  const posX = (TARGET_W - drawW) / 2 + offsetX.value
  const posY = (TARGET_H - drawH) / 2 + offsetY.value

  ctx.drawImage(img, posX, posY, drawW, drawH)
}

function downloadOptimized() {
  if (!canvas.value) return
  const baseName = originalFileName.value.replace(/\.[^/.]+$/, '') || 'producto'
  const link = document.createElement('a')
  link.download = `${baseName}_centered_600x750.jpg`
  link.href = canvas.value.toDataURL('image/jpeg', 0.95)
  link.click()
}

onMounted(() => {
  updateCanvas()
})
</script>
