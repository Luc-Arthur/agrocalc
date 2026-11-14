import { describe, expect, it } from 'vitest'
import { calculerSemis, verifierSemis } from './semis'
import { formater, lireNombre } from './format'

const soja = { population: 300_000, ecartement: 45, pmg: 180, germination: 85, purete: 98 }

describe('calculerSemis', () => {
  it('donne 64,8 kg/ha pour le soja de référence', () => {
    const r = calculerSemis(soja)!
    expect(r.kgParHectare).toBeCloseTo(64.83, 2)
  })

  it('donne 13,5 plantes et environ 16 graines par mètre de rang', () => {
    const r = calculerSemis(soja)!
    expect(r.plantesParMetre).toBeCloseTo(13.5, 5)
    expect(Math.round(r.grainesParMetre)).toBe(16)
  })

  it('avec 100 % de germination et de pureté, kg/ha = plantes/ha × PMG ÷ 1 000 000', () => {
    const r = calculerSemis({ ...soja, germination: 100, purete: 100 })!
    expect(r.kgParHectare).toBeCloseTo(54, 5)
  })

  it('refuse une germination au-dessus de 100 %', () => {
    expect(calculerSemis({ ...soja, germination: 120 })).toBeNull()
    expect(verifierSemis({ ...soja, germination: 120 }).germination).toBeDefined()
  })

  it('refuse une valeur vide ou nulle', () => {
    expect(calculerSemis({ ...soja, pmg: Number.NaN })).toBeNull()
    expect(calculerSemis({ ...soja, population: 0 })).toBeNull()
  })
})

describe('lireNombre et formater', () => {
  it('lit les espaces de milliers et la virgule décimale', () => {
    expect(lireNombre('300 000')).toBe(300_000)
    expect(lireNombre('0,85')).toBe(0.85)
    expect(lireNombre('')).toBeNaN()
    expect(lireNombre('abc')).toBeNaN()
  })

  it('formate en français', () => {
    expect(formater(64.83, 1)).toBe('64,8')
    expect(formater(300_000).replace(/\s/g, ' ')).toBe('300 000')
  })
})
