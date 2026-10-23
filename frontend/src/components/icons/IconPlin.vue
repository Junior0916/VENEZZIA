<template>
  <svg
    viewBox="0 0 54 24"
    :class="customClass"
    aria-hidden="true"
  >
    <!-- Background rounded pill -->
    <rect width="54" height="24" rx="12" fill="#00D7C3" />
    
    <!-- "plin" text -->
    <!-- p -->
    <path
      d="M12.5 7.5h2v1c.4-.7 1.2-1.1 2.1-1.1 1.7 0 2.8 1.4 2.8 3.3s-1.1 3.3-2.8 3.3c-.9 0-1.7-.4-2.1-1.1v3.2h-2V7.5zm3.3 5.2c.9 0 1.6-.7 1.6-1.9s-.7-1.9-1.6-1.9-1.6.7-1.6 1.9.7 1.9 1.6 1.9z"
      fill="#0B2742"
    />
    <!-- l -->
    <path
      d="M21.5 6.5h2v7.5h-2V6.5z"
      fill="#0B2742"
    />
    <!-- i -->
    <path
      d="M25.5 8.8h2v5.2h-2V8.8z"
      fill="#0B2742"
    />
    <!-- Magenta dot on 'i' -->
    <circle cx="26.5" cy="6.8" r="1.2" fill="#E6007E" />
    <!-- n -->
    <path
      d="M29.5 8.8h2v.9c.4-.7 1.2-1 2.1-1 1.6 0 2.6 1 2.6 2.6v2.7h-2v-2.5c0-.8-.4-1.3-1.2-1.3-.8 0-1.5.5-1.5 1.4v2.4h-2V8.8z"
      fill="#0B2742"
    />
    <!-- Accent icon dot -->
    <circle cx="43.5" cy="12" r="3.2" fill="#E6007E" />
  </svg>
</template>

<script setup>
defineProps({
  customClass: {
    type: String,
    default: 'w-13 h-6'
  }
})
</script>
