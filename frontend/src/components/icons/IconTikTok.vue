<template>
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    :class="customClass"
    aria-hidden="true"
  >
    <path
      d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.33a6.33 6.33 0 0 0-.86-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 10.78 4.54 6.27 6.27 0 0 0 1.9-4.52V8.9a8.28 8.28 0 0 0 3.77.92V6.69z"
    />
  </svg>
</template>

<script setup>
defineProps({
  customClass: {
    type: String,
    default: 'w-4 h-4'
  }
})
</script>
