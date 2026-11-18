<script setup lang="ts">
import { computed, useId } from 'vue'
import { formater, formaterCourt } from '../../calculs/format'

// La récolte d'un hectare, sac par sac ; le dernier sac est rempli à proportion
const props = defineProps<{ sacs: number; poidsSac: number }>()

const COLONNES = 20
const CASE_L = 20
const CASE_H = 25
const MAX_ICONES = 100
const coupe = useId()

// Au-delà de 100 sacs, une icône vaut 10 sacs (puis 100…)
const parIcone = computed(() => {
  let n = 1
  while (props.sacs / n > MAX_ICONES) n *= 10
  return n
})
const icones = computed(() => props.sacs / parIcone.value)
const pleines = computed(() => Math.floor(icones.value + 1e-9))
const reste = computed(() => (icones.value - pleines.value > 0.02 ? icones.value - pleines.value : 0))

const cases = computed(() => {
  const n = pleines.value + (reste.value ? 1 : 0)
  return Array.from({ length: n }, (_, i) => ({
    x: (i % COLONNES) * CASE_L + 2,
    y: Math.floor(i / COLONNES) * CASE_H + 2,
    partiel: i === pleines.value,
  }))
})
const hauteur = computed(() => Math.max(1, Math.ceil(cases.value.length / COLONNES)) * CASE_H)

// Un sac noué : deux oreilles en haut, le lien, puis le corps arrondi (case de 16 × 20)
const SAC = 'M3 0l3.2 2.6h3.6L13 0l-1.2 4.4C14.6 6 16 9.2 16 13.6 16 17.8 12.8 20 8 20s-8-2.2-8-6.4C0 9.2 1.4 6 4.2 4.4z'
</script>

<template>
  <figure>
    <figcaption class="kicker">Un hectare, en sacs de {{ formaterCourt(poidsSac) }} kg</figcaption>

    <svg
      class="mt-3 block w-full"
      :viewBox="`0 0 ${COLONNES * CASE_L} ${hauteur}`"
      role="img"
      :aria-label="`${formaterCourt(sacs, 1)} sacs de ${formaterCourt(poidsSac)} kg par hectare`"
    >
      <g v-for="(c, i) in cases" :key="i" :transform="`translate(${c.x} ${c.y})`">
        <template v-if="!c.partiel">
          <path :d="SAC" fill="var(--ink)" />
          <path d="M4.4 4.6h7.2" stroke="var(--paper)" stroke-width="1.4" />
        </template>
        <template v-else>
          <clipPath :id="coupe"><rect x="0" :y="20 * (1 - reste)" width="16" :height="20 * reste" /></clipPath>
          <path :d="SAC" fill="var(--ink)" :clip-path="`url(#${coupe})`" />
          <path :d="SAC" fill="none" stroke="var(--ink)" stroke-width="1.2" />
        </template>
      </g>
    </svg>

    <p class="mt-2 text-sm leading-5 text-ink-2">
      <template v-if="parIcone === 1">Un sac dessiné = un sac récolté.</template>
      <template v-else>Un sac dessiné = {{ formater(parIcone) }} sacs récoltés.</template>
      <template v-if="reste"> Le dernier n'est rempli qu'en partie.</template>
    </p>
  </figure>
</template>
