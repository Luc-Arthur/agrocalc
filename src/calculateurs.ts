// Liste des calculateurs : utilisée par le menu, l'accueil et les pages
export interface Calculateur {
  slug: string
  index: string
  titre: string
  description: string
  unite: string
  formule: string
  disponible: boolean
}

export const calculateurs: Calculateur[] = [
  {
    slug: 'semis',
    index: '01',
    titre: 'Semis',
    description: 'kg de semences par hectare',
    unite: 'kg/ha',
    formule: 'kg/ha = (pl/ha × PMG) ÷ (10⁶ × G × P)',
    disponible: true,
  },
  {
    slug: 'chaulage',
    index: '02',
    titre: 'Chaulage',
    description: 't de calcaire par hectare · saturation par bases',
    unite: 't/ha',
    formule: 'NC = (V₂ − V₁) × CTC ÷ PRNT',
    disponible: true,
  },
  {
    slug: 'fumure',
    index: '03',
    titre: 'Fumure NPK',
    description: "kg d'engrais commercial par hectare, ex. 04-14-08",
    unite: 'kg/ha',
    formule: 'kg/ha = besoin (kg/ha) × 100 ÷ teneur (%)',
    disponible: true,
  },
  {
    slug: 'conversions',
    index: '04',
    titre: 'Conversions',
    description: 'hectare, m², alqueire, sacs par hectare',
    unite: 'ha ⇄ m²',
    formule: '1 ha = 10 000 m² · 1 sc = 60 kg',
    disponible: false,
  },
]
