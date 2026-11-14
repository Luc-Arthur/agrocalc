<script setup lang="ts">
defineProps<{ index: string; titre: string; sousTitre: string }>()
</script>

<template>
  <div class="grid gap-5 lg:gap-2">
    <RouterLink to="/" class="inline-flex min-h-12 items-center gap-1.5 font-bold text-pencil lg:hidden">
      <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12H5M11 6l-6 6 6 6" /></svg>
      Calculateurs
    </RouterLink>
    <div>
      <div class="flex items-center gap-3">
        <span class="idx">{{ index }}</span>
        <h1 class="text-4xl font-bold leading-10 tracking-tight lg:text-5xl lg:leading-[52px]">{{ titre }}</h1>
      </div>
      <p class="mt-1 text-ink-2">{{ sousTitre }}</p>
    </div>
  </div>
</template>
