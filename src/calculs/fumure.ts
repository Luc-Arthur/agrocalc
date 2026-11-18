// Dose d'engrais commercial (formule N-P-K) et compléments en engrais simples
import { formaterCourt, lireNombre } from './format'

export const nutriments = ['n', 'p', 'k'] as const
export type Nutriment = (typeof nutriments)[number]
export type Npk = Record<Nutriment, number>

/** Comme sur l'étiquette : le phosphore et le potassium sont exprimés en P₂O₅ et K₂O */
export const nomsNutriments: Record<Nutriment, string> = { n: 'N', p: 'P₂O₅', k: 'K₂O' }

/** Engrais simples utilisés pour compléter ce que la formule n'apporte pas */
export const engraisSimples: Record<Nutriment, { nom: string; teneur: number }> = {
  n: { nom: 'Urée', teneur: 45 },
  p: { nom: 'Superphosphate triple', teneur: 46 },
  k: { nom: 'Chlorure de potassium', teneur: 60 },
}

export interface DonneesFumure {
  /** Besoins de la culture, en kg/ha de N, P₂O₅ et K₂O */
  besoins: Npk
  /** Teneurs de la formule, en % (04-14-08 → 4, 14, 8) ; null si la saisie est illisible */
  formule: Npk | null
}

export interface ResultatFumure {
  /** Engrais commercial à apporter, en kg/ha (0 si la formule ne couvre aucun besoin) */
  dose: number
  /** Nutriment qui fixe la dose, null si la formule ne couvre aucun besoin */
  limitant: Nutriment | null
  /** Dose qui couvrirait chaque besoin à lui seul, en kg/ha */
  dosesParNutriment: Partial<Npk>
  /** Ce que la dose apporte, en kg/ha */
  apports: Npk
  /** Ce qui manque encore, en kg/ha */
  manques: Npk
  /** Ce qui est apporté au-delà du besoin, en kg/ha */
  exces: Npk
  /** Engrais simples à ajouter pour combler les manques, en kg/ha */
  complements: Npk
}

/** Erreurs par champ : n, p, k pour les besoins ; « besoins » si tous sont nuls */
export type ErreursFumure = Partial<Record<Nutriment | 'besoins' | 'formule', string>>

/** Lit une formule comme sur le sac : « 04-14-08 », « 4-14-8 », « 5 20 20 ». */
export function lireFormule(saisie: string): Npk | null {
  const parties = saisie.trim().split(/\s*[-–/]\s*|\s+/)
  if (parties.length !== 3) return null
  const [n, p, k] = parties.map((partie) => lireNombre(partie))
  if (![n, p, k].every((v) => Number.isFinite(v) && v >= 0)) return null
  return { n, p, k }
}

/** Écrit une formule comme sur le sac : { 4, 14, 8 } → « 04-14-08 ». */
export function formaterFormule(f: Npk): string {
  return nutriments.map((x) => (Number.isInteger(f[x]) ? String(f[x]).padStart(2, '0') : formaterCourt(f[x], 1))).join('-')
}

export function verifierFumure(d: DonneesFumure): ErreursFumure {
  const erreurs: ErreursFumure = {}
  for (const x of nutriments) {
    if (!Number.isFinite(d.besoins[x]) || d.besoins[x] < 0) erreurs[x] = 'Entrez un besoin de 0 ou plus.'
  }
  if (!erreurs.n && !erreurs.p && !erreurs.k && nutriments.every((x) => d.besoins[x] === 0)) {
    erreurs.besoins = 'Entrez au moins un besoin supérieur à 0.'
  }

  const f = d.formule
  if (!f) erreurs.formule = 'Écrivez la formule comme sur le sac : 04-14-08.'
  else if (f.n + f.p + f.k > 100) erreurs.formule = 'Les trois teneurs dépassent 100 % au total.'
  else if (f.n + f.p + f.k === 0) erreurs.formule = "Cette formule n'apporte aucun nutriment."
  return erreurs
}

// Écarte les restes d'arrondi (1e-14 kg/ha) pour ne pas afficher de complément fantôme
const net = (v: number) => (v > 1e-9 ? v : 0)

/**
 * Pour chaque nutriment : kg/ha = besoin × 100 ÷ teneur.
 * On garde la plus petite de ces doses : elle couvre un besoin entièrement sans dépasser les autres.
 * Les manques sont ensuite comblés par des engrais simples. Renvoie null si une donnée est invalide.
 */
export function calculerFumure(d: DonneesFumure): ResultatFumure | null {
  if (Object.keys(verifierFumure(d)).length > 0 || !d.formule) return null
  const { besoins, formule } = d

  const dosesParNutriment: Partial<Npk> = {}
  let limitant: Nutriment | null = null
  for (const x of nutriments) {
    if (besoins[x] <= 0 || formule[x] <= 0) continue
    const dose = (besoins[x] * 100) / formule[x]
    dosesParNutriment[x] = dose
    if (limitant === null || dose < dosesParNutriment[limitant]!) limitant = x
  }
  const dose = limitant ? dosesParNutriment[limitant]! : 0

  const pour = (calcul: (x: Nutriment) => number): Npk => ({ n: calcul('n'), p: calcul('p'), k: calcul('k') })
  const apports = pour((x) => (dose * formule[x]) / 100)
  const manques = pour((x) => net(besoins[x] - apports[x]))
  const exces = pour((x) => net(apports[x] - besoins[x]))
  const complements = pour((x) => (manques[x] * 100) / engraisSimples[x].teneur)

  return { dose, limitant, dosesParNutriment, apports, manques, exces, complements }
}

/** Formules courantes au Brésil, pour remplir le champ d'un geste */
export const formulesCourantes = ['04-14-08', '05-20-20', '00-20-20', '08-28-16']
