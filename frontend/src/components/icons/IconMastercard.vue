<template>
  <svg
    viewBox="0 0 38 24"
    :class="customClass"
    aria-hidden="true"
  >
    <!-- Left Red Circle -->
    <circle cx="12" cy="12" r="10" fill="#EB001B" />
    <!-- Right Yellow Circle -->
    <circle cx="26" cy="12" r="10" fill="#F79E1B" />
    <!-- Overlapping Intersection -->
    <path
      d="M19 4.887a9.96 9.96 0 0 0-3 7.113c0 2.76 1.12 5.26 2.94 7.08A9.96 9.96 0 0 0 22 12c0-2.76-1.12-5.26-3-7.113z"
      fill="#FF5F00"
    />
  </svg>
</template>

<script setup>
defineProps({
  customClass: {
    type: String,
    default: 'w-8 h-5'
  }
})
</script>
