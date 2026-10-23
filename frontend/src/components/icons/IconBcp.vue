<template>
  <svg
    viewBox="0 0 54 24"
    :class="customClass"
    aria-hidden="true"
  >
    <!-- Background rounded card -->
    <rect width="54" height="24" rx="6" fill="#002A8F" />
    
    <!-- BCP letters in White -->
    <!-- B -->
    <path
      d="M10 7h4.8c1.6 0 2.8.8 2.8 2.2 0 .9-.5 1.6-1.3 1.9 1 .3 1.6 1.1 1.6 2.1 0 1.5-1.3 2.3-3 2.3H10V7zm2.4 3.4h2.1c.6 0 1-.3 1-.8s-.4-.8-1-.8h-2.1v1.6zm0 3.3h2.3c.7 0 1.1-.3 1.1-.8 0-.6-.4-.9-1.1-.9h-2.3v1.7z"
      fill="#FFFFFF"
    />
    <!-- C -->
    <path
      d="M26.2 9.5c-.5-.7-1.3-1-2.3-1-1.8 0-3.1 1.4-3.1 3.5s1.3 3.5 3.1 3.5c1 0 1.8-.4 2.3-1.1l1.6 1.2c-.9 1.2-2.3 1.8-3.9 1.8-3.1 0-5.4-2.2-5.4-5.4s2.3-5.4 5.4-5.4c1.6 0 3 .6 3.9 1.8l-1.6 1.1z"
      fill="#FFFFFF"
    />
    <!-- P -->
    <path
      d="M30 7h4.8c2 0 3.4 1.2 3.4 3.3s-1.4 3.3-3.4 3.3h-2.4v1.9H30V7zm2.4 4.8h2.2c.8 0 1.3-.5 1.3-1.5s-.5-1.5-1.3-1.5h-2.2v3z"
      fill="#FFFFFF"
    />
    <!-- Signature Orange BCP Slash -->
    <polygon points="43,6 40.5,18 43.5,18 46,6" fill="#FF671B" />
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
