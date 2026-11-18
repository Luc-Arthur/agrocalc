<script setup lang="ts">
import { computed, reactive } from 'vue'
import Avertissement from '../components/calc/Avertissement.vue'
import BilanNutriments from '../components/calc/BilanNutriments.vue'
import BoutonCopier from '../components/calc/BoutonCopier.vue'
import ChampNombre from '../components/calc/ChampNombre.vue'
import EnTete from '../components/calc/EnTete.vue'
import ListeCalculateurs from '../components/calc/ListeCalculateurs.vue'
import { formater, formaterCourt, lireNombre } from '../calculs/format'
import {
  calculerFumure,
  engraisSimples,
  formaterFormule,
  formulesCourantes,
  lireFormule,
  nomsNutriments,
  nutriments,
  verifierFumure,
} from '../calculs/fumure'

const POIDS_SAC = 50

// Valeurs de départ : des besoins courants et la formule la plus vendue
const saisie = reactive({ formule: '04-14-08', n: '40', p: '70', k: '60', surface: '' })

const donnees = computed(() => ({
  besoins: { n: lireNombre(saisie.n), p: lireNombre(saisie.p), k: lireNombre(saisie.k) },
  formule: lireFormule(saisie.formule),
}))
const erreurs = computed(() => verifierFumure(donnees.value))
const resultat = computed(() => calculerFumure(donnees.value))

const surface = computed(() => lireNombre(saisie.surface))
// La surface est facultative : vide = pas de total pour la parcelle
const erreurSurface = computed(() =>
  saisie.surface.trim() === '' || surface.value > 0 ? undefined : 'Entrez une surface supérieure à 0.',
)
const total = computed(() =>
  resultat.value && saisie.surface.trim() !== '' && !erreurSurface.value ? resultat.value.dose * surface.value : null,
)

const formule = computed(() => (donnees.value.formule && !erreurs.value.formule ? formaterFormule(donnees.value.formule) : '—'))
const dose = computed(() => (resultat.value ? formater(resultat.value.dose) : '—'))
const sacs = computed(() => (resultat.value ? formaterCourt(resultat.value.dose / POIDS_SAC, 1) : '—'))

const complements = computed(() =>
  resultat.value
    ? nutriments
        .filter((x) => resultat.value!.complements[x] > 0)
        .map((x) => ({ x, ...engraisSimples[x], kg: resultat.value!.complements[x], manque: resultat.value!.manques[x] }))
    : [],
)
const surplus = computed(() =>
  resultat.value ? nutriments.filter((x) => resultat.value!.exces[x] > 0).map((x) => ({ x, kg: resultat.value!.exces[x] })) : [],
)

// Calcul détaillé : la dose qui couvrirait chaque besoin, la plus petite est retenue
const dosesDetaillees = computed(() => {
  const r = resultat.value
  const f = donnees.value.formule
  if (!r || !f) return []
  return nutriments
    .filter((x) => r.dosesParNutriment[x] !== undefined)
    .map((x) => ({ x, besoin: donnees.value.besoins[x], teneur: f[x], dose: r.dosesParNutriment[x]!, retenue: x === r.limitant }))
})

// Texte copié
const resume = computed(() => {
  const r = resultat.value
  if (!r) return ''
  const b = donnees.value.besoins
  return [
    `Fumure : ${dose.value} kg/ha de ${formule.value} (≈ ${sacs.value} sacs de ${POIDS_SAC} kg)`,
    total.value !== null ? `Total pour ${formaterCourt(surface.value)} ha : ${formater(total.value)} kg` : '',
    complements.value.length
      ? `Compléments : ${complements.value.map((c) => `${c.nom.toLowerCase()} ${formater(c.kg, 1)} kg/ha`).join(' · ')}`
      : 'Aucun complément nécessaire',
    `Besoins : N ${formaterCourt(b.n)} · P₂O₅ ${formaterCourt(b.p)} · K₂O ${formaterCourt(b.k)} kg/ha`,
    'Calculé avec AgroCalc : https://luc-arthur.github.io/agrocalc/#/fumure',
  ]
    .filter(Boolean)
    .join('\n')
})
</script>

<template>
  <div
    class="mx-auto grid max-w-[1440px] grid-cols-1 gap-5 px-4 pb-8 pt-4 lg:grid-cols-[248px_minmax(0,1fr)_minmax(0,472px)] lg:items-start lg:gap-10 lg:px-12 lg:pb-12 lg:pt-8"
  >
    <ListeCalculateurs />

    <div class="contents lg:grid lg:min-w-0 lg:gap-7">
      <EnTete index="03" titre="Fumure NPK" sous-titre="Engrais commercial à apporter, en kg par hectare" class="order-1 lg:order-none" />

      <!-- Vos données -->
      <section class="order-3 lg:order-none" aria-labelledby="titre-donnees">
        <h2 id="titre-donnees" class="kicker mb-3">Engrais et besoins</h2>
        <div class="grid grid-cols-1 gap-[18px] lg:grid-cols-2 lg:gap-x-6 lg:gap-y-5">
          <div class="lg:col-span-2">
            <ChampNombre
              id="formule"
              v-model="saisie.formule"
              clavier="text"
              label="Formule de l'engrais"
              unite="N-P-K"
              indication="Les trois chiffres du sac : % de N, de P₂O₅ et de K₂O."
              :erreur="erreurs.formule"
            />
            <div class="mt-2 flex flex-wrap items-center gap-2" role="group" aria-label="Formules courantes">
              <button v-for="f in formulesCourantes" :key="f" type="button" class="chip-btn" :aria-pressed="saisie.formule === f" @click="saisie.formule = f">{{ f }}</button>
            </div>
          </div>

          <p class="text-[15px] leading-5 text-ink-2 lg:col-span-2">
            <b class="text-ink">Besoins de la culture</b>, d'après l'analyse de sol et la table de recommandation de votre région.
          </p>
          <ChampNombre id="besoin-n" v-model="saisie.n" label="Azote" aide="N" unite="kg/ha" :erreur="erreurs.n" />
          <ChampNombre id="besoin-p" v-model="saisie.p" label="Phosphore" aide="P₂O₅" unite="kg/ha" :erreur="erreurs.p" />
          <ChampNombre id="besoin-k" v-model="saisie.k" label="Potassium" aide="K₂O" unite="kg/ha" :erreur="erreurs.k" />
          <ChampNombre id="surface" v-model="saisie.surface" label="Surface de la parcelle" aide="facultatif" unite="ha" indication="Pour connaître le total à commander." :erreur="erreurSurface" />
          <p v-if="erreurs.besoins" class="text-sm font-bold text-danger lg:col-span-2">{{ erreurs.besoins }}</p>
        </div>
      </section>

      <!-- Formule -->
      <section class="order-4 border-2 border-ink bg-paper-2 p-5 lg:order-none" aria-labelledby="titre-formule">
        <h2 id="titre-formule" class="kicker">Formule</h2>
        <p class="mono mt-3 border-[1.5px] border-line bg-paper px-3.5 py-3 text-base font-semibold leading-[26px] [overflow-wrap:anywhere]">
          kg/ha = besoin (kg/ha) × 100 ÷ teneur (%)
        </p>
        <ul v-if="dosesDetaillees.length" class="mono mt-3 grid gap-1 text-base leading-[26px] text-ink-2 [overflow-wrap:anywhere]">
          <li v-for="d in dosesDetaillees" :key="d.x">
            {{ nomsNutriments[d.x] }} : {{ formaterCourt(d.besoin) }} × 100 ÷ {{ formaterCourt(d.teneur) }} =
            <b v-if="d.retenue" class="highlight font-semibold">{{ formater(d.dose) }} kg/ha</b>
            <template v-else>{{ formater(d.dose) }} kg/ha</template>
          </li>
        </ul>
        <p class="mt-3 text-base leading-6">
          On calcule la dose qui couvrirait chaque besoin, puis on garde la plus petite : elle couvre entièrement un nutriment
          <template v-if="resultat?.limitant">(ici le {{ nomsNutriments[resultat.limitant] }})</template>
          sans dépasser les autres. Ce qui manque encore est complété par des engrais simples :
          urée (45 % N), superphosphate triple (46 % P₂O₅), chlorure de potassium (60 % K₂O).
        </p>
        <p class="mt-3 text-sm leading-5 text-ink-2">
          Dans le Rio Grande do Sul et en Santa Catarina, les besoins se lisent dans les tables du Manuel CQFS-RS/SC selon la culture et le rendement visé.
        </p>
      </section>
    </div>

    <!-- Résultat : au-dessus des champs sur mobile -->
    <div class="order-2 grid gap-4 lg:sticky lg:top-24 lg:order-none">
      <section class="panel p-5 lg:p-7" aria-live="polite" aria-labelledby="titre-resultat">
        <p class="flex justify-between gap-2">
          <span id="titre-resultat" class="kicker">Engrais à apporter</span>
          <span class="kicker">{{ formule }}</span>
        </p>
        <p class="mt-3.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span
            class="mono -ml-1.5 inline-block -rotate-[0.6deg] rounded-[3px] bg-marker px-2.5 pb-1 pt-0.5 text-[76px] font-semibold leading-[72px] tracking-[-0.04em] text-on-marker lg:text-[104px] lg:leading-[100px]"
            >{{ dose }}</span
          >
          <span class="mono text-[22px] font-semibold lg:text-[26px]">
            kg/ha<small class="block text-[15px] font-medium text-ink-2">de {{ formule }}</small>
          </span>
        </p>

        <template v-if="resultat">
          <p v-if="resultat.dose > 0" class="mt-[18px] border-t-[1.5px] border-dashed border-line pt-3.5 text-[17px]">
            <span class="mono mr-2 text-[28px] font-semibold">≈ {{ sacs }}</span>
            sacs de {{ POIDS_SAC }} kg par hectare
          </p>
          <p v-else class="mt-3 font-bold">Cette formule n'apporte aucun des nutriments demandés : tout passe par les engrais simples.</p>

          <dl class="mt-4 border-t-[1.5px] border-dashed border-line">
            <div v-if="total !== null" class="result-row">
              <dt>Total pour {{ formaterCourt(surface) }} ha</dt>
              <dd class="mono text-lg font-semibold">{{ formater(total) }} <span class="text-ink-2">kg</span></dd>
            </div>
            <div v-for="c in complements" :key="c.x" class="result-row">
              <dt>
                + {{ c.nom }} <span class="text-ink-2">({{ c.teneur }} % {{ nomsNutriments[c.x] }})</span>
                <small class="block text-sm text-ink-2">pour les {{ formaterCourt(c.manque, 1) }} kg de {{ nomsNutriments[c.x] }} qui manquent</small>
              </dt>
              <dd class="mono text-lg font-semibold">{{ formater(c.kg, 1) }} <span class="text-ink-2">kg/ha</span></dd>
            </div>
          </dl>
          <p v-if="!complements.length" class="mt-3 text-[15px]">Aucun complément : la formule couvre tous les besoins.</p>
          <p v-for="s in surplus" :key="s.x" class="mt-3 text-sm leading-5 text-ink-2">
            La formule apporte aussi {{ formaterCourt(s.kg, 1) }} kg/ha de {{ nomsNutriments[s.x] }} au-delà du besoin.
          </p>

          <BilanNutriments class="mt-5" :besoins="donnees.besoins" :apports="resultat.apports" />
        </template>

        <BoutonCopier class="mt-[18px]" :texte="resume" />
      </section>
      <Avertissement class="hidden lg:flex" />
    </div>

    <Avertissement class="order-5 lg:hidden" />
  </div>
</template>
