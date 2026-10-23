import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSearchStore = defineStore('search', () => {
  const searchQuery = ref('')
  const isDropdownOpen = ref(false)

  function setQuery(q) {
    searchQuery.value = q
    if (q.trim().length > 0) {
      isDropdownOpen.value = true
    } else {
      isDropdownOpen.value = false
    }
  }

  function clearQuery() {
    searchQuery.value = ''
    isDropdownOpen.value = false
  }

  function closeDropdown() {
    isDropdownOpen.value = false
  }

  return {
    searchQuery,
    isDropdownOpen,
    setQuery,
    clearQuery,
    closeDropdown
  }
})
