<template>
  <svg
    viewBox="0 0 54 24"
    :class="customClass"
    aria-hidden="true"
  >
    <!-- Background rounded card -->
    <rect width="54" height="24" rx="6" fill="#004481" />
    
    <!-- BBVA Text in crisp white -->
    <!-- B -->
    <path
      d="M8.5 7h4.8c1.6 0 2.7.8 2.7 2.1 0 .9-.5 1.5-1.3 1.8 1.1.3 1.6 1.1 1.6 2.1 0 1.5-1.3 2.5-3 2.5H8.5V7zm2.4 3.3h2.1c.5 0 .9-.3.9-.7s-.4-.7-.9-.7h-2.1v1.4zm0 3.3h2.3c.6 0 1-.3 1-.7s-.4-.7-1-.7h-2.3v1.4z"
      fill="#FFFFFF"
    />
    <!-- B -->
    <path
      d="M18.5 7h4.8c1.6 0 2.7.8 2.7 2.1 0 .9-.5 1.5-1.3 1.8 1.1.3 1.6 1.1 1.6 2.1 0 1.5-1.3 2.5-3 2.5h-4.8V7zm2.4 3.3h2.1c.5 0 .9-.3.9-.7s-.4-.7-.9-.7h-2.1v1.4zm0 3.3h2.3c.6 0 1-.3 1-.7s-.4-.7-1-.7h-2.3v1.4z"
      fill="#FFFFFF"
    />
    <!-- V -->
    <path
      d="M27.5 7h2.5l2.8 8.5h-2.3l-1.7-5.5-1.7 5.5h-2.4L27.5 7z"
      fill="#FFFFFF"
    />
    <!-- A -->
    <path
      d="M37.5 7h2.4l3.6 8.5h-2.5l-.8-2h-3.2l-.8 2h-2.3L37.5 7zm1.1 2.2l-1.1 2.7h2.2l-1.1-2.7z"
      fill="#FFFFFF"
    />
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
