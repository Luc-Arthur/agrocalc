<script setup lang="ts">
import { computed, useId } from 'vue'
import { formaterCourt } from '../../calculs/format'
import { nomsNutriments, nutriments, type Npk } from '../../calculs/fumure'

// Pour chaque nutriment : ce que la formule apporte, ce qu'il reste à compléter, et l'éventuel surplus
const props = defineProps<{ besoins: Npk; apports: Npk }>()

const X0 = 52
const LARGEUR = 288
const HAUTEUR_BARRE = 18
const PAS = 38
const hachures = useId()

const echelle = computed(() => Math.max(1, ...nutriments.map((x) => Math.max(props.besoins[x], props.apports[x]))))
const w = (kg: number) => (kg / echelle.value) * LARGEUR

const lignes = computed(() =>
  nutriments.map((x, i) => {
    const besoin = props.besoins[x]
    const apport = props.apports[x]
    const couvert = Math.min(besoin, apport)
    return {
      x,
      nom: nomsNutriments[x],
      y: 10 + i * PAS,
      besoin,
      couvert: w(couvert),
      manque: w(Math.max(0, besoin - apport)),
      exces: w(Math.max(0, apport - besoin)),
      repere: w(besoin),
    }
  }),
)
const surplus = computed(() => lignes.value.some((l) => l.exces > 0.5))

const description = computed(() =>
  nutriments
    .map((x) => `${nomsNutriments[x]} : besoin ${formaterCourt(props.besoins[x], 0)} kg/ha, apporté par la formule ${formaterCourt(props.apports[x], 0)} kg/ha`)
    .join(' ; '),
)
</script>

<template>
  <figure>
    <figcaption class="kicker">Bilan par nutriment</figcaption>

    <svg class="mt-3 block w-full" :viewBox="`0 0 400 ${12 + PAS * 3}`" role="img" :aria-label="description">
      <defs>
        <pattern :id="hachures" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="var(--ink)" stroke-width="2.5" />
        </pattern>
      </defs>

      <g v-for="l in lignes" :key="l.x">
        <text :x="0" :y="l.y + 13" class="mono" font-size="12" font-weight="600" fill="var(--ink)">{{ l.nom }}</text>
        <!-- Rail -->
        <line :x1="X0" :x2="X0 + LARGEUR" :y1="l.y + HAUTEUR_BARRE / 2" :y2="l.y + HAUTEUR_BARRE / 2" stroke="var(--grid)" stroke-width="2" />
        <!-- Apporté par la formule, puis à compléter, puis surplus -->
        <rect v-if="l.couvert > 0" :x="X0" :y="l.y" :width="l.couvert" :height="HAUTEUR_BARRE" fill="var(--ink)" />
        <rect v-if="l.manque > 0" :x="X0 + l.couvert" :y="l.y" :width="l.manque" :height="HAUTEUR_BARRE" :fill="`url(#${hachures})`" stroke="var(--ink)" stroke-width="1.5" />
        <rect
          v-if="l.exces > 0.5"
          :x="X0 + l.repere"
          :y="l.y + 3"
          :width="l.exces"
          :height="HAUTEUR_BARRE - 6"
          fill="none"
          stroke="var(--ink)"
          stroke-width="1.5"
          stroke-dasharray="3 3"
        />
        <!-- Repère du besoin -->
        <line v-if="l.besoin > 0" :x1="X0 + l.repere" :x2="X0 + l.repere" :y1="l.y - 5" :y2="l.y + HAUTEUR_BARRE + 5" stroke="var(--ink)" stroke-width="2.5" />
        <text :x="400" :y="l.y + 13" text-anchor="end" class="mono" font-size="11" fill="var(--ink-2)">{{ formaterCourt(l.besoin, 0) }} kg</text>
      </g>
    </svg>

    <ul class="mt-2 grid gap-1 text-sm leading-5 text-ink-2">
      <li class="flex items-center gap-2">
        <svg class="size-3.5 flex-none" viewBox="0 0 14 14" aria-hidden="true"><rect width="14" height="14" fill="var(--ink)" /></svg>
        Apporté par la formule
      </li>
      <li class="flex items-center gap-2">
        <svg class="size-3.5 flex-none" viewBox="0 0 14 14" aria-hidden="true">
          <rect width="14" height="14" :fill="`url(#${hachures})`" /><rect x="1" y="1" width="12" height="12" fill="none" stroke="var(--ink)" stroke-width="2" />
        </svg>
        À compléter avec un engrais simple
      </li>
      <li v-if="surplus" class="flex items-center gap-2">
        <svg class="size-3.5 flex-none" viewBox="0 0 14 14" aria-hidden="true"><rect x="1" y="3" width="12" height="8" fill="none" stroke="var(--ink)" stroke-width="1.5" stroke-dasharray="3 2" /></svg>
        Apporté au-delà du besoin
      </li>
      <li class="flex items-center gap-2">
        <svg class="size-3.5 flex-none" viewBox="0 0 14 14" aria-hidden="true"><line x1="7" y1="0" x2="7" y2="14" stroke="var(--ink)" stroke-width="2.5" /></svg>
        Besoin de la culture (valeur à droite, en kg/ha)
      </li>
    </ul>
  </figure>
</template>
