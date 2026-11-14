<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import Avertissement from '../components/calc/Avertissement.vue'
import ChampNombre from '../components/calc/ChampNombre.vue'
import EnTete from '../components/calc/EnTete.vue'
import ListeCalculateurs from '../components/calc/ListeCalculateurs.vue'
import { formater, lireNombre } from '../calculs/format'
import { calculerSemis, cultures, verifierSemis, type Culture } from '../calculs/semis'

// Les champs gardent le texte saisi (« 300 000 ») ; on le convertit en nombre pour calculer
const culture = ref<Culture>('soja')
const saisie = reactive({
  population: '300 000',
  ecartement: '45',
  pmg: '180',
  germination: '85',
  purete: '98',
})

function choisirCulture() {
  const c = cultures[culture.value]
  saisie.population = formater(c.population)
  saisie.ecartement = formater(c.ecartement)
  saisie.pmg = formater(c.pmg)
}

const donnees = computed(() => ({
  population: lireNombre(saisie.population),
  ecartement: lireNombre(saisie.ecartement),
  pmg: lireNombre(saisie.pmg),
  germination: lireNombre(saisie.germination),
  purete: lireNombre(saisie.purete),
}))
const erreurs = computed(() => verifierSemis(donnees.value))
const resultat = computed(() => calculerSemis(donnees.value))

const kg = computed(() => (resultat.value ? formater(resultat.value.kgParHectare, 1) : '—'))
const graines = computed(() => (resultat.value ? formater(Math.round(resultat.value.grainesParMetre)) : '—'))
const plantes = computed(() => (resultat.value ? formater(resultat.value.plantesParMetre, 1) : '—'))

// Texte copié ou partagé
const resume = computed(() => {
  if (!resultat.value) return ''
  const d = donnees.value
  return [
    `Semis de ${cultures[culture.value].nom.toLowerCase()} : ${kg.value} kg de semences/ha`,
    `≈ ${graines.value} graines par mètre de rang (${plantes.value} plantes/m)`,
    `Population ${formater(d.population)} plantes/ha · écartement ${formater(d.ecartement)} cm · PMG ${formater(d.pmg)} g · germination ${formater(d.germination)} % · pureté ${formater(d.purete)} %`,
    'Calculé avec AgroCalc : https://luc-arthur.github.io/agrocalc/',
  ].join('\n')
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

const partageDisponible = typeof navigator !== 'undefined' && 'share' in navigator
async function partager() {
  if (!resume.value) return
  try {
    await navigator.share({ title: 'AgroCalc · Semis', text: resume.value })
  } catch {
    // Partage annulé par l'utilisateur : rien à faire
  }
}
</script>

<template>
  <div
    class="mx-auto grid max-w-[1440px] gap-5 px-4 pb-8 pt-4 lg:grid-cols-[248px_minmax(0,1fr)_minmax(0,472px)] lg:items-start lg:gap-10 lg:px-12 lg:pb-12 lg:pt-8"
  >
    <ListeCalculateurs />

    <div class="contents lg:grid lg:min-w-0 lg:gap-7">
      <EnTete index="01" titre="Semis" sous-titre="Densité de semis, en kg de semences par hectare" class="order-1" />

      <!-- Vos données -->
      <section class="order-3 lg:order-none" aria-labelledby="titre-donnees">
        <h2 id="titre-donnees" class="kicker mb-3">Vos données</h2>
        <div class="grid gap-[18px] lg:grid-cols-2 lg:gap-x-6 lg:gap-y-5">
          <div class="lg:col-span-2">
            <label for="culture" class="mb-2 flex justify-between text-[15px] font-bold leading-5">
              <span>Culture</span><span class="font-normal text-ink-2">remplit des valeurs typiques</span>
            </label>
            <div class="relative flex h-16 items-center rounded border-2 border-line bg-paper focus-within:border-ink focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-pencil">
              <select id="culture" v-model="culture" class="h-full w-full appearance-none bg-transparent pl-4 pr-14 text-[22px] font-bold outline-none" @change="choisirCulture">
                <option v-for="(c, cle) in cultures" :key="cle" :value="cle">{{ c.nom }}</option>
              </select>
              <svg class="icon pointer-events-none absolute right-4" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
            </div>
          </div>
          <ChampNombre id="population" v-model="saisie.population" label="Population visée" unite="plantes/ha" :erreur="erreurs.population" class="lg:col-span-2" />
          <ChampNombre id="ecartement" v-model="saisie.ecartement" label="Écartement entre rangs" unite="cm" :erreur="erreurs.ecartement" />
          <ChampNombre id="pmg" v-model="saisie.pmg" label="Poids de mille grains" aide="PMG" unite="g" :erreur="erreurs.pmg" />
          <ChampNombre id="germination" v-model="saisie.germination" label="Germination" unite="%" :erreur="erreurs.germination" />
          <ChampNombre id="purete" v-model="saisie.purete" label="Pureté" unite="%" :erreur="erreurs.purete" />
        </div>
      </section>

      <!-- Formule -->
      <section class="order-4 border-2 border-ink bg-paper-2 p-5 lg:order-none" aria-labelledby="titre-formule">
        <h2 id="titre-formule" class="kicker">Formule</h2>
        <p class="mono mt-3 border-[1.5px] border-line bg-paper px-3.5 py-3 text-base font-semibold leading-[26px] [overflow-wrap:anywhere]">
          kg/ha = (plantes/ha × PMG) ÷ (1 000 000 × germination × pureté)
        </p>
        <p v-if="resultat" class="mono mt-3 text-base leading-[26px] text-ink-2 [overflow-wrap:anywhere]">
          = ({{ formater(donnees.population) }} × {{ formater(donnees.pmg) }}) ÷ (1 000 000 × {{ formater(donnees.germination / 100, 2) }} ×
          {{ formater(donnees.purete / 100, 2) }}) =
          <b class="highlight font-semibold">{{ kg }} kg/ha</b>
        </p>
        <p v-if="resultat" class="mt-3 text-base leading-6">
          On calcule la masse de grains pour la population visée, puis on la corrige par la part de semences viables :
          {{ formater(donnees.germination / 100, 2) }} × {{ formater(donnees.purete / 100, 2) }} = {{ formater(resultat.partViable * 100, 1) }} %.
          Par mètre de rang : {{ formater(donnees.population) }} × {{ formater(donnees.ecartement / 100, 2) }} ÷ 10 000 = {{ plantes }} plantes,
          soit {{ graines }} graines à semer avec {{ formater(donnees.germination) }} % de germination.
        </p>
      </section>
    </div>

    <!-- Résultat : l'élément le plus visible, au-dessus des champs sur mobile -->
    <div class="order-2 grid gap-4 lg:sticky lg:top-24 lg:order-none">
      <section class="panel p-5 lg:p-7" aria-live="polite" aria-labelledby="titre-resultat">
        <p class="flex justify-between gap-2">
          <span id="titre-resultat" class="kicker">Semences à prévoir</span>
          <span class="kicker">{{ cultures[culture].nom }}</span>
        </p>
        <p class="mt-3.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span
            class="mono -ml-1.5 inline-block -rotate-[0.6deg] rounded-[3px] bg-marker px-2.5 pb-1 pt-0.5 text-[76px] font-semibold leading-[72px] tracking-[-0.04em] text-on-marker lg:text-[112px] lg:leading-[104px]"
            >{{ kg }}</span
          >
          <span class="mono text-[22px] font-semibold lg:text-[26px]">
            kg/ha<small class="block text-[15px] font-medium text-ink-2">semences</small>
          </span>
        </p>
        <p class="mt-[18px] border-t-[1.5px] border-dashed border-line pt-3.5 text-[17px]">
          <span class="mono mr-2 text-[28px] font-semibold">≈ {{ graines }}</span>
          graines par mètre de rang <span class="text-ink-2">({{ plantes }} plantes/m)</span>
        </p>
        <div class="mt-[18px] grid gap-2" :class="partageDisponible ? 'grid-cols-[minmax(0,1fr)_auto]' : ''">
          <button
            type="button"
            class="inline-flex h-14 items-center justify-center gap-2 rounded border-2 px-3 font-bold disabled:opacity-50"
            :class="copie ? 'border-on-marker bg-marker text-on-marker' : 'border-ink bg-ink text-paper'"
            :disabled="!resultat"
            @click="copier"
          >
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" /><path d="M15 9V4H4v11h5" /></svg>
            {{ copie ? 'Copié' : 'Copier le résultat' }}
          </button>
          <button
            v-if="partageDisponible"
            type="button"
            class="inline-flex h-14 items-center justify-center gap-2 rounded border-2 border-ink bg-paper px-3 font-bold disabled:opacity-50"
            :disabled="!resultat"
            @click="partager"
          >
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15V3M7 8l5-5 5 5M5 13v8h14v-8" /></svg>
            Partager
          </button>
        </div>
      </section>
      <Avertissement class="hidden lg:flex" />
    </div>

    <Avertissement class="order-5 lg:hidden" />
  </div>
</template>
