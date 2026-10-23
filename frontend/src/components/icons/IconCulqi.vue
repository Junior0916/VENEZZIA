<template>
  <svg
    viewBox="0 0 68 24"
    :class="customClass"
    aria-hidden="true"
  >
    <!-- Background rounded card -->
    <rect width="68" height="24" rx="6" fill="#0D1B2A" />
    
    <!-- Culqi Icon Badge -->
    <circle cx="13" cy="12" r="6" fill="#00D2C4" />
    <path
      d="M13 7.5a4.5 4.5 0 0 0-4.5 4.5h2.2a2.3 2.3 0 0 1 2.3-2.3V7.5z"
      fill="#FFFFFF"
    />
    
    <!-- "culqi" Lettermark -->
    <text
      x="23"
      y="15.5"
      font-family="sans-serif"
      font-size="10.5"
      font-weight="bold"
      letter-spacing="-0.3"
      fill="#00D2C4"
    >culqi</text>
  </svg>
</template>

<script setup>
defineProps({
  customClass: {
    type: String,
    default: 'w-16 h-6'
  }
})
</script>
