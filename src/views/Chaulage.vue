<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import Avertissement from '../components/calc/Avertissement.vue'
import ChampNombre from '../components/calc/ChampNombre.vue'
import EnTete from '../components/calc/EnTete.vue'
import JaugeSaturation from '../components/calc/JaugeSaturation.vue'
import ListeCalculateurs from '../components/calc/ListeCalculateurs.vue'
import { calculerChaulage, verifierChaulage } from '../calculs/chaulage'
import { formater, formaterCourt, lireNombre } from '../calculs/format'

// Valeurs de départ : un sol acide courant et un calcaire à PRNT 80 %
const saisie = reactive({ v1: '40', v2: '70', ctc: '10', prnt: '80', surface: '' })
const cibles = ['50', '60', '70']

const donnees = computed(() => ({
  v1: lireNombre(saisie.v1),
  v2: lireNombre(saisie.v2),
  ctc: lireNombre(saisie.ctc),
  prnt: lireNombre(saisie.prnt),
}))
const surface = computed(() => lireNombre(saisie.surface))
const erreurs = computed(() => verifierChaulage(donnees.value))
// La surface est facultative : vide = pas de total pour la parcelle
const erreurSurface = computed(() =>
  saisie.surface.trim() === '' || surface.value > 0 ? undefined : 'Entrez une surface supérieure à 0.',
)
const resultat = computed(() => calculerChaulage(donnees.value))
const total = computed(() =>
  resultat.value && saisie.surface.trim() !== '' && !erreurSurface.value ? resultat.value.tHa * surface.value : null,
)

const tHa = computed(() => (resultat.value ? formater(resultat.value.tHa, 2) : '—'))

// Texte copié
const resume = computed(() => {
  if (!resultat.value) return ''
  const d = donnees.value
  return [
    `Chaulage : ${tHa.value} t de calcaire/ha (couche 0–20 cm)`,
    total.value !== null ? `Total pour ${formaterCourt(surface.value)} ha : ${formater(total.value, 1)} t` : '',
    `V₁ ${formaterCourt(d.v1)} % → V₂ ${formaterCourt(d.v2)} % · CTC ${formaterCourt(d.ctc)} cmolc/dm³ · PRNT ${formaterCourt(d.prnt)} %`,
    'Calculé avec AgroCalc : https://luc-arthur.github.io/agrocalc/#/chaulage',
  ]
    .filter(Boolean)
    .join('\n')
})

const copie = ref(false)
async function copier() {
  if (!resume.value) return
  try {
    await navigator.clipboard.writeText(resume.value)
    copie.value = true
    setTimeout(() => (copie.value = false), 1500)
  } catch {
    window.prompt('Copiez le résultat :', resume.value)
  }
}
</script>

<template>
  <div
    class="mx-auto grid max-w-[1440px] grid-cols-1 gap-5 px-4 pb-8 pt-4 lg:grid-cols-[248px_minmax(0,1fr)_minmax(0,472px)] lg:items-start lg:gap-10 lg:px-12 lg:pb-12 lg:pt-8"
  >
    <ListeCalculateurs />

    <div class="contents lg:grid lg:min-w-0 lg:gap-7">
      <EnTete index="02" titre="Chaulage" sous-titre="Besoin en calcaire, méthode de la saturation par bases" class="order-1 lg:order-none" />

      <!-- Vos données -->
      <section class="order-3 lg:order-none" aria-labelledby="titre-donnees">
        <h2 id="titre-donnees" class="kicker mb-3">Votre analyse de sol</h2>
        <div class="grid grid-cols-1 gap-[18px] lg:grid-cols-2 lg:gap-x-6 lg:gap-y-5">
          <ChampNombre id="v1" v-model="saisie.v1" label="Saturation actuelle (V₁)" unite="%" indication="Ligne « V % » de l'analyse de sol." :erreur="erreurs.v1" />
          <ChampNombre id="ctc" v-model="saisie.ctc" label="CTC à pH 7" unite="cmolc/dm³" indication="Aussi notée « T » sur l'analyse." :erreur="erreurs.ctc" />
          <div class="lg:col-span-2">
            <ChampNombre id="v2" v-model="saisie.v2" label="Saturation visée (V₂)" unite="%" :erreur="erreurs.v2" />
            <div class="mt-2 flex flex-wrap items-center gap-2" role="group" aria-label="Cibles courantes">
              <button v-for="c in cibles" :key="c" type="button" class="chip-btn" :aria-pressed="saisie.v2 === c" @click="saisie.v2 = c">{{ c }} %</button>
              <span class="text-sm text-ink-2">selon la culture et la région</span>
            </div>
          </div>
          <ChampNombre id="prnt" v-model="saisie.prnt" label="PRNT du calcaire" unite="%" indication="Indiqué sur le sac ou la fiche du produit." :erreur="erreurs.prnt" />
          <ChampNombre id="surface" v-model="saisie.surface" label="Surface de la parcelle" aide="facultatif" unite="ha" indication="Pour connaître le total à commander." :erreur="erreurSurface" />
        </div>
      </section>

      <!-- Formule -->
      <section class="order-4 border-2 border-ink bg-paper-2 p-5 lg:order-none" aria-labelledby="titre-formule">
        <h2 id="titre-formule" class="kicker">Formule</h2>
        <p class="mono mt-3 border-[1.5px] border-line bg-paper px-3.5 py-3 text-base font-semibold leading-[26px] [overflow-wrap:anywhere]">
          NC (t/ha) = (V₂ − V₁) × CTC ÷ PRNT
        </p>
        <p v-if="resultat && !resultat.inutile" class="mono mt-3 text-base leading-[26px] text-ink-2 [overflow-wrap:anywhere]">
          = ({{ formaterCourt(donnees.v2) }} − {{ formaterCourt(donnees.v1) }}) × {{ formaterCourt(donnees.ctc) }} ÷ {{ formaterCourt(donnees.prnt) }} =
          <b class="highlight font-semibold">{{ tHa }} t/ha</b>
        </p>
        <p class="mt-3 text-base leading-6">
          V est la part de la CTC occupée par les bases (calcium, magnésium, potassium) ; le reste est de l'acidité. Pour passer de V₁ à V₂,
          il faut neutraliser (V₂ − V₁) % de la CTC : sur 0–20 cm, chaque cmolc/dm³ demande environ 1 t/ha de calcaire pur. On divise enfin par
          le PRNT, car un calcaire du commerce n'agit jamais à 100 %.
        </p>
        <p class="mt-3 text-sm leading-5 text-ink-2">
          Dans le Rio Grande do Sul et en Santa Catarina, la recommandation officielle utilise l'indice SMP (Manuel CQFS-RS/SC).
        </p>
      </section>
    </div>

    <!-- Résultat : au-dessus des champs sur mobile -->
    <div class="order-2 grid gap-4 lg:sticky lg:top-24 lg:order-none">
      <section class="panel p-5 lg:p-7" aria-live="polite" aria-labelledby="titre-resultat">
        <p id="titre-resultat" class="kicker">Calcaire à apporter</p>
        <p class="mt-3.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span
            class="mono -ml-1.5 inline-block -rotate-[0.6deg] rounded-[3px] bg-marker px-2.5 pb-1 pt-0.5 text-[76px] font-semibold leading-[72px] tracking-[-0.04em] text-on-marker lg:text-[104px] lg:leading-[100px]"
            >{{ tHa }}</span
          >
          <span class="mono text-[22px] font-semibold lg:text-[26px]">
            t/ha<small class="block text-[15px] font-medium text-ink-2">couche 0–20 cm</small>
          </span>
        </p>
        <p v-if="resultat?.inutile" class="mt-3 font-bold">Pas de chaulage nécessaire : le sol est déjà à la saturation visée.</p>

        <dl v-if="resultat && !resultat.inutile" class="mt-4 border-t-[1.5px] border-dashed border-line">
          <div class="result-row">
            <dt>Avec un calcaire à PRNT 100 %</dt>
            <dd class="mono text-lg font-semibold">{{ formater(resultat.tHaPur, 2) }} <span class="text-ink-2">t/ha</span></dd>
          </div>
          <div v-if="total !== null" class="result-row">
            <dt>Total pour {{ formaterCourt(surface) }} ha</dt>
            <dd class="mono text-lg font-semibold">{{ formater(total, 1) }} <span class="text-ink-2">t</span></dd>
          </div>
        </dl>

        <JaugeSaturation v-if="resultat" class="mt-5" :v1="donnees.v1" :v2="donnees.v2" />

        <button
          type="button"
          class="mt-[18px] inline-flex h-14 w-full items-center justify-center gap-2 rounded border-2 px-3 font-bold disabled:opacity-50"
          :class="copie ? 'border-on-marker bg-marker text-on-marker' : 'border-ink bg-ink text-paper'"
          :disabled="!resultat"
          @click="copier"
        >
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" /><path d="M15 9V4H4v11h5" /></svg>
          {{ copie ? 'Copié' : 'Copier le résultat' }}
        </button>
      </section>
      <Avertissement class="hidden lg:flex" />
    </div>

    <Avertissement class="order-5 lg:hidden" />
  </div>
</template>
