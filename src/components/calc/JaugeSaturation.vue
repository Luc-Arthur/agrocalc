<script setup lang="ts">
import { computed, useId } from 'vue'
import { formaterCourt } from '../../calculs/format'

// La CTC du sol vue comme une barre : ce que les bases occupent déjà, et ce que le calcaire doit ajouter
const props = defineProps<{ v1: number; v2: number }>()

const GAUCHE = 10
const LARGEUR = 380
const HAUT = 22
const HAUTEUR = 26
const hachures = useId()

const x = (pourcent: number) => GAUCHE + (Math.min(100, Math.max(0, pourcent)) / 100) * LARGEUR
const x1 = computed(() => x(props.v1))
const x2 = computed(() => x(props.v2))
const gain = computed(() => Math.max(0, props.v2 - props.v1))

const graduations = [0, 25, 50, 75, 100]

const description = computed(() =>
  gain.value > 0
    ? `Les bases occupent ${formaterCourt(props.v1, 1)} % de la CTC ; le calcaire doit en ajouter ${formaterCourt(gain.value, 1)} points pour atteindre ${formaterCourt(props.v2, 1)} %.`
    : `Les bases occupent déjà ${formaterCourt(props.v1, 1)} % de la CTC, au-dessus de la cible.`,
)
</script>

<template>
  <figure>
    <figcaption class="kicker">La CTC de votre sol</figcaption>

    <svg class="mt-3 block w-full" viewBox="0 0 400 72" role="img" :aria-label="description">
      <defs>
        <pattern :id="hachures" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="var(--ink)" stroke-width="2.5" />
        </pattern>
      </defs>

      <!-- Bases déjà présentes, puis part à gagner avec le calcaire -->
      <rect :x="GAUCHE" :y="HAUT" :width="x1 - GAUCHE" :height="HAUTEUR" fill="var(--ink)" />
      <rect v-if="gain > 0" :x="x1" :y="HAUT" :width="x2 - x1" :height="HAUTEUR" :fill="`url(#${hachures})`" />
      <rect :x="GAUCHE" :y="HAUT" :width="LARGEUR" :height="HAUTEUR" fill="none" stroke="var(--ink)" stroke-width="2" />

      <!-- Repères V₁ et V₂ -->
      <g class="mono" font-size="11" font-weight="600" fill="var(--ink)">
        <line :x1="x1" :x2="x1" :y1="HAUT - 8" :y2="HAUT + HAUTEUR" stroke="var(--ink)" stroke-width="2" />
        <text :x="x1 - 4" :y="HAUT - 9" :text-anchor="x1 > 50 ? 'end' : 'start'" :dx="x1 > 50 ? 0 : 8">V₁</text>
        <template v-if="gain > 0">
          <line :x1="x2" :x2="x2" :y1="HAUT - 8" :y2="HAUT + HAUTEUR" stroke="var(--ink)" stroke-width="2" />
          <text :x="x2 + 4" :y="HAUT - 9" :text-anchor="x2 < 350 ? 'start' : 'end'" :dx="x2 < 350 ? 0 : -8">V₂</text>
        </template>
      </g>

      <!-- Échelle -->
      <g v-for="g in graduations" :key="g">
        <line :x1="x(g)" :x2="x(g)" :y1="HAUT + HAUTEUR" :y2="HAUT + HAUTEUR + 5" stroke="var(--ink)" stroke-width="2" />
        <text
          :x="x(g)"
          y="68"
          :text-anchor="g === 0 ? 'start' : g === 100 ? 'end' : 'middle'"
          fill="var(--ink-2)"
          font-size="10"
          class="mono"
        >{{ g }} %</text>
      </g>
    </svg>

    <ul class="mt-2 grid gap-1 text-sm leading-5 text-ink-2">
      <li class="flex items-center gap-2">
        <svg class="size-3.5 flex-none" viewBox="0 0 14 14" aria-hidden="true"><rect width="14" height="14" fill="var(--ink)" /></svg>
        Bases déjà présentes (Ca, Mg, K) : <b class="mono text-ink">{{ formaterCourt(v1, 1) }} %</b>
      </li>
      <li v-if="gain > 0" class="flex items-center gap-2">
        <svg class="size-3.5 flex-none" viewBox="0 0 14 14" aria-hidden="true">
          <rect width="14" height="14" :fill="`url(#${hachures})`" /><rect x="1" y="1" width="12" height="12" fill="none" stroke="var(--ink)" stroke-width="2" />
        </svg>
        À gagner avec le calcaire : <b class="mono text-ink">{{ formaterCourt(gain, 1) }} points</b>
      </li>
      <li class="flex items-center gap-2">
        <svg class="size-3.5 flex-none" viewBox="0 0 14 14" aria-hidden="true"><rect x="1" y="1" width="12" height="12" fill="var(--paper)" stroke="var(--ink)" stroke-width="2" /></svg>
        Acidité restante (H + Al)
      </li>
    </ul>
  </figure>
</template>
