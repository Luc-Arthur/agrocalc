<script setup lang="ts">
import { computed } from 'vue'
import { calculateurs } from '../calculateurs'

const props = defineProps<{ slug: string }>()
const calculateur = computed(() => calculateurs.find((c) => c.slug === props.slug))
</script>

<template>
  <section class="mx-auto max-w-3xl px-4 py-16 sm:px-6">
    <p class="font-mono text-xs uppercase tracking-[0.18em] text-muted">Calculateur · {{ calculateur?.unite }}</p>
    <h1 class="mt-3 font-display text-5xl font-black tracking-tight [font-stretch:110%]">{{ calculateur?.titre }}</h1>
    <p class="mt-4 text-lg text-muted">{{ calculateur?.description }}</p>
    <div class="grid-paper mt-10 rounded-xl border border-dashed border-field/40 p-8 text-center">
      <p class="font-medium">Ce calculateur arrive très bientôt.</p>
      <p class="mt-1 text-sm text-muted">Suivez l'avancement sur GitHub.</p>
    </div>
  </section>
</template>
