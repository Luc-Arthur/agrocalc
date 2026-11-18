// Conversions de surface et de rendement

export const unitesSurface = {
  ha: { nom: 'Hectare', pluriel: 'hectares', symbole: 'ha', m2: 10_000 },
  m2: { nom: 'Mètre carré', pluriel: 'mètres carrés', symbole: 'm²', m2: 1 },
  alqueirePaulista: { nom: 'Alqueire paulista', pluriel: 'alqueires paulistas', symbole: 'alq. SP', m2: 24_200 },
  alqueireMineiro: { nom: 'Alqueire mineiro', pluriel: 'alqueires mineiros', symbole: 'alq. MG', m2: 48_400 },
  acre: { nom: 'Acre', pluriel: 'acres', symbole: 'acre', m2: 4_046.856_422_4 },
} as const
export type UniteSurface = keyof typeof unitesSurface

/** Terrain de football aux dimensions FIFA : 105 × 68 m */
export const TERRAIN_FOOTBALL_M2 = 105 * 68

export function convertirSurface(valeur: number, de: UniteSurface, vers: UniteSurface): number {
  return (valeur * unitesSurface[de].m2) / unitesSurface[vers].m2
}

export const unitesRendement = {
  scHa: { nom: 'Sacs par hectare', symbole: 'sc/ha' },
  kgHa: { nom: 'Kilos par hectare', symbole: 'kg/ha' },
  tHa: { nom: 'Tonnes par hectare', symbole: 't/ha' },
} as const
export type UniteRendement = keyof typeof unitesRendement

/** Masse d'une unité de rendement, en kg/ha ; le sac dépend de la culture (60 kg, 50 kg…) */
function kgParUnite(unite: UniteRendement, poidsSac: number): number {
  return unite === 'scHa' ? poidsSac : unite === 'tHa' ? 1000 : 1
}

export function convertirRendement(valeur: number, de: UniteRendement, vers: UniteRendement, poidsSac: number): number {
  return (valeur * kgParUnite(de, poidsSac)) / kgParUnite(vers, poidsSac)
}

/** Poids de sac courants au Brésil */
export const poidsSacs = [
  { kg: 60, cultures: 'soja, maïs, blé, café' },
  { kg: 50, cultures: 'riz' },
]

export function verifierValeur(valeur: number): string | undefined {
  return Number.isFinite(valeur) && valeur > 0 ? undefined : 'Entrez un nombre supérieur à 0.'
}
