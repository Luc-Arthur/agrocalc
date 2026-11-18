<script setup lang="ts">
import { computed } from 'vue'
import { formaterAuto, formaterCourt } from '../../calculs/format'
import { TERRAIN_FOOTBALL_M2, unitesSurface } from '../../calculs/conversions'

// Votre surface et les unités de référence dessinées à l'échelle, en carrés posés dans le même coin
const props = defineProps<{ m2: number }>()

const COIN_X = 6
const COIN_Y = 254
const COTE_MAX = 248
const references = (['acre', 'ha', 'alqueirePaulista', 'alqueireMineiro'] as const).map((u) => unitesSurface[u])

const maximum = computed(() => Math.max(props.m2, unitesSurface.alqueireMineiro.m2))
const cote = (m2: number) => Math.max(1.5, Math.sqrt(m2 / maximum.value) * COTE_MAX)

const carreUtilisateur = computed(() => cote(props.m2))
const carres = computed(() => references.map((r) => ({ ...r, cote: cote(r.m2) })))
const terrains = computed(() => props.m2 / TERRAIN_FOOTBALL_M2)

const description = computed(
  () => `Votre surface, ${formaterAuto(props.m2 / 10_000)} ha, comparée à l'acre, à l'hectare et aux alqueires paulista et mineiro.`,
)
</script>

<template>
  <figure class="flex flex-wrap items-end gap-x-6 gap-y-3">
    <figcaption class="kicker w-full">À l'échelle</figcaption>

    <svg class="block w-full max-w-[260px]" viewBox="0 0 260 260" role="img" :aria-label="description">
      <rect
        :x="COIN_X"
        :y="COIN_Y - carreUtilisateur"
        :width="carreUtilisateur"
        :height="carreUtilisateur"
        fill="var(--ink)"
        fill-opacity="0.16"
        stroke="var(--ink)"
        stroke-width="2"
      />
      <g v-for="c in carres" :key="c.symbole">
        <rect :x="COIN_X" :y="COIN_Y - c.cote" :width="c.cote" :height="c.cote" fill="none" stroke="var(--line)" stroke-width="1.5" stroke-dasharray="4 3" />
        <text
          v-if="c.cote >= 48"
          :x="COIN_X + c.cote - 5"
          :y="COIN_Y - c.cote + 14"
          text-anchor="end"
          class="mono"
          font-size="10"
          font-weight="600"
          fill="var(--ink-2)"
          stroke="var(--paper)"
          stroke-width="3"
          paint-order="stroke"
        >{{ c.symbole }}</text>
      </g>
    </svg>

    <ul class="grid min-w-0 flex-1 basis-48 gap-1.5 text-sm leading-5 text-ink-2">
      <li class="flex items-center gap-2">
        <svg class="size-3.5 flex-none" viewBox="0 0 14 14" aria-hidden="true">
          <rect x="1" y="1" width="12" height="12" fill="var(--ink)" fill-opacity="0.16" stroke="var(--ink)" stroke-width="2" />
        </svg>
        Votre surface
      </li>
      <li class="flex items-center gap-2">
        <svg class="size-3.5 flex-none" viewBox="0 0 14 14" aria-hidden="true">
          <rect x="1" y="1" width="12" height="12" fill="none" stroke="var(--line)" stroke-width="1.5" stroke-dasharray="3 2" />
        </svg>
        Unités de référence
      </li>
      <li class="mt-2 border-t-[1.5px] border-dashed border-line pt-2.5 text-[15px] text-ink">
        ≈ <b class="mono">{{ formaterCourt(terrains, terrains < 10 ? 1 : 0) }}</b>
        {{ terrains < 2 ? 'terrain' : 'terrains' }} de football
        <span class="block text-sm text-ink-2">105 × 68 m, dimensions FIFA</span>
      </li>
    </ul>
  </figure>
</template>
