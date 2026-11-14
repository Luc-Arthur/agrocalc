<script setup lang="ts">
import Logo from './components/Logo.vue'
import ThemeToggle from './components/ThemeToggle.vue'
</script>

<template>
  <div class="page-grid flex min-h-dvh flex-col">
    <header class="sticky top-0 z-10 border-b-2 border-ink bg-paper">
      <div class="mx-auto flex h-16 max-w-[1440px] items-center gap-3 px-4 lg:h-[72px] lg:px-12">
        <Logo />
        <nav aria-label="Navigation principale" class="mr-7 hidden gap-7 text-base font-bold sm:flex">
          <RouterLink to="/" class="border-b-2 border-transparent py-1.5" exact-active-class="!border-ink">Calculateurs</RouterLink>
          <a href="https://github.com/Luc-Arthur/agrocalc" class="border-b-2 border-transparent py-1.5 hover:border-ink">GitHub</a>
        </nav>
        <ThemeToggle />
      </div>
    </header>

    <main class="flex-1">
      <RouterView />
    </main>

    <footer class="border-t-2 border-ink bg-paper">
      <div class="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-4 py-5 text-sm text-ink-2 lg:px-12">
        <p>
          Projet étudiant · Agronomie UFSM · par
          <a href="https://www.linkedin.com/in/luc-arthur-lawale-00a489334" class="font-bold text-pencil underline decoration-2 underline-offset-[3px]">Luc-Arthur Lawale</a>
        </p>
        <a href="https://github.com/Luc-Arthur/agrocalc" class="mono text-[13px] hover:text-ink">github.com/Luc-Arthur/agrocalc</a>
      </div>
    </footer>
  </div>
</template>
