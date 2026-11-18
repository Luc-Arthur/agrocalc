// Besoin en eau d'une culture (méthode FAO-56) et temps d'arrosage

export interface DonneesIrrigation {
  /** Évapotranspiration de référence, en mm/jour */
  et0: number
  /** Coefficient cultural, selon le stade de la culture */
  kc: number
  /** Jours entre deux arrosages */
  intervalle: number
  /** Pluie utile tombée sur l'intervalle, en mm (0 si aucune) */
  pluie: number
  /** Efficacité du système d'irrigation, en % */
  efficacite: number
  /** Débit d'un émetteur (asperseur, goutteur…), en L/h */
  debit: number
  /** Espacement entre émetteurs sur la ligne, en m */
  espacementLigne: number
  /** Espacement entre lignes, en m */
  espacementEntreLignes: number
}

export interface ResultatIrrigation {
  /** Besoin de la culture, en mm/jour */
  etc: number
  /** Eau consommée par la culture sur l'intervalle, en mm */
  consommation: number
  /** Eau à apporter à la plante (après la pluie), en mm */
  lameNette: number
  /** Eau à appliquer en tenant compte des pertes du système, en mm */
  lameBrute: number
  /** Hauteur d'eau appliquée par heure, en mm/h */
  intensite: number
  /** Temps d'arrosage, en heures */
  duree: number
  /** Volume d'eau par arrosage, en m³/ha */
  volumeHa: number
  /** Vrai si la pluie couvre déjà le besoin de l'intervalle */
  inutile: boolean
}

export type ErreursIrrigation = Partial<Record<keyof DonneesIrrigation, string>>

export function verifierIrrigation(d: DonneesIrrigation): ErreursIrrigation {
  const erreurs: ErreursIrrigation = {}
  const positif = (v: number) => Number.isFinite(v) && v > 0
  if (!positif(d.et0) || d.et0 > 20) erreurs.et0 = 'Entrez une ET₀ entre 0 et 20 mm/jour.'
  if (!positif(d.kc) || d.kc > 2) erreurs.kc = 'Entrez un Kc entre 0 et 2.'
  if (!positif(d.intervalle)) erreurs.intervalle = 'Entrez un nombre de jours supérieur à 0.'
  if (!Number.isFinite(d.pluie) || d.pluie < 0) erreurs.pluie = 'Entrez une pluie de 0 mm ou plus.'
  if (!positif(d.efficacite) || d.efficacite > 100) erreurs.efficacite = 'Entrez une efficacité entre 1 et 100 %.'
  if (!positif(d.debit)) erreurs.debit = 'Entrez un débit supérieur à 0.'
  if (!positif(d.espacementLigne)) erreurs.espacementLigne = 'Entrez un espacement supérieur à 0.'
  if (!positif(d.espacementEntreLignes)) erreurs.espacementEntreLignes = 'Entrez un espacement supérieur à 0.'
  return erreurs
}

/**
 * ETc (mm/jour) = ET₀ × Kc
 * Lame brute (mm) = (ETc × jours − pluie) ÷ efficacité
 * Intensité (mm/h) = débit (L/h) ÷ surface par émetteur (m²), car 1 L sur 1 m² = 1 mm
 * Durée (h) = lame brute ÷ intensité. Renvoie null si une donnée est invalide.
 */
export function calculerIrrigation(d: DonneesIrrigation): ResultatIrrigation | null {
  if (Object.keys(verifierIrrigation(d)).length > 0) return null

  const etc = d.et0 * d.kc
  const consommation = etc * d.intervalle
  const lameNette = Math.max(0, consommation - d.pluie)
  const lameBrute = (lameNette * 100) / d.efficacite
  const intensite = d.debit / (d.espacementLigne * d.espacementEntreLignes)

  return {
    etc,
    consommation,
    lameNette,
    lameBrute,
    intensite,
    duree: lameBrute / intensite,
    // 1 mm sur 1 ha = 10 m³
    volumeHa: lameBrute * 10,
    inutile: lameNette === 0,
  }
}

/** Installations types, pour remplir les champs d'un geste */
export const systemes = {
  aspersion: { nom: 'Aspersion', efficacite: 80, debit: 1500, espacementLigne: 12, espacementEntreLignes: 12 },
  microaspersion: { nom: 'Micro-aspersion', efficacite: 85, debit: 50, espacementLigne: 4, espacementEntreLignes: 4 },
  goutteAGoutte: { nom: 'Goutte-à-goutte', efficacite: 90, debit: 1.6, espacementLigne: 0.3, espacementEntreLignes: 1 },
} as const
export type Systeme = keyof typeof systemes

/** Kc indicatifs par stade (FAO-56, grandes cultures annuelles) */
export const stades = [
  { nom: 'levée', kc: 0.4 },
  { nom: 'croissance', kc: 0.8 },
  { nom: 'floraison', kc: 1.15 },
  { nom: 'maturité', kc: 0.5 },
]
