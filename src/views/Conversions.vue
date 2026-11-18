<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import CarresSurface from '../components/calc/CarresSurface.vue'
import ChampNombre from '../components/calc/ChampNombre.vue'
import EnTete from '../components/calc/EnTete.vue'
import GrilleSacs from '../components/calc/GrilleSacs.vue'
import ListeCalculateurs from '../components/calc/ListeCalculateurs.vue'
import { formaterAuto, lireNombre } from '../calculs/format'
import {
  convertirRendement,
  convertirSurface,
  poidsSacs,
  unitesRendement,
  unitesSurface,
  verifierValeur,
  type UniteRendement,
  type UniteSurface,
} from '../calculs/conversions'

// Valeurs de départ : un alqueire paulista, et une bonne récolte de soja
const saisie = reactive({ surface: '1', rendement: '60', poidsSac: '60' })
const deSurface = ref<UniteSurface>('alqueirePaulista')
const deRendement = ref<UniteRendement>('scHa')

const listeSurface = Object.keys(unitesSurface) as UniteSurface[]
const listeRendement = Object.keys(unitesRendement) as UniteRendement[]

// Surface : le résultat principal est en hectares (en m² si l'on part des hectares)
const valeurSurface = computed(() => lireNombre(saisie.surface))
const erreurSurface = computed(() => verifierValeur(valeurSurface.value))
const cibleSurface = computed<UniteSurface>(() => (deSurface.value === 'ha' ? 'm2' : 'ha'))
const versSurface = (u: UniteSurface) => convertirSurface(valeurSurface.value, deSurface.value, u)
const autresSurface = computed(() => listeSurface.filter((u) => u !== deSurface.value && u !== cibleSurface.value))

// Rendement : le résultat principal est en kg/ha (en sacs/ha si l'on part des kg/ha)
const valeurRendement = computed(() => lireNombre(saisie.rendement))
const poidsSac = computed(() => lireNombre(saisie.poidsSac))
const erreurRendement = computed(() => verifierValeur(valeurRendement.value))
const erreurPoidsSac = computed(() => verifierValeur(poidsSac.value))
const rendementValide = computed(() => !erreurRendement.value && !erreurPoidsSac.value)
const cibleRendement = computed<UniteRendement>(() => (deRendement.value === 'kgHa' ? 'scHa' : 'kgHa'))
const versRendement = (u: UniteRendement) => convertirRendement(valeurRendement.value, deRendement.value, u, poidsSac.value)
const autresRendement = computed(() => listeRendement.filter((u) => u !== deRendement.value && u !== cibleRendement.value))

const grosChiffre =
  'mono -ml-1.5 inline-block -rotate-[0.6deg] rounded-[3px] bg-marker px-2.5 pb-1 pt-0.5 text-[56px] font-semibold leading-[56px] tracking-[-0.04em] text-on-marker lg:text-[64px] lg:leading-[64px]'
</script>

<template>
  <div class="mx-auto grid max-w-[1440px] grid-cols-1 gap-5 px-4 pb-8 pt-4 lg:grid-cols-[248px_minmax(0,1fr)] lg:items-start lg:gap-10 lg:px-12 lg:pb-12 lg:pt-8">
    <ListeCalculateurs />

    <div class="grid min-w-0 grid-cols-1 gap-5 lg:gap-7">
      <EnTete index="04" titre="Conversions" sous-titre="Surfaces et rendements, dans les unités du terrain" />

      <div class="grid grid-cols-1 gap-5 xl:grid-cols-2 xl:items-start xl:gap-7">
        <!-- Surface -->
        <section class="panel p-5 lg:p-7" aria-labelledby="titre-surface">
          <h2 id="titre-surface" class="kicker">Surface</h2>
          <div class="mt-4 grid grid-cols-1 gap-3">
            <ChampNombre
              id="surface"
              v-model="saisie.surface"
              label="Surface à convertir"
              :aide="unitesSurface[deSurface].nom.toLowerCase()"
              :unite="unitesSurface[deSurface].symbole"
              :erreur="erreurSurface"
            />
            <div class="flex flex-wrap gap-2" role="group" aria-label="Unité de départ">
              <button v-for="u in listeSurface" :key="u" type="button" class="chip-btn" :aria-pressed="deSurface === u" @click="deSurface = u">
                {{ unitesSurface[u].symbole }}
              </button>
            </div>
          </div>

          <div class="mt-6 border-t-2 border-ink pt-4" aria-live="polite">
            <template v-if="!erreurSurface">
              <p class="kicker">Soit</p>
              <p class="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span :class="grosChiffre">{{ formaterAuto(versSurface(cibleSurface)) }}</span>
                <span class="mono text-[22px] font-semibold">
                  {{ unitesSurface[cibleSurface].symbole }}<small class="block text-[15px] font-medium text-ink-2">{{ unitesSurface[cibleSurface].pluriel }}</small>
                </span>
              </p>
              <dl class="mt-4 border-t-[1.5px] border-dashed border-line">
                <div v-for="u in autresSurface" :key="u" class="result-row">
                  <dt>{{ unitesSurface[u].nom }}</dt>
                  <dd class="mono text-lg font-semibold">{{ formaterAuto(versSurface(u)) }} <span class="text-ink-2">{{ unitesSurface[u].symbole }}</span></dd>
                </div>
              </dl>
              <CarresSurface class="mt-5" :m2="versSurface('m2')" />
            </template>
            <p v-else class="text-[22px] font-bold leading-7">Entrez une surface pour la convertir.</p>
          </div>
        </section>

        <!-- Rendement -->
        <section class="panel p-5 lg:p-7" aria-labelledby="titre-rendement">
          <h2 id="titre-rendement" class="kicker">Rendement</h2>
          <div class="mt-4 grid grid-cols-1 gap-3">
            <ChampNombre
              id="rendement"
              v-model="saisie.rendement"
              label="Rendement à convertir"
              :aide="unitesRendement[deRendement].nom.toLowerCase()"
              :unite="unitesRendement[deRendement].symbole"
              :erreur="erreurRendement"
            />
            <div class="flex flex-wrap gap-2" role="group" aria-label="Unité de départ">
              <button v-for="u in listeRendement" :key="u" type="button" class="chip-btn" :aria-pressed="deRendement === u" @click="deRendement = u">
                {{ unitesRendement[u].symbole }}
              </button>
            </div>
            <div class="mt-2">
              <ChampNombre
                id="poids-sac"
                v-model="saisie.poidsSac"
                label="Poids du sac"
                unite="kg"
                indication="60 kg pour le soja, le maïs, le blé et le café ; 50 kg pour le riz."
                :erreur="erreurPoidsSac"
              />
              <div class="mt-2 flex flex-wrap gap-2" role="group" aria-label="Poids de sac courants">
                <button
                  v-for="p in poidsSacs"
                  :key="p.kg"
                  type="button"
                  class="chip-btn"
                  :aria-pressed="saisie.poidsSac === String(p.kg)"
                  :title="p.cultures"
                  @click="saisie.poidsSac = String(p.kg)"
                >{{ p.kg }} kg</button>
              </div>
            </div>
          </div>

          <div class="mt-6 border-t-2 border-ink pt-4" aria-live="polite">
            <template v-if="rendementValide">
              <p class="kicker">Soit</p>
              <p class="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span :class="grosChiffre">{{ formaterAuto(versRendement(cibleRendement)) }}</span>
                <span class="mono text-[22px] font-semibold">
                  {{ unitesRendement[cibleRendement].symbole }}<small class="block text-[15px] font-medium text-ink-2">{{ unitesRendement[cibleRendement].nom.toLowerCase() }}</small>
                </span>
              </p>
              <dl class="mt-4 border-t-[1.5px] border-dashed border-line">
                <div v-for="u in autresRendement" :key="u" class="result-row">
                  <dt>{{ unitesRendement[u].nom }}</dt>
                  <dd class="mono text-lg font-semibold">{{ formaterAuto(versRendement(u)) }} <span class="text-ink-2">{{ unitesRendement[u].symbole }}</span></dd>
                </div>
              </dl>
              <GrilleSacs class="mt-5" :sacs="versRendement('scHa')" :poids-sac="poidsSac" />
            </template>
            <p v-else class="text-[22px] font-bold leading-7">Corrigez les champs signalés pour voir la conversion.</p>
          </div>
        </section>
      </div>

      <!-- Repères -->
      <section class="border-2 border-ink bg-paper-2 p-5" aria-labelledby="titre-reperes">
        <h2 id="titre-reperes" class="kicker">Repères</h2>
        <ul class="mono mt-3 grid gap-1.5 text-base leading-[26px] [overflow-wrap:anywhere]">
          <li>1 ha = 10 000 m² <span class="text-ink-2">· un carré de 100 × 100 m</span></li>
          <li>1 alqueire paulista = 24 200 m² = 2,42 ha</li>
          <li>1 alqueire mineiro = 48 400 m² = 4,84 ha <span class="text-ink-2">· 2 alqueires paulistas</span></li>
          <li>1 acre ≈ 4 047 m² ≈ 0,405 ha</li>
          <li>1 sac = 60 kg <span class="text-ink-2">· 50 kg pour le riz</span></li>
        </ul>
      </section>

      <p class="note">
        <svg class="icon !size-5 text-ink" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7v.5" /></svg>
        <span>L'alqueire change d'une région à l'autre (paulista à São Paulo et au Paraná, mineiro dans le Minas Gerais et le Goiás) : vérifiez lequel est utilisé localement.</span>
      </p>
    </div>
  </div>
</template>
