// Calcul de la quantité de semences à semer par hectare

export interface DonneesSemis {
  /** Population visée, en plantes par hectare */
  population: number
  /** Écartement entre rangs, en cm */
  ecartement: number
  /** Poids de mille grains, en g */
  pmg: number
  /** Taux de germination, en % */
  germination: number
  /** Pureté du lot, en % */
  purete: number
}

export interface ResultatSemis {
  /** Semences à prévoir, en kg/ha */
  kgParHectare: number
  /** Plantes visées par mètre de rang */
  plantesParMetre: number
  /** Graines à semer par mètre de rang (corrigé par la germination) */
  grainesParMetre: number
  /** Part de semences viables (germination × pureté), entre 0 et 1 */
  partViable: number
}

export type ErreursSemis = Partial<Record<keyof DonneesSemis, string>>

/** Vérifie les données et renvoie un message par champ invalide. */
export function verifierSemis(d: DonneesSemis): ErreursSemis {
  const erreurs: ErreursSemis = {}
  const positif = (v: number) => Number.isFinite(v) && v > 0
  if (!positif(d.population)) erreurs.population = 'Entrez une population supérieure à 0.'
  if (!positif(d.ecartement)) erreurs.ecartement = 'Entrez un écartement supérieur à 0.'
  if (!positif(d.pmg)) erreurs.pmg = 'Entrez un poids supérieur à 0.'
  for (const champ of ['germination', 'purete'] as const) {
    const v = d[champ]
    if (!Number.isFinite(v) || v <= 0 || v > 100) erreurs[champ] = 'Entrez un pourcentage entre 1 et 100.'
  }
  return erreurs
}

/**
 * kg/ha = (plantes/ha × PMG) ÷ (1 000 000 × germination × pureté)
 * Le PMG est en grammes pour 1 000 grains : plantes/ha × PMG ÷ 1 000 donne des grammes,
 * puis ÷ 1 000 donne des kilogrammes, d'où le facteur 1 000 000.
 * Renvoie null si une donnée est invalide.
 */
export function calculerSemis(d: DonneesSemis): ResultatSemis | null {
  if (Object.keys(verifierSemis(d)).length > 0) return null

  const g = d.germination / 100
  const p = d.purete / 100
  const partViable = g * p
  const kgParHectare = (d.population * d.pmg) / (1_000_000 * partViable)

  // Longueur de rang dans un hectare : 10 000 m² ÷ écartement (m)
  const plantesParMetre = (d.population * (d.ecartement / 100)) / 10_000
  // Au champ, on compte des graines (déjà pures) : on corrige seulement par la germination
  const grainesParMetre = plantesParMetre / g

  return { kgParHectare, plantesParMetre, grainesParMetre, partViable }
}

/** Valeurs typiques par culture, à ajuster selon la variété et la région. */
export const cultures = {
  soja: { nom: 'Soja', population: 300_000, ecartement: 45, pmg: 180 },
  milho: { nom: 'Maïs', population: 65_000, ecartement: 50, pmg: 350 },
  feijao: { nom: 'Haricot', population: 240_000, ecartement: 45, pmg: 250 },
  trigo: { nom: 'Blé', population: 3_300_000, ecartement: 17, pmg: 35 },
} as const

export type Culture = keyof typeof cultures
