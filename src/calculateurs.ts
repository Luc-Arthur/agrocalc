// Liste des calculateurs de l'application (utilisée par le menu et l'accueil)
export interface Calculateur {
  slug: string
  titre: string
  description: string
  unite: string
  disponible: boolean
}

export const calculateurs: Calculateur[] = [
  {
    slug: 'semis',
    titre: 'Semis',
    description: 'Quantité de semences à prévoir selon la densité visée, le poids de mille grains et la germination.',
    unite: 'kg/ha',
    disponible: false,
  },
  {
    slug: 'chaulage',
    titre: 'Chaulage',
    description: 'Besoin en calcaire par la méthode de saturation par bases, corrigé par le PRNT du produit.',
    unite: 't/ha',
    disponible: false,
  },
  {
    slug: 'fumure',
    titre: 'Fumure NPK',
    description: "Quantité d'engrais commercial (ex. 04-14-08) pour couvrir les besoins de la culture.",
    unite: 'kg/ha',
    disponible: false,
  },
  {
    slug: 'conversions',
    titre: 'Conversions',
    description: 'Hectare, mètre carré, alqueire, sacs par hectare : passez d’une unité à l’autre.',
    unite: 'ha ⇄ alq',
    disponible: false,
  },
]
