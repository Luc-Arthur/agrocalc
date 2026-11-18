import { describe, expect, it } from 'vitest'
import { formaterDuree } from './format'
import { calculerIrrigation, systemes } from './irrigation'

// ET₀ 5 mm/jour, soja en floraison, arrosage tous les 3 jours par aspersion
const parcelle = { et0: 5, kc: 1.15, intervalle: 3, pluie: 0, ...systemes.aspersion }

describe('calculerIrrigation', () => {
  it('donne un besoin de 5,75 mm/jour, soit 17,25 mm sur 3 jours', () => {
    const r = calculerIrrigation(parcelle)!
    expect(r.etc).toBeCloseTo(5.75, 10)
    expect(r.consommation).toBeCloseTo(17.25, 10)
  })

  it('corrige par l\'efficacité : 17,25 mm à 80 % = 21,56 mm à appliquer, soit 215,6 m³/ha', () => {
    const r = calculerIrrigation(parcelle)!
    expect(r.lameBrute).toBeCloseTo(21.5625, 10)
    expect(r.volumeHa).toBeCloseTo(215.625, 10)
  })

  it('arrose 2 h 04 avec des asperseurs de 1 500 L/h en 12 × 12 m (10,4 mm/h)', () => {
    const r = calculerIrrigation(parcelle)!
    expect(r.intensite).toBeCloseTo(10.4167, 4)
    expect(formaterDuree(r.duree)).toBe('2 h 04')
  })

  it('déduit la pluie, et n\'arrose pas si elle couvre le besoin', () => {
    expect(calculerIrrigation({ ...parcelle, pluie: 10 })!.lameNette).toBeCloseTo(7.25, 10)
    const r = calculerIrrigation({ ...parcelle, pluie: 25 })!
    expect(r.lameBrute).toBe(0)
    expect(r.inutile).toBe(true)
  })

  it('calcule l\'intensité du goutte-à-goutte : 1,6 L/h tous les 0,3 m, lignes à 1 m', () => {
    expect(calculerIrrigation({ ...parcelle, ...systemes.goutteAGoutte })!.intensite).toBeCloseTo(5.333, 3)
  })

  it('refuse une efficacité nulle ou un débit vide', () => {
    expect(calculerIrrigation({ ...parcelle, efficacite: 0 })).toBeNull()
    expect(calculerIrrigation({ ...parcelle, debit: Number.NaN })).toBeNull()
  })
})

describe('formaterDuree', () => {
  it('écrit les minutes seules sous une heure', () => {
    expect(formaterDuree(0.69)).toBe('41 min')
    expect(formaterDuree(1)).toBe('1 h 00')
  })
})
