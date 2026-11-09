<template>
  <div ref="rootRef" class="relative w-full">
    <!-- Input Field -->
    <div class="relative">
      <input
        ref="inputRef"
        type="text"
        :value="displayValue"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
        :placeholder="placeholder"
        autocomplete="off"
        spellcheck="false"
        :class="[
          'w-full text-xs px-3.5 py-2.5 rounded-xl border bg-[#fbf7fc] focus:bg-white focus:outline-none focus:ring-2 transition-all pr-8',
          hasError
            ? 'border-rose-400 focus:ring-rose-200 text-rose-900 bg-rose-50/20'
            : 'border-[#eedee9] focus:ring-[#caa35f]/20 focus:border-[#caa35f] text-gray-800'
        ]"
      />

      <!-- Right Action / Icon -->
      <div class="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center">
        <!-- Clear Button -->
        <button
          v-if="displayValue"
          type="button"
          @mousedown.prevent="handleClear"
          class="p-0.5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          title="Borrar selección"
          tabindex="-1"
        >
          <X class="w-3.5 h-3.5" />
        </button>

        <!-- Dropdown toggle / Search indicator -->
        <button
          v-else
          type="button"
          @mousedown.prevent="toggleDropdown"
          class="p-0.5 text-gray-400 hover:text-[#caa35f] transition-colors cursor-pointer"
          tabindex="-1"
        >
          <ChevronDown
            class="w-3.5 h-3.5 transition-transform duration-200"
            :class="isOpen ? 'rotate-180 text-[#caa35f]' : ''"
          />
        </button>
      </div>
    </div>

    <!-- Dropdown Menu -->
    <transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 translate-y-1 scale-98"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-1 scale-98"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 top-full mt-1.5 w-[280px] sm:w-[320px] max-w-[calc(100vw-2.5rem)] bg-white border border-[#eedee9] rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
      >
        <!-- Header status / count -->
        <div class="px-3 py-2 bg-[#faf5fb] border-b border-[#eedee9] flex items-center justify-between text-[10px] text-gray-500 font-medium select-none">
          <span v-if="!searchQuery.trim()">
            Distritos sugeridos (Perú)
          </span>
          <span v-else>
            {{ filteredResults.length }} resultado{{ filteredResults.length === 1 ? '' : 's' }}
          </span>
          <span class="text-[#caa35f] font-semibold text-[9px] uppercase tracking-wider">
            Perú
          </span>
        </div>

        <!-- Scrollable Options List -->
        <ul
          ref="listRef"
          class="max-h-60 overflow-y-auto divide-y divide-[#f5ebf3] text-xs py-1 scroll-smooth"
          role="listbox"
        >
          <li
            v-for="(item, idx) in visibleResults"
            :key="item.id || item.label"
            @mousedown.prevent="selectItem(item)"
            @mouseenter="highlightedIndex = idx"
            :class="[
              'px-3.5 py-2.5 cursor-pointer transition-colors flex items-center justify-between gap-2 select-none',
              highlightedIndex === idx ? 'bg-[#fbf4fa] text-[#27172b]' : 'hover:bg-[#fdfafc] text-gray-700',
              modelValue === item.label ? 'font-semibold bg-[#f7edf5]/60' : ''
            ]"
            role="option"
            :aria-selected="modelValue === item.label"
          >
            <div class="min-w-0 flex-1">
              <!-- District name with highlighted query matching -->
              <div class="text-xs font-semibold text-[#27172b] truncate flex items-center gap-1.5">
                <MapPin class="w-3 h-3 text-[#caa35f] shrink-0" />
                <span v-html="highlightMatch(item.d, searchQuery)"></span>
              </div>
              <!-- Province and Department subtitle -->
              <div class="text-[10px] text-gray-500 truncate pl-[18px] mt-0.5">
                <span v-if="item.p !== item.dep">{{ item.p }} &bull; </span>{{ item.dep }}
              </div>
            </div>

            <!-- Checkmark if currently selected -->
            <Check
              v-if="modelValue === item.label"
              class="w-4 h-4 text-emerald-600 shrink-0"
            />
          </li>

          <!-- Empty State -->
          <li v-if="filteredResults.length === 0" class="p-4 text-center text-xs text-gray-500 space-y-1">
            <p class="font-medium text-gray-700">No encontramos ese distrito en el Perú</p>
            <p class="text-[11px] text-gray-400">Verifica la ortografía o intenta escribiendo tu provincia o departamento.</p>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { MapPin, ChevronDown, X, Check } from 'lucide-vue-next'
import peruLocations from '../data/peruLocations.json'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Buscar distrito...'
  },
  hasError: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'select', 'blur'])

const rootRef = ref(null)
const inputRef = ref(null)
const listRef = ref(null)
const isOpen = ref(false)
const searchQuery = ref('')
const highlightedIndex = ref(0)

// Curated list of popular districts in Peru for empty search state
const TOP_DISTRICT_IDS = [
  '150122', // Miraflores (Lima)
  '150131', // San Isidro (Lima)
  '150140', // Santiago de Surco (Lima)
  '150130', // San Borja (Lima)
  '150117', // Los Olivos (Lima)
  '150114', // La Molina (Lima)
  '150136', // San Miguel (Lima)
  '150113', // Jesús María (Lima)
  '150120', // Magdalena del Mar (Lima)
  '150121', // Pueblo Libre (Lima)
  '150104', // Barranco (Lima)
  '150108', // Chorrillos (Lima)
  '150132', // San Juan de Lurigancho (Lima)
  '150133', // San Juan de Miraflores (Lima)
  '150110', // Comas (Lima)
  '150103', // Ate (Lima)
  '070101', // Callao (Callao)
  '070102', // Bellavista (Callao)
  '040101', // Arequipa (Arequipa)
  '130101', // Trujillo (La Libertad)
  '200101', // Piura (Piura)
  '140101', // Chiclayo (Lambayeque)
  '080101'  // Cusco (Cusco)
]

const suggestedDistricts = computed(() => {
  return TOP_DISTRICT_IDS
    .map(id => peruLocations.find(x => x.id === id))
    .filter(Boolean)
})

function norm(s) {
  return (s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function highlightMatch(text, query) {
  if (!query || !query.trim()) return escapeHtml(text)
  const cleanQ = escapeRegExp(query.trim())
  const regex = new RegExp(`(${cleanQ})`, 'gi')
  const escaped = escapeHtml(text)
  return escaped.replace(regex, '<mark class="bg-[#caa35f]/30 text-[#27172b] font-bold rounded-xs px-0.5">$1</mark>')
}

const displayValue = computed(() => {
  if (isOpen.value) {
    return searchQuery.value
  }
  return props.modelValue || searchQuery.value || ''
})

const filteredResults = computed(() => {
  const q = norm(searchQuery.value)
  if (!q) {
    return suggestedDistricts.value
  }

  return peruLocations
    .map(item => {
      const nd = norm(item.d)
      const np = norm(item.p)
      const ndep = norm(item.dep)
      const nalias = norm(item.alias || '')
      let score = 0

      if (nd === q) {
        score = 1000
      } else if (nd.startsWith(q)) {
        score = 800
      } else if (nd.split(/\s+/).some(w => w.startsWith(q))) {
        score = 650
      } else if (nalias && nalias.split(/\s+/).some(w => w.startsWith(q))) {
        score = 640
      } else if (nd.includes(q)) {
        score = 450
      } else if (np.startsWith(q) || ndep.startsWith(q)) {
        score = 300
      } else if (np.includes(q) || ndep.includes(q)) {
        score = 150
      } else {
        return null
      }

      // Priority boost for Lima Metropolitana & Callao
      if (item.isLimaCallao) score += 60

      return { item, score }
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.item.d.localeCompare(b.item.d))
    .map(x => x.item)
})

const visibleResults = computed(() => {
  return filteredResults.value.slice(0, 35)
})

function handleInput(e) {
  searchQuery.value = e.target.value
  isOpen.value = true
  highlightedIndex.value = 0
}

function handleFocus() {
  isOpen.value = true
  searchQuery.value = props.modelValue || ''
  highlightedIndex.value = 0
  setTimeout(() => {
    inputRef.value?.select()
  }, 50)
}

function handleBlur() {
  setTimeout(() => {
    if (!rootRef.value?.contains(document.activeElement)) {
      isOpen.value = false

      const q = searchQuery.value.trim()
      if (!q) {
        emit('update:modelValue', '')
        return
      }

      // Find exact match by label or district name
      const exact = peruLocations.find(x => 
        norm(x.label) === norm(q) || 
        norm(x.d) === norm(q)
      )
      if (exact) {
        selectItem(exact)
      } else if (props.modelValue) {
        searchQuery.value = props.modelValue
      } else {
        const top = filteredResults.value[0]
        if (top && (norm(top.d).startsWith(norm(q)) || norm(top.label).startsWith(norm(q)))) {
          selectItem(top)
        } else {
          // If no valid Peru district match, clear to enforce Peruvian districts only
          searchQuery.value = ''
          emit('update:modelValue', '')
        }
      }
      emit('blur')
    }
  }, 180)
}

function toggleDropdown() {
  if (isOpen.value) {
    isOpen.value = false
  } else {
    inputRef.value?.focus()
  }
}

function handleClear() {
  searchQuery.value = ''
  emit('update:modelValue', '')
  isOpen.value = true
  highlightedIndex.value = 0
  inputRef.value?.focus()
}

function selectItem(item) {
  searchQuery.value = item.label
  emit('update:modelValue', item.label)
  emit('select', item)
  isOpen.value = false
}

function scrollHighlightedIntoView() {
  nextTick(() => {
    if (!listRef.value) return
    const items = listRef.value.querySelectorAll('li[role="option"]')
    const el = items[highlightedIndex.value]
    if (el) {
      el.scrollIntoView({ block: 'nearest' })
    }
  })
}

function handleKeydown(e) {
  if (!isOpen.value) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') {
      isOpen.value = true
      e.preventDefault()
      return
    }
  }

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (visibleResults.value.length === 0) return
    highlightedIndex.value = (highlightedIndex.value + 1) % visibleResults.value.length
    scrollHighlightedIntoView()
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (visibleResults.value.length === 0) return
    highlightedIndex.value = (highlightedIndex.value - 1 + visibleResults.value.length) % visibleResults.value.length
    scrollHighlightedIntoView()
  } else if (e.key === 'Enter') {
    e.preventDefault()
    const item = visibleResults.value[highlightedIndex.value]
    if (item) {
      selectItem(item)
    }
  } else if (e.key === 'Escape') {
    isOpen.value = false
  }
}

function handleClickOutside(e) {
  if (rootRef.value && !rootRef.value.contains(e.target)) {
    isOpen.value = false
  }
}

watch(
  () => props.modelValue,
  (val) => {
    if (!isOpen.value) {
      searchQuery.value = val || ''
    }
  },
  { immediate: true }
)

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
