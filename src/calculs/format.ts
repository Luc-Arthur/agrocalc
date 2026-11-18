// Lecture et affichage des nombres au format local (virgule décimale, espace fine pour les milliers)

/** Convertit une saisie (« 300 000 », « 0,85 ») en nombre. Renvoie NaN si la saisie est vide ou invalide. */
export function lireNombre(saisie: string): number {
  const nettoyee = saisie.replace(/[\s  ]/g, '').replace(',', '.')
  if (nettoyee === '' || !/^-?\d*\.?\d+$/.test(nettoyee)) return Number.NaN
  return Number(nettoyee)
}

/** Formate un nombre en français : 64,8 ; 300 000. */
export function formater(valeur: number, decimales = 0, locale = 'fr-FR'): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(valeur)
}

/** Comme formater, mais sans zéros inutiles : 3,75 · 10 · 0,5 */
export function formaterCourt(valeur: number, decimalesMax = 2, locale = 'fr-FR'): string {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: decimalesMax }).format(valeur)
}
