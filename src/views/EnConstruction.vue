<script setup lang="ts">
import { computed } from 'vue'
import { calculateurs } from '../calculateurs'
import Avertissement from '../components/calc/Avertissement.vue'
import EnTete from '../components/calc/EnTete.vue'
import ListeCalculateurs from '../components/calc/ListeCalculateurs.vue'

const props = defineProps<{ slug: string }>()
const calculateur = computed(() => calculateurs.find((c) => c.slug === props.slug))
</script>

<template>
  <div class="mx-auto grid max-w-[1440px] gap-5 px-4 pb-8 pt-4 lg:grid-cols-[248px_minmax(0,1fr)] lg:items-start lg:gap-10 lg:px-12 lg:pt-8 lg:pb-12">
    <ListeCalculateurs />

    <div class="grid gap-5 lg:gap-7">
      <EnTete :index="calculateur?.index ?? ''" :titre="calculateur?.titre ?? ''" :sous-titre="calculateur?.description ?? ''" />

      <section class="panel p-6">
        <p class="kicker">En construction</p>
        <p class="mt-3 text-[22px] font-bold leading-7">Ce calculateur arrive très bientôt.</p>
        <p class="formula-line mt-4">{{ calculateur?.formule }}</p>
      </section>

      <Avertissement />
    </div>
  </div>
</template>
