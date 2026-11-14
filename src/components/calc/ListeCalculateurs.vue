<script setup lang="ts">
import { calculateurs } from '../../calculateurs'
</script>

<template>
  <!-- Liste des calculateurs, à gauche sur ordinateur -->
  <ul class="panel hidden lg:block">
    <li v-for="c in calculateurs" :key="c.slug" class="[&+li]:border-t-2 [&+li]:border-ink">
      <RouterLink :to="`/${c.slug}`" class="flex items-center gap-3 p-3.5 font-bold hover:bg-paper-2" active-class="!bg-ink !text-paper">
        <span class="idx !size-9 !text-[13px]">{{ c.index }}</span>{{ c.titre }}
      </RouterLink>
    </li>
  </ul>
</template>
