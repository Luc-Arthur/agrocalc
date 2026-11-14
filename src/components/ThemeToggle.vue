<script setup lang="ts">
import { onMounted, ref } from 'vue'

const sombre = ref(false)

onMounted(() => {
  const choisi = document.documentElement.dataset.theme
  sombre.value = choisi ? choisi === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
})

function basculer() {
  sombre.value = !sombre.value
  const theme = sombre.value ? 'dark' : 'light'
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem('agrocalc-theme', theme)
  } catch {
    // Stockage indisponible (navigation privée) : le choix vaut pour cette visite
  }
}
</script>

<template>
  <button type="button" class="icon-btn" :aria-label="sombre ? 'Passer en mode clair' : 'Passer en mode sombre'" @click="basculer">
    <svg v-if="sombre" class="icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" />
    </svg>
    <svg v-else class="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z" />
    </svg>
  </button>
</template>
