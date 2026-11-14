<script setup lang="ts">
import { calculateurs } from '../calculateurs'
</script>

<template>
  <section class="grid-paper border-b border-line">
    <div class="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <p class="font-mono text-xs uppercase tracking-[0.18em] text-muted">
        Santa Maria (RS) · 29°43′ S · 53°43′ O
      </p>
      <h1 class="mt-4 max-w-3xl font-display text-5xl font-black leading-[0.95] tracking-tight [font-stretch:110%] sm:text-7xl">
        Les calculs du terrain,
        <span class="text-field">sans tableur.</span>
      </h1>
      <p class="mt-6 max-w-xl text-lg text-muted">
        Semis, chaulage, fumure et conversions d'unités : entrez vos valeurs, le résultat s'affiche
        tout de suite, avec la formule utilisée.
      </p>
    </div>
  </section>

  <section class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
    <h2 class="sr-only">Calculateurs</h2>
    <ul class="grid gap-4 sm:grid-cols-2">
      <li v-for="c in calculateurs" :key="c.slug">
        <RouterLink
          :to="`/${c.slug}`"
          class="group flex h-full flex-col rounded-xl border border-line bg-white p-6 transition hover:border-field focus-visible:outline-2 focus-visible:outline-field"
        >
          <div class="flex items-start justify-between gap-4">
            <h3 class="font-display text-2xl font-extrabold tracking-tight [font-stretch:105%]">{{ c.titre }}</h3>
            <span class="shrink-0 rounded bg-ground px-2 py-1 font-mono text-xs text-field">{{ c.unite }}</span>
          </div>
          <p class="mt-3 text-muted">{{ c.description }}</p>
          <p class="mt-auto pt-6 text-sm font-medium">
            <span v-if="c.disponible" class="text-field group-hover:underline">Ouvrir le calculateur →</span>
            <span v-else class="inline-flex items-center gap-2 text-muted">
              <span class="size-2 rounded-full bg-wheat" aria-hidden="true"></span>
              En construction
            </span>
          </p>
        </RouterLink>
      </li>
    </ul>
  </section>
</template>
