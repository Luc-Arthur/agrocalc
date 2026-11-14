<script setup lang="ts">
import { computed } from 'vue'
import { calculateurs } from '../calculateurs'

const props = defineProps<{ slug: string }>()
const calculateur = computed(() => calculateurs.find((c) => c.slug === props.slug))
</script>

<template>
  <div class="mx-auto grid max-w-[1440px] gap-5 px-4 pb-8 pt-4 lg:grid-cols-[248px_minmax(0,1fr)] lg:items-start lg:gap-10 lg:px-12 lg:pt-8 lg:pb-12">
    <!-- Liste des calculateurs (desktop) -->
    <ul class="panel hidden lg:block">
      <li v-for="c in calculateurs" :key="c.slug" class="[&+li]:border-t-2 [&+li]:border-ink">
        <RouterLink :to="`/${c.slug}`" class="flex items-center gap-3 p-3.5 font-bold hover:bg-paper-2" active-class="!bg-ink !text-paper">
          <span class="idx !size-9 !text-[13px]">{{ c.index }}</span>{{ c.titre }}
        </RouterLink>
      </li>
    </ul>

    <div class="grid gap-5 lg:gap-7">
      <RouterLink to="/" class="inline-flex min-h-12 items-center gap-1.5 font-bold text-pencil lg:hidden">
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12H5M11 6l-6 6 6 6" /></svg>
        Calculateurs
      </RouterLink>

      <div>
        <div class="flex items-center gap-3">
          <span class="idx">{{ calculateur?.index }}</span>
          <h1 class="text-4xl font-bold leading-10 tracking-tight lg:text-5xl lg:leading-[52px]">{{ calculateur?.titre }}</h1>
        </div>
        <p class="mt-1 text-ink-2">{{ calculateur?.description }}</p>
      </div>

      <section class="panel p-6">
        <p class="kicker">En construction</p>
        <p class="mt-3 text-[22px] font-bold leading-7">Ce calculateur arrive très bientôt.</p>
        <p class="formula-line mt-4">{{ calculateur?.formule }}</p>
      </section>

      <p class="note">
        <svg class="icon !size-5 text-ink" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7v.5" /></svg>
        <span>Résultats indicatifs : ils ne remplacent pas une analyse de sol ni l'avis d'un technicien.</span>
      </p>
    </div>
  </div>
</template>
