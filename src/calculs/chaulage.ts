// Calcul du besoin en calcaire, méthode de la saturation par bases

export interface DonneesChaulage {
  /** Saturation par bases actuelle (ligne « V % » de l'analyse), en % */
  v1: number
  /** Saturation par bases visée, en % */
  v2: number
  /** CTC à pH 7 (aussi notée « T »), en cmolc/dm³ */
  ctc: number
  /** PRNT du calcaire, en % */
  prnt: number
}

export interface ResultatChaulage {
  /** Calcaire commercial à apporter, en t/ha (couche 0–20 cm) */
  tHa: number
  /** Équivalent pour un calcaire à PRNT 100 %, en t/ha */
  tHaPur: number
  /** Vrai si le sol est déjà à la saturation visée */
  inutile: boolean
}

export type ErreursChaulage = Partial<Record<keyof DonneesChaulage, string>>

export function verifierChaulage(d: DonneesChaulage): ErreursChaulage {
  const erreurs: ErreursChaulage = {}
  // Un sol peut avoir une saturation de 0 %
  if (!Number.isFinite(d.v1) || d.v1 < 0 || d.v1 > 100) erreurs.v1 = 'Entrez un pourcentage entre 0 et 100.'
  if (!Number.isFinite(d.v2) || d.v2 <= 0 || d.v2 > 100) erreurs.v2 = 'Entrez un pourcentage entre 1 et 100.'
  if (!Number.isFinite(d.ctc) || d.ctc <= 0) erreurs.ctc = 'Entrez une CTC supérieure à 0.'
  if (!Number.isFinite(d.prnt) || d.prnt <= 0 || d.prnt > 100) erreurs.prnt = 'Entrez un PRNT entre 1 et 100.'
  return erreurs
}

/**
 * NC (t/ha) = (V₂ − V₁) × CTC ÷ PRNT
 * Sur 0–20 cm, neutraliser 1 cmolc/dm³ demande environ 1 t/ha de calcaire pur :
 * (V₂ − V₁) % de la CTC donne la dose pure, que l'on divise par le PRNT du produit.
 * Jamais négatif : un sol déjà au niveau visé ne demande rien. Renvoie null si une donnée est invalide.
 */
export function calculerChaulage(d: DonneesChaulage): ResultatChaulage | null {
  if (Object.keys(verifierChaulage(d)).length > 0) return null
  const tHaPur = (Math.max(0, d.v2 - d.v1) * d.ctc) / 100
  return { tHaPur, tHa: (tHaPur * 100) / d.prnt, inutile: d.v2 <= d.v1 }
}
