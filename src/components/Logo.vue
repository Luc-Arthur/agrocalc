<template>
  <RouterLink to="/" class="mr-auto flex items-center gap-2.5 text-xl font-bold tracking-tight" aria-label="AgroCalc, accueil">
    <!-- Une cellule de quadrillage, dont un carreau est surligné -->
    <svg viewBox="0 0 26 26" class="size-[26px] flex-none" aria-hidden="true">
      <rect x="13" y="13" width="12" height="12" fill="var(--marker)" />
      <rect x="1" y="1" width="24" height="24" fill="none" stroke="var(--ink)" stroke-width="2" />
      <path d="M13 1v24M1 13h24" fill="none" stroke="var(--ink)" stroke-width="2" />
    </svg>
    <span>AgroCalc</span>
  </RouterLink>
</template>
