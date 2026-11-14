<script setup lang="ts">
import Logo from './components/Logo.vue'
import { calculateurs } from './calculateurs'
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <header class="border-b border-line bg-ground/90 backdrop-blur sticky top-0 z-10">
      <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-3 px-4 py-3 sm:px-6">
        <Logo />
        <nav aria-label="Calculateurs" class="-mx-1 flex gap-1 overflow-x-auto">
          <RouterLink
            v-for="c in calculateurs"
            :key="c.slug"
            :to="`/${c.slug}`"
            class="whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-muted transition hover:bg-white hover:text-soil focus-visible:outline-2 focus-visible:outline-field"
            active-class="!bg-field !text-white"
          >
            {{ c.titre }}
          </RouterLink>
        </nav>
      </div>
    </header>

    <main class="flex-1">
      <RouterView />
    </main>

    <footer class="border-t border-line">
      <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm text-muted sm:px-6">
        <p>
          Conçu par <a href="https://www.linkedin.com/in/luc-arthur-lawale-00a489334" class="font-medium text-soil underline decoration-wheat decoration-2 underline-offset-4">Luc-Arthur Lawale</a>,
          étudiant en agronomie à l'UFSM.
        </p>
        <a href="https://github.com/Luc-Arthur/agrocalc" class="font-mono text-xs hover:text-soil">github.com/Luc-Arthur/agrocalc</a>
      </div>
    </footer>
  </div>
</template>
