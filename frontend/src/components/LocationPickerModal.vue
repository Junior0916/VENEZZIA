<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    @click.self="emit('close')"
  >
    <div
      class="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-[#eedcd8] overflow-hidden flex flex-col max-h-[94vh] text-gray-800"
    >
      <!-- Modal Header -->
      <div class="px-5 py-3.5 border-b border-[#eedee9] bg-gradient-to-r from-[#faf5fb] to-[#fff] flex items-center justify-between shrink-0">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-full bg-[#fbf2e5] text-[#b0873b] flex items-center justify-center shadow-xs">
            <MapPin class="w-4 h-4 text-[#caa35f]" />
          </div>
          <div>
            <h3 class="font-serif font-bold text-sm text-[#27172b]">Fijar Ubicación de Entrega</h3>
            <p class="text-[10px] text-gray-500">Mueve el mapa para ubicar el punto exacto para el delivery</p>
          </div>
        </div>
        <button
          type="button"
          @click="emit('close')"
          class="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Search & GPS Controls -->
      <div class="p-3 bg-[#fdfafc] border-b border-[#eedee9] space-y-2 shrink-0">
        <div class="flex items-center gap-2">
          <!-- Search input -->
          <div class="relative flex-1">
            <Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              v-model="searchQuery"
              @keydown.enter.prevent="handleSearch"
              type="text"
              placeholder="Buscar avenida, distrito o referencia en Lima / Perú..."
              class="w-full text-xs pl-8 pr-8 py-2 rounded-xl border border-[#eedee9] bg-white focus:outline-none focus:ring-2 focus:ring-[#caa35f]/20 focus:border-[#caa35f]"
            />
            <button
              v-if="searchQuery"
              type="button"
              @click="searchQuery = ''; searchResults = []"
              class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X class="w-3.5 h-3.5" />
            </button>
          </div>

          <!-- GPS Button -->
          <button
            type="button"
            @click="useCurrentLocation"
            :disabled="locating"
            title="Usar mi ubicación GPS actual"
            class="px-3 py-2 rounded-xl bg-white hover:bg-[#fbf7fc] border border-[#eedee9] text-xs font-semibold text-gray-700 flex items-center gap-1.5 shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer disabled:opacity-50"
          >
            <Loader2 v-if="locating" class="w-3.5 h-3.5 animate-spin text-[#caa35f]" />
            <Navigation v-else class="w-3.5 h-3.5 text-[#caa35f]" />
            <span class="hidden sm:inline">Mi GPS</span>
          </button>
        </div>

        <!-- Search dropdown results -->
        <div
          v-if="searchResults.length > 0"
          class="bg-white rounded-xl border border-[#eedee9] shadow-lg max-h-40 overflow-y-auto divide-y divide-gray-100 text-xs"
        >
          <button
            v-for="(res, idx) in searchResults"
            :key="idx"
            type="button"
            @click="selectSearchResult(res)"
            class="w-full text-left px-3 py-2 hover:bg-[#faf5fb] transition-colors flex items-start gap-2 cursor-pointer"
          >
            <MapPin class="w-3.5 h-3.5 text-[#caa35f] shrink-0 mt-0.5" />
            <span class="line-clamp-1 text-gray-700 text-[11px]">{{ res.display_name }}</span>
          </button>
        </div>

        <!-- Locating Error Warning -->
        <p v-if="gpsError" class="text-[10px] text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
          {{ gpsError }}
        </p>
      </div>

      <!-- Interactive Map Area with Central Floating Pin -->
      <div class="relative w-full bg-[#f4ecef] overflow-hidden" style="height: 380px; min-height: 320px;">
        <!-- Leaflet Map Mount Container (Trapped at z-index: 1) -->
        <div ref="mapContainer" class="relative w-full h-full" style="height: 380px; width: 100%; z-index: 1;"></div>

        <!-- Layer Switcher (Calles vs Satélite) -->
        <div
          class="absolute top-3 right-3 flex items-center bg-white/95 backdrop-blur-xs rounded-xl shadow-lg border border-gray-200 p-0.5 text-[10px] font-semibold text-gray-700"
          style="z-index: 1000;"
        >
          <button
            type="button"
            @click="setMapType('streets')"
            :class="mapType === 'streets' ? 'bg-[#27172b] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'"
            class="px-2.5 py-1 rounded-lg transition-all cursor-pointer"
          >
            Calles
          </button>
          <button
            type="button"
            @click="setMapType('satellite')"
            :class="mapType === 'satellite' ? 'bg-[#27172b] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'"
            class="px-2.5 py-1 rounded-lg transition-all cursor-pointer"
          >
            Satélite
          </button>
        </div>

        <!-- Floating Hint Pill -->
        <div
          class="absolute top-3 left-1/2 -translate-x-1/2 pointer-events-none"
          style="z-index: 1000;"
        >
          <div class="px-3.5 py-1 rounded-full bg-black/80 backdrop-blur-xs text-white text-[10px] font-medium shadow-lg flex items-center gap-1.5 whitespace-nowrap border border-white/20">
            <span>📍 Mueve el mapa hasta tu puerta</span>
          </div>
        </div>

        <!-- Central Pin Overlay (Always visible in exact center) -->
        <div
          class="absolute inset-0 pointer-events-none flex items-center justify-center"
          style="z-index: 999;"
        >
          <div class="relative -translate-y-1/2 flex flex-col items-center">
            <!-- Pin Body with Bouncing Animation -->
            <div class="animate-bounce -translate-y-2 flex flex-col items-center drop-shadow-2xl">
              <!-- Pin Head -->
              <div class="w-11 h-11 rounded-full bg-gradient-to-tr from-[#994c58] via-[#caa35f] to-[#e6c987] text-white flex items-center justify-center shadow-2xl border-[3px] border-white ring-2 ring-black/25">
                <MapPin class="w-6 h-6 fill-white text-[#994c58]" />
              </div>
              <!-- Pin Pointer Needle -->
              <div class="w-2 h-3.5 bg-gradient-to-b from-[#caa35f] to-[#994c58] rounded-b-full shadow-md -mt-1 border-x border-white"></div>
            </div>
            <!-- Target Radar Ground Dot -->
            <div class="relative -mt-2 flex items-center justify-center">
              <div class="w-4 h-2 bg-black/60 rounded-full blur-[0.5px]"></div>
              <div class="absolute w-2 h-1 bg-[#caa35f] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer & Confirmation -->
      <div class="p-4 border-t border-[#eedee9] bg-[#faf5fb] space-y-3 shrink-0">
        <!-- Detected address / coordinates info -->
        <div class="p-2.5 rounded-xl bg-white border border-[#eedee9] text-xs space-y-1">
          <div class="flex items-center justify-between text-[11px] text-gray-500 font-mono">
            <span>Coordenadas GPS:</span>
            <span>{{ currentLat.toFixed(5) }}, {{ currentLng.toFixed(5) }}</span>
          </div>
          <div v-if="detectedAddress" class="text-xs text-gray-800 font-medium line-clamp-1 flex items-center gap-1.5">
            <span class="text-[#caa35f] shrink-0">📍</span>
            <span class="truncate">{{ detectedAddress }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="emit('close')"
            class="w-1/3 py-2.5 px-3 rounded-full border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold text-xs tracking-wide transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            @click="confirmLocation"
            class="w-2/3 py-2.5 px-4 rounded-full bg-gradient-to-r from-[#27172b] to-[#401f46] hover:from-[#caa35f] hover:to-[#b0873b] hover:text-[#27172b] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-purple-950/20 border border-[#caa35f]/50 flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.99]"
          >
            <Check class="w-4 h-4" />
            <span>Confirmar Ubicación</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onUnmounted } from 'vue'
import { MapPin, X, Search, Navigation, Loader2, Check } from 'lucide-vue-next'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  initialCoords: {
    type: Object,
    default: () => null
  }
})

const emit = defineEmits(['close', 'select'])

const mapContainer = ref(null)
let map = null
let currentTileLayer = null
let fallbackApplied = false

// Default: Lima, Perú (Miraflores central coordinates)
const defaultLat = -12.1218
const defaultLng = -77.0298

const currentLat = ref(defaultLat)
const currentLng = ref(defaultLng)
const detectedAddress = ref('')
const mapType = ref('streets')

const searchQuery = ref('')
const searchResults = ref([])
const locating = ref(false)
const gpsError = ref('')

let reverseGeocodeTimer = null
let resizeObserver = null

function getTileLayer(type) {
  fallbackApplied = false
  if (type === 'satellite') {
    // Google Hybrid (satellite + streets overlay)
    return L.tileLayer('https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: 'Google Maps'
    })
  }

  // Google Maps standard roadmap (official street names in Peru)
  return L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: 'Google Maps'
  })
}

function setMapType(type) {
  mapType.value = type
  if (!map) return
  if (currentTileLayer) {
    map.removeLayer(currentTileLayer)
  }
  currentTileLayer = getTileLayer(type)
  attachTileFallback(currentTileLayer)
  currentTileLayer.addTo(map)
}

function attachTileFallback(tileLayer) {
  tileLayer.on('tileerror', () => {
    if (!fallbackApplied && map) {
      fallbackApplied = true
      console.warn('[Map] Switching to Carto Voyager fallback tiles')
      map.removeLayer(tileLayer)
      currentTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: 'CartoDB'
      }).addTo(map)
    }
  })
}

function initMap() {
  if (!mapContainer.value) return

  // Initial coordinates
  const startLat = props.initialCoords?.lat || currentLat.value || defaultLat
  const startLng = props.initialCoords?.lng || currentLng.value || defaultLng

  currentLat.value = startLat
  currentLng.value = startLng

  if (map) {
    map.remove()
    map = null
  }

  // Create Leaflet map
  map = L.map(mapContainer.value, {
    center: [startLat, startLng],
    zoom: props.initialCoords ? 16 : 14,
    zoomControl: false,
    preferCanvas: true
  })

  // Add zoom control in top-left
  L.control.zoom({ position: 'topleft' }).addTo(map)

  // Add tiles
  currentTileLayer = getTileLayer(mapType.value)
  attachTileFallback(currentTileLayer)
  currentTileLayer.addTo(map)

  // Track map movement to update current center coordinates
  map.on('move', () => {
    const center = map.getCenter()
    currentLat.value = center.lat
    currentLng.value = center.lng
  })

  map.on('moveend', () => {
    const center = map.getCenter()
    currentLat.value = center.lat
    currentLng.value = center.lng
    debouncedReverseGeocode(center.lat, center.lng)
  })

  // Also support clicking directly on map to pan
  map.on('click', (e) => {
    map.panTo(e.latlng)
  })

  // Initial reverse geocode
  debouncedReverseGeocode(startLat, startLng)

  // Setup ResizeObserver to guarantee tiles are always sized correctly
  if (window.ResizeObserver && !resizeObserver) {
    resizeObserver = new ResizeObserver(() => {
      if (map) map.invalidateSize()
    })
    resizeObserver.observe(mapContainer.value)
  }
}

function debouncedReverseGeocode(lat, lng) {
  if (reverseGeocodeTimer) clearTimeout(reverseGeocodeTimer)
  reverseGeocodeTimer = setTimeout(async () => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { 'Accept-Language': 'es' } }
      )
      if (res.ok) {
        const data = await res.json()
        if (data && data.display_name) {
          const addr = data.address || {}
          const road = addr.road || addr.pedestrian || ''
          const houseNumber = addr.house_number ? ` ${addr.house_number}` : ''
          const suburb = addr.suburb || addr.neighbourhood || ''
          const city = addr.city || addr.town || addr.county || ''

          let shortAddr = [road + houseNumber, suburb, city].filter(Boolean).join(', ')
          detectedAddress.value = shortAddr || data.display_name.split(',').slice(0, 3).join(',')
        }
      }
    } catch (e) {
      // Quiet fallback
    }
  }, 400)
}

async function handleSearch() {
  const q = searchQuery.value.trim()
  if (!q) return

  try {
    const queryWithCountry = q.toLowerCase().includes('peru') || q.toLowerCase().includes('lima') ? q : `${q}, Lima, Peru`
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&countrycodes=pe&limit=5&q=${encodeURIComponent(queryWithCountry)}`,
      { headers: { 'Accept-Language': 'es' } }
    )
    if (res.ok) {
      const results = await res.json()
      searchResults.value = results
      if (results.length === 0) {
        gpsError.value = 'No se encontraron resultados para esa dirección. Intenta con una referencia cercana.'
        setTimeout(() => (gpsError.value = ''), 4000)
      }
    }
  } catch (e) {
    gpsError.value = 'Error al buscar dirección.'
    setTimeout(() => (gpsError.value = ''), 3000)
  }
}

function selectSearchResult(item) {
  const lat = parseFloat(item.lat)
  const lon = parseFloat(item.lon)
  if (map && !isNaN(lat) && !isNaN(lon)) {
    map.setView([lat, lon], 17)
    currentLat.value = lat
    currentLng.value = lon
    detectedAddress.value = item.display_name.split(',').slice(0, 3).join(',')
    searchResults.value = []
    searchQuery.value = ''
  }
}

function useCurrentLocation() {
  if (!navigator.geolocation) {
    gpsError.value = 'Tu navegador no soporta geolocalización GPS.'
    setTimeout(() => (gpsError.value = ''), 4000)
    return
  }

  locating.value = true
  gpsError.value = ''

  navigator.geolocation.getCurrentPosition(
    (position) => {
      locating.value = false
      const lat = position.coords.latitude
      const lng = position.coords.longitude
      currentLat.value = lat
      currentLng.value = lng
      if (map) {
        map.setView([lat, lng], 17)
      }
    },
    (err) => {
      locating.value = false
      if (err.code === 1) {
        gpsError.value = 'Permiso GPS denegado. Por favor busca tu calle o mueve el mapa manualmente.'
      } else {
        gpsError.value = 'No se pudo obtener tu ubicación precisa. Mueve el mapa manualmente.'
      }
      setTimeout(() => (gpsError.value = ''), 5000)
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  )
}

function confirmLocation() {
  const lat = Number(currentLat.value.toFixed(6))
  const lng = Number(currentLng.value.toFixed(6))
  const mapUrl = `https://maps.google.com/?q=${lat},${lng}`

  emit('select', {
    lat,
    lng,
    mapUrl,
    addressText: detectedAddress.value
  })

  emit('close')
}

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      searchQuery.value = ''
      searchResults.value = []
      gpsError.value = ''
      nextTick(() => {
        initMap()
        // Run staggered invalidateSize to guarantee tiles render properly even during modal animations
        setTimeout(() => map?.invalidateSize(), 50)
        setTimeout(() => map?.invalidateSize(), 150)
        setTimeout(() => map?.invalidateSize(), 300)
        setTimeout(() => map?.invalidateSize(), 500)
      })
    } else {
      if (map) {
        map.remove()
        map = null
      }
      if (resizeObserver) {
        resizeObserver.disconnect()
        resizeObserver = null
      }
    }
  }
)

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  if (reverseGeocodeTimer) clearTimeout(reverseGeocodeTimer)
})
</script>

<style>
/* CRITICAL FIX: Prevent Tailwind preflight / CSS reset from breaking Leaflet tiles */
.leaflet-container {
  width: 100% !important;
  height: 100% !important;
  position: relative !important;
  outline: none;
  background-color: #f4ecef !important;
  font-family: inherit !important;
}

.leaflet-pane,
.leaflet-tile,
.leaflet-marker-icon,
.leaflet-marker-shadow,
.leaflet-tile-container,
.leaflet-pane > svg,
.leaflet-pane > canvas,
.leaflet-zoom-box,
.leaflet-image-layer,
.leaflet-layer {
  position: absolute !important;
  left: 0 !important;
  top: 0 !important;
}

.leaflet-tile-container img,
.leaflet-tile {
  max-width: none !important;
  max-height: none !important;
  width: 256px !important;
  height: 256px !important;
  display: block !important;
  visibility: inherit !important;
}

.leaflet-control-zoom {
  border: none !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  border-radius: 12px !important;
  overflow: hidden;
  margin-top: 12px !important;
  margin-left: 12px !important;
}

.leaflet-control-zoom a {
  background-color: #ffffff !important;
  color: #333333 !important;
  border: none !important;
  width: 30px !important;
  height: 30px !important;
  line-height: 30px !important;
  font-size: 14px !important;
  font-weight: bold !important;
}
</style>
