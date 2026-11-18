<script setup lang="ts">
import { ref } from 'vue'

// Copie le résumé du calcul ; repli sur une fenêtre de saisie si le presse-papiers est refusé
const props = defineProps<{ texte: string }>()

const copie = ref(false)
async function copier() {
  if (!props.texte) return
  try {
    await navigator.clipboard.writeText(props.texte)
    copie.value = true
    setTimeout(() => (copie.value = false), 1500)
  } catch {
    window.prompt('Copiez le résultat :', props.texte)
  }
}
</script>

<template>
  <button
    type="button"
    class="inline-flex h-14 w-full items-center justify-center gap-2 rounded border-2 px-3 font-bold disabled:opacity-50"
    :class="copie ? 'border-on-marker bg-marker text-on-marker' : 'border-ink bg-ink text-paper'"
    :disabled="!texte"
    @click="copier"
  >
    <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" /><path d="M15 9V4H4v11h5" /></svg>
    {{ copie ? 'Copié' : 'Copier le résultat' }}
  </button>
</template>
