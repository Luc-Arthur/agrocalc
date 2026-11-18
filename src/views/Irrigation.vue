<script setup lang="ts">
import { computed, reactive } from 'vue'
import Avertissement from '../components/calc/Avertissement.vue'
import BoutonCopier from '../components/calc/BoutonCopier.vue'
import ChampNombre from '../components/calc/ChampNombre.vue'
import EnTete from '../components/calc/EnTete.vue'
import ListeCalculateurs from '../components/calc/ListeCalculateurs.vue'
import Pluviometre from '../components/calc/Pluviometre.vue'
import { formater, formaterCourt, formaterDuree, lireNombre } from '../calculs/format'
import { calculerIrrigation, stades, systemes, verifierIrrigation, type Systeme } from '../calculs/irrigation'

// Valeurs de départ : une journée d'été, une culture en floraison, arrosée par aspersion tous les 3 jours
const saisie = reactive({
  et0: '5',
  kc: formaterCourt(1.15),
  intervalle: '3',
  pluie: '',
  efficacite: '',
  debit: '',
  espacementLigne: '',
  espacementEntreLignes: '',
  surface: '',
})

function choisirSysteme(s: Systeme) {
  const v = systemes[s]
  saisie.efficacite = formaterCourt(v.efficacite)
  saisie.debit = formaterCourt(v.debit)
  saisie.espacementLigne = formaterCourt(v.espacementLigne)
  saisie.espacementEntreLignes = formaterCourt(v.espacementEntreLignes)
}
function estChoisi(s: Systeme): boolean {
  const v = systemes[s]
  return (
    saisie.efficacite === formaterCourt(v.efficacite) &&
    saisie.debit === formaterCourt(v.debit) &&
    saisie.espacementLigne === formaterCourt(v.espacementLigne) &&
    saisie.espacementEntreLignes === formaterCourt(v.espacementEntreLignes)
  )
}
choisirSysteme('aspersion')

const donnees = computed(() => ({
  et0: lireNombre(saisie.et0),
  kc: lireNombre(saisie.kc),
  intervalle: lireNombre(saisie.intervalle),
  // La pluie est facultative : vide = pas de pluie
  pluie: saisie.pluie.trim() === '' ? 0 : lireNombre(saisie.pluie),
  efficacite: lireNombre(saisie.efficacite),
  debit: lireNombre(saisie.debit),
  espacementLigne: lireNombre(saisie.espacementLigne),
  espacementEntreLignes: lireNombre(saisie.espacementEntreLignes),
}))
const erreurs = computed(() => verifierIrrigation(donnees.value))
const resultat = computed(() => calculerIrrigation(donnees.value))

const surface = computed(() => lireNombre(saisie.surface))
// La surface est facultative : vide = pas de volume total
const erreurSurface = computed(() =>
  saisie.surface.trim() === '' || surface.value > 0 ? undefined : 'Entrez une surface supérieure à 0.',
)
const volumeTotal = computed(() =>
  resultat.value && saisie.surface.trim() !== '' && !erreurSurface.value ? resultat.value.volumeHa * surface.value : null,
)

const duree = computed(() => (resultat.value ? formaterDuree(resultat.value.duree) : '—'))
const jours = computed(() => {
  const n = donnees.value.intervalle
  return Number.isFinite(n) && n > 0 ? (n === 1 ? 'chaque jour' : `tous les ${formaterCourt(n, 1)} jours`) : ''
})

// Texte copié
const resume = computed(() => {
  const r = resultat.value
  if (!r) return ''
  const d = donnees.value
  return [
    r.inutile ? "Irrigation : pas d'arrosage nécessaire, la pluie couvre le besoin" : `Irrigation : ${duree.value} d'arrosage ${jours.value}`,
    `Besoin de la culture : ${formater(r.etc, 2)} mm/jour (ET₀ ${formaterCourt(d.et0, 1)} × Kc ${formaterCourt(d.kc)})`,
    r.inutile ? '' : `Lame brute ${formater(r.lameBrute, 1)} mm · intensité ${formater(r.intensite, 1)} mm/h · ${formater(r.volumeHa)} m³/ha`,
    volumeTotal.value !== null ? `Volume pour ${formaterCourt(surface.value)} ha : ${formater(volumeTotal.value)} m³` : '',
    'Calculé avec AgroCalc : https://luc-arthur.github.io/agrocalc/#/irrigation',
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
      <EnTete index="05" titre="Irrigation" sous-titre="Besoin en eau de la culture et temps d'arrosage" class="order-1 lg:order-none" />

      <!-- Vos données -->
      <section class="order-3 grid gap-7 lg:order-none" aria-labelledby="titre-donnees">
        <h2 id="titre-donnees" class="sr-only">Vos données</h2>

        <div>
          <h3 class="kicker mb-3">Climat et culture</h3>
          <div class="grid grid-cols-1 gap-[18px] lg:grid-cols-2 lg:gap-x-6 lg:gap-y-5">
            <ChampNombre id="et0" v-model="saisie.et0" label="Évapotranspiration de référence" aide="ET₀" unite="mm/jour" indication="Station météo ou bulletin agrométéo de la région." :erreur="erreurs.et0" />
            <ChampNombre id="intervalle" v-model="saisie.intervalle" label="Arrosage tous les" unite="jours" :erreur="erreurs.intervalle" />
            <div class="lg:col-span-2">
              <ChampNombre id="kc" v-model="saisie.kc" label="Coefficient cultural" aide="selon le stade" unite="Kc" :erreur="erreurs.kc" />
              <div class="mt-2 flex flex-wrap items-center gap-2" role="group" aria-label="Kc selon le stade">
                <button
                  v-for="s in stades"
                  :key="s.nom"
                  type="button"
                  class="chip-btn"
                  :aria-pressed="saisie.kc === formaterCourt(s.kc)"
                  @click="saisie.kc = formaterCourt(s.kc)"
                >{{ formaterCourt(s.kc) }} <span class="font-sans font-normal">{{ s.nom }}</span></button>
              </div>
            </div>
            <ChampNombre id="pluie" v-model="saisie.pluie" label="Pluie depuis le dernier arrosage" aide="facultatif" unite="mm" indication="Elle est déduite du besoin." :erreur="erreurs.pluie" class="lg:col-span-2" />
          </div>
        </div>

        <div>
          <h3 class="kicker mb-3">Votre installation</h3>
          <div class="mb-[18px] flex flex-wrap gap-2" role="group" aria-label="Type d'installation">
            <button v-for="(s, cle) in systemes" :key="cle" type="button" class="chip-btn !font-sans" :aria-pressed="estChoisi(cle)" @click="choisirSysteme(cle)">
              {{ s.nom }}
            </button>
          </div>
          <div class="grid grid-cols-1 gap-[18px] lg:grid-cols-2 lg:gap-x-6 lg:gap-y-5">
            <ChampNombre id="debit" v-model="saisie.debit" label="Débit par émetteur" unite="L/h" indication="Un asperseur ou un goutteur, voir sa fiche." :erreur="erreurs.debit" />
            <ChampNombre id="efficacite" v-model="saisie.efficacite" label="Efficacité du système" unite="%" :erreur="erreurs.efficacite" />
            <ChampNombre id="espacement-ligne" v-model="saisie.espacementLigne" label="Espacement sur la ligne" unite="m" :erreur="erreurs.espacementLigne" />
            <ChampNombre id="espacement-lignes" v-model="saisie.espacementEntreLignes" label="Espacement entre lignes" unite="m" :erreur="erreurs.espacementEntreLignes" />
            <ChampNombre id="surface" v-model="saisie.surface" label="Surface irriguée" aide="facultatif" unite="ha" indication="Pour connaître le volume total." :erreur="erreurSurface" class="lg:col-span-2" />
          </div>
        </div>
      </section>

      <!-- Formule -->
      <section class="order-4 border-2 border-ink bg-paper-2 p-5 lg:order-none" aria-labelledby="titre-formule">
        <h2 id="titre-formule" class="kicker">Formule</h2>
        <div class="mono mt-3 grid gap-1 border-[1.5px] border-line bg-paper px-3.5 py-3 text-base font-semibold leading-[26px] [overflow-wrap:anywhere]">
          <p>ETc = ET₀ × Kc</p>
          <p>lame brute = (ETc × jours − pluie) ÷ efficacité</p>
          <p>durée = lame brute ÷ intensité</p>
        </div>
        <ul v-if="resultat" class="mono mt-3 grid gap-1 text-base leading-[26px] text-ink-2 [overflow-wrap:anywhere]">
          <li>ETc = {{ formaterCourt(donnees.et0, 1) }} × {{ formaterCourt(donnees.kc) }} = {{ formater(resultat.etc, 2) }} mm/jour</li>
          <li>
            lame = ({{ formater(resultat.etc, 2) }} × {{ formaterCourt(donnees.intervalle, 1) }} − {{ formaterCourt(donnees.pluie, 1) }}) ÷
            {{ formaterCourt(donnees.efficacite / 100) }} = {{ formater(resultat.lameBrute, 1) }} mm
          </li>
          <li>
            intensité = {{ formaterCourt(donnees.debit) }} ÷ ({{ formaterCourt(donnees.espacementLigne) }} × {{ formaterCourt(donnees.espacementEntreLignes) }}) =
            {{ formater(resultat.intensite, 1) }} mm/h
          </li>
          <li v-if="!resultat.inutile">
            durée = {{ formater(resultat.lameBrute, 1) }} ÷ {{ formater(resultat.intensite, 1) }} =
            <b class="highlight font-semibold">{{ duree }}</b>
          </li>
        </ul>
        <p class="mt-3 text-base leading-6">
          La culture consomme chaque jour l'ET₀ du climat multipliée par son Kc, qui suit son stade : faible à la levée, maximal à la floraison.
          On arrose ce qu'elle a consommé depuis le dernier passage, moins la pluie, puis on majore pour les pertes du système.
          Un litre d'eau sur un mètre carré fait un millimètre : le débit d'un émetteur divisé par la surface qu'il couvre donne donc des mm/h.
        </p>
        <p class="mt-3 text-sm leading-5 text-ink-2">
          Kc indicatifs du bulletin FAO-56. En goutte-à-goutte, seule une partie du sol est mouillée : le calcul, fait sur toute la surface, est un majorant.
        </p>
      </section>
    </div>

    <!-- Résultat : au-dessus des champs sur mobile -->
    <div class="order-2 grid gap-4 lg:sticky lg:top-24 lg:order-none">
      <section class="panel p-5 lg:p-7" aria-live="polite" aria-labelledby="titre-resultat">
        <p class="flex justify-between gap-2">
          <span id="titre-resultat" class="kicker">Temps d'arrosage</span>
          <span class="kicker">{{ jours }}</span>
        </p>
        <p class="mt-3.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span
            class="mono -ml-1.5 inline-block -rotate-[0.6deg] rounded-[3px] bg-marker px-2.5 pb-1 pt-0.5 text-[64px] font-semibold leading-[64px] tracking-[-0.04em] text-on-marker lg:text-[88px] lg:leading-[88px]"
            >{{ resultat?.inutile ? '0 min' : duree }}</span
          >
          <span class="mono text-[22px] font-semibold lg:text-[26px]">
            <small class="block text-[15px] font-medium text-ink-2">par arrosage</small>
          </span>
        </p>

        <template v-if="resultat">
          <p v-if="resultat.inutile" class="mt-3 font-bold">Pas d'arrosage nécessaire : la pluie couvre le besoin de la période.</p>

          <p class="mt-[18px] border-t-[1.5px] border-dashed border-line pt-3.5 text-[17px]">
            <span class="mono mr-2 text-[28px] font-semibold">{{ formater(resultat.etc, 2) }}</span>
            mm/jour consommés par la culture
          </p>

          <dl v-if="!resultat.inutile" class="mt-4 border-t-[1.5px] border-dashed border-line">
            <div class="result-row">
              <dt>Lame à appliquer</dt>
              <dd class="mono text-lg font-semibold">{{ formater(resultat.lameBrute, 1) }} <span class="text-ink-2">mm</span></dd>
            </div>
            <div class="result-row">
              <dt>Intensité de l'installation</dt>
              <dd class="mono text-lg font-semibold">{{ formater(resultat.intensite, 1) }} <span class="text-ink-2">mm/h</span></dd>
            </div>
            <div class="result-row">
              <dt>Volume par hectare</dt>
              <dd class="mono text-lg font-semibold">{{ formater(resultat.volumeHa) }} <span class="text-ink-2">m³</span></dd>
            </div>
            <div v-if="volumeTotal !== null" class="result-row">
              <dt>Volume pour {{ formaterCourt(surface) }} ha</dt>
              <dd class="mono text-lg font-semibold">{{ formater(volumeTotal) }} <span class="text-ink-2">m³</span></dd>
            </div>
          </dl>

          <Pluviometre
            class="mt-5"
            :pluie="donnees.pluie"
            :lame-nette="resultat.lameNette"
            :lame-brute="resultat.lameBrute"
            :consommation="resultat.consommation"
            :jours="donnees.intervalle"
          />
        </template>

        <BoutonCopier class="mt-[18px]" :texte="resume" />
      </section>
      <Avertissement class="hidden lg:flex" />
    </div>

    <Avertissement class="order-5 lg:hidden" />
  </div>
</template>
