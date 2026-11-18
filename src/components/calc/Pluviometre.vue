<script setup lang="ts">
import { computed, useId } from 'vue'
import { formaterCourt } from '../../calculs/format'

// Un pluviomètre : la pluie, l'arrosage utile et les pertes, empilés en millimètres d'eau
const props = defineProps<{ pluie: number; lameNette: number; lameBrute: number; consommation: number; jours: number }>()

const X = 52
const LARGEUR = 64
const BAS = 216
const HAUTEUR = 188
const hachures = useId()

const pluieUtile = computed(() => Math.min(props.pluie, props.consommation))
const pertes = computed(() => Math.max(0, props.lameBrute - props.lameNette))
const total = computed(() => pluieUtile.value + props.lameBrute)

// Échelle ronde : pas de 1, 2, 5, 10… mm, six graduations au plus
const pas = computed(() => {
  const pasPossibles = [1, 2, 5, 10, 20, 50, 100, 200, 500]
  return pasPossibles.find((p) => Math.max(total.value, props.consommation) / p <= 6) ?? 1000
})
const maximum = computed(() => Math.max(pas.value, Math.ceil(Math.max(total.value, props.consommation) / pas.value) * pas.value))
const h = (mm: number) => (mm / maximum.value) * HAUTEUR
const graduations = computed(() => Array.from({ length: Math.round(maximum.value / pas.value) + 1 }, (_, i) => i * pas.value))

const segments = computed(() => {
  const yPluie = BAS - h(pluieUtile.value)
  const yNette = yPluie - h(props.lameNette)
  return {
    pluie: { y: yPluie, hauteur: h(pluieUtile.value) },
    nette: { y: yNette, hauteur: h(props.lameNette) },
    pertes: { y: yNette - h(pertes.value), hauteur: h(pertes.value) },
  }
})
const yBesoin = computed(() => BAS - h(props.consommation))

const description = computed(
  () =>
    `Besoin de la culture sur ${formaterCourt(props.jours, 1)} jours : ${formaterCourt(props.consommation, 1)} mm. ` +
    `Pluie utile ${formaterCourt(pluieUtile.value, 1)} mm, arrosage utile ${formaterCourt(props.lameNette, 1)} mm, pertes ${formaterCourt(pertes.value, 1)} mm.`,
)
</script>

<template>
  <figure class="flex flex-wrap items-end gap-x-5 gap-y-3">
    <figcaption class="kicker w-full">Le pluviomètre de l'arrosage</figcaption>

    <svg class="block w-[184px] flex-none" viewBox="0 0 160 232" role="img" :aria-label="description">
      <defs>
        <pattern :id="hachures" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="var(--pencil)" stroke-width="2.5" />
        </pattern>
      </defs>

      <!-- Graduations -->
      <g v-for="g in graduations" :key="g">
        <line :x1="X - 6" :x2="X" :y1="BAS - h(g)" :y2="BAS - h(g)" stroke="var(--ink)" stroke-width="1.5" />
        <text :x="X - 9" :y="BAS - h(g) + 3.5" text-anchor="end" class="mono" font-size="10" fill="var(--ink-2)">{{ g }}</text>
      </g>
      <text :x="X - 9" :y="BAS - HAUTEUR - 14" text-anchor="end" class="mono" font-size="10" fill="var(--ink-2)">mm</text>

      <!-- L'eau : pluie, arrosage utile, pertes -->
      <rect v-if="segments.pluie.hauteur > 0" :x="X" :y="segments.pluie.y" :width="LARGEUR" :height="segments.pluie.hauteur" fill="var(--pencil)" fill-opacity="0.3" />
      <rect v-if="segments.nette.hauteur > 0" :x="X" :y="segments.nette.y" :width="LARGEUR" :height="segments.nette.hauteur" fill="var(--pencil)" />
      <rect v-if="segments.pertes.hauteur > 0" :x="X" :y="segments.pertes.y" :width="LARGEUR" :height="segments.pertes.hauteur" :fill="`url(#${hachures})`" />

      <!-- Le tube et son entonnoir -->
      <path
        :d="`M${X - 10} ${BAS - HAUTEUR - 12} L${X} ${BAS - HAUTEUR} V${BAS} H${X + LARGEUR} V${BAS - HAUTEUR} L${X + LARGEUR + 10} ${BAS - HAUTEUR - 12}`"
        fill="none"
        stroke="var(--ink)"
        stroke-width="2.5"
        stroke-linejoin="round"
      />

      <!-- Besoin de la culture -->
      <line :x1="X - 4" :x2="X + LARGEUR + 8" :y1="yBesoin" :y2="yBesoin" stroke="var(--ink)" stroke-width="2" stroke-dasharray="5 3" />
      <text :x="X + LARGEUR + 10" :y="yBesoin + 3.5" class="mono" font-size="10" font-weight="600" fill="var(--ink)">ETc</text>
    </svg>

    <ul class="grid min-w-0 flex-1 basis-52 gap-1.5 text-sm leading-5 text-ink-2">
      <li v-if="pluieUtile > 0" class="flex items-start gap-2">
        <svg class="mt-0.5 size-3.5 flex-none" viewBox="0 0 14 14" aria-hidden="true"><rect width="14" height="14" fill="var(--pencil)" fill-opacity="0.3" /></svg>
        <span>Pluie utile : <b class="mono text-ink">{{ formaterCourt(pluieUtile, 1) }} mm</b></span>
      </li>
      <li class="flex items-start gap-2">
        <svg class="mt-0.5 size-3.5 flex-none" viewBox="0 0 14 14" aria-hidden="true"><rect width="14" height="14" fill="var(--pencil)" /></svg>
        <span>Arrosage utile, lame nette : <b class="mono text-ink">{{ formaterCourt(lameNette, 1) }} mm</b></span>
      </li>
      <li v-if="pertes > 0" class="flex items-start gap-2">
        <svg class="mt-0.5 size-3.5 flex-none" viewBox="0 0 14 14" aria-hidden="true">
          <rect width="14" height="14" :fill="`url(#${hachures})`" /><rect x="1" y="1" width="12" height="12" fill="none" stroke="var(--pencil)" stroke-width="1.5" />
        </svg>
        <span>Pertes du système (vent, évaporation, fuites) : <b class="mono text-ink">{{ formaterCourt(pertes, 1) }} mm</b></span>
      </li>
      <li class="flex items-start gap-2">
        <svg class="mt-0.5 size-3.5 flex-none" viewBox="0 0 14 14" aria-hidden="true"><line x1="0" y1="7" x2="14" y2="7" stroke="var(--ink)" stroke-width="2" stroke-dasharray="4 2" /></svg>
        <span>Besoin de la culture sur {{ formaterCourt(jours, 1) }} {{ jours > 1 ? 'jours' : 'jour' }} (ETc) : <b class="mono text-ink">{{ formaterCourt(consommation, 1) }} mm</b></span>
      </li>
    </ul>
  </figure>
</template>
