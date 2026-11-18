<script setup lang="ts">
import { calculateurs } from '../calculateurs'

const etapes = [
  { titre: 'Entrez vos valeurs', texte: 'Les unités sont déjà dans les champs.' },
  { titre: 'Lisez le résultat', texte: 'Il se met à jour à chaque saisie.' },
  { titre: 'Vérifiez la formule', texte: 'Chaque calcul est détaillé, chiffres compris.' },
]
</script>

<template>
  <div class="mx-auto grid max-w-[1440px] gap-5 px-4 pb-8 pt-4 lg:grid-cols-[5fr_7fr] lg:items-start lg:gap-12 lg:px-12 lg:pt-[72px] lg:pb-12">
    <!-- Accroche -->
    <section class="pt-4 lg:pt-0">
      <p class="kicker">Calculateurs agronomiques · FR / PT</p>
      <h1 class="mt-2.5 text-4xl font-bold leading-10 tracking-tight lg:mt-[18px] lg:text-[64px] lg:leading-[64px] lg:tracking-[-0.02em]">
        Le calcul de terrain, <span class="highlight">sans tableur.</span>
      </h1>
      <p class="mt-3 text-lg leading-[27px] text-ink-2 lg:mt-6 lg:max-w-[30ch] lg:text-xl lg:leading-[30px]">
        Entrez vos valeurs : le résultat s'affiche aussitôt, avec la formule utilisée et une explication courte.
      </p>
    </section>

    <!-- Mobile : liste façon carnet -->
    <ul class="panel lg:hidden">
      <li v-for="c in calculateurs" :key="c.slug" class="[&+li]:border-t-2 [&+li]:border-ink">
        <RouterLink :to="`/${c.slug}`" class="grid min-h-[92px] grid-cols-[44px_1fr_auto] items-center gap-3.5 px-4 py-3.5 hover:bg-paper-2">
          <span class="idx">{{ c.index }}</span>
          <span>
            <span class="block text-[22px] font-bold leading-7">{{ c.titre }}</span>
            <span class="mt-0.5 block text-[15px] leading-5 text-ink-2">{{ c.description }}</span>
          </span>
          <span class="flex flex-col items-end gap-2">
            <span class="unit-chip">{{ c.unite }}</span>
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" /></svg>
          </span>
        </RouterLink>
      </li>
    </ul>

    <!-- Desktop : une carte par calculateur, avec sa formule ; la dernière s'étale si leur nombre est impair -->
    <div class="hidden grid-cols-2 gap-0.5 border-2 border-ink bg-ink lg:grid">
      <RouterLink v-for="c in calculateurs" :key="c.slug" :to="`/${c.slug}`" class="flex min-h-[236px] flex-col gap-2.5 bg-paper p-6 odd:last:col-span-2 hover:bg-paper-2">
        <span class="flex items-center justify-between">
          <span class="idx">{{ c.index }}</span>
          <span class="unit-chip">{{ c.unite }}</span>
        </span>
        <span class="mt-2 text-[28px] font-bold leading-8">{{ c.titre }}</span>
        <span class="text-base text-ink-2">{{ c.description }}</span>
        <span class="formula-line mt-auto">{{ c.formule }}</span>
      </RouterLink>
    </div>

    <!-- Comment ça marche (desktop) -->
    <div class="col-span-full hidden grid-cols-3 gap-6 border-t-2 border-ink pt-6 lg:grid">
      <div v-for="(e, i) in etapes" :key="e.titre">
        <span class="kicker">{{ i + 1 }}</span>
        <b class="mt-1.5 block text-lg">{{ e.titre }}</b>
        <p class="mt-1 text-base text-ink-2">{{ e.texte }}</p>
      </div>
    </div>
  </div>
</template>
