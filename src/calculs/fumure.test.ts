import { describe, expect, it } from 'vitest'
import { calculerFumure, formaterFormule, lireFormule, verifierFumure } from './fumure'

const f041408 = { n: 4, p: 14, k: 8 }

describe('lireFormule', () => {
  it('lit les écritures courantes', () => {
    expect(lireFormule('04-14-08')).toEqual(f041408)
    expect(lireFormule('4-14-8')).toEqual(f041408)
    expect(lireFormule(' 4 14 8 ')).toEqual(f041408)
    expect(lireFormule('4/14/8')).toEqual(f041408)
  })

  it('refuse une formule incomplète ou illisible', () => {
    expect(lireFormule('04-14')).toBeNull()
    expect(lireFormule('04-14-08-02')).toBeNull()
    expect(lireFormule('NPK')).toBeNull()
    expect(lireFormule('')).toBeNull()
  })

  it('réécrit la formule comme sur le sac', () => {
    expect(formaterFormule(f041408)).toBe('04-14-08')
    expect(formaterFormule({ n: 10, p: 0, k: 20 })).toBe('10-00-20')
  })
})

describe('calculerFumure', () => {
  it('donne 500 kg/ha de 04-14-08 pour 40-70-60, le P₂O₅ fixant la dose', () => {
    const r = calculerFumure({ besoins: { n: 40, p: 70, k: 60 }, formule: f041408 })!
    expect(r.dose).toBeCloseTo(500, 5)
    expect(r.limitant).toBe('p')
    expect(r.dosesParNutriment.n).toBeCloseTo(1000, 5)
    expect(r.dosesParNutriment.k).toBeCloseTo(750, 5)
    expect(r.apports).toEqual({ n: 20, p: 70, k: 40 })
  })

  it('complète les manques avec de l\'urée et du chlorure de potassium', () => {
    const r = calculerFumure({ besoins: { n: 40, p: 70, k: 60 }, formule: f041408 })!
    expect(r.manques.p).toBe(0)
    expect(r.complements.n).toBeCloseTo((20 * 100) / 45, 5)
    expect(r.complements.p).toBe(0)
    expect(r.complements.k).toBeCloseTo((20 * 100) / 60, 5)
  })

  it('signale l\'azote apporté en trop quand la culture n\'en demande pas (soja)', () => {
    const r = calculerFumure({ besoins: { n: 0, p: 80, k: 80 }, formule: f041408 })!
    expect(r.limitant).toBe('p')
    expect(r.dose).toBeCloseTo(571.43, 2)
    expect(r.exces.n).toBeCloseTo(22.86, 2)
    expect(r.complements.k).toBeCloseTo(57.14, 2)
  })

  it('passe tout par les engrais simples si la formule ne couvre aucun besoin', () => {
    const r = calculerFumure({ besoins: { n: 90, p: 0, k: 0 }, formule: { n: 0, p: 20, k: 20 } })!
    expect(r.dose).toBe(0)
    expect(r.limitant).toBeNull()
    expect(r.complements.n).toBeCloseTo(200, 5)
  })

  it('refuse des besoins tous nuls, une formule illisible ou au-delà de 100 %', () => {
    expect(verifierFumure({ besoins: { n: 0, p: 0, k: 0 }, formule: f041408 }).besoins).toBeTruthy()
    expect(calculerFumure({ besoins: { n: 40, p: 70, k: 60 }, formule: null })).toBeNull()
    expect(verifierFumure({ besoins: { n: 40, p: 70, k: 60 }, formule: { n: 50, p: 40, k: 20 } }).formule).toBeTruthy()
    expect(calculerFumure({ besoins: { n: -1, p: 70, k: 60 }, formule: f041408 })).toBeNull()
  })
})
