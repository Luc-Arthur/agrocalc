import { describe, expect, it } from 'vitest'
import { convertirRendement, convertirSurface, TERRAIN_FOOTBALL_M2, verifierValeur } from './conversions'

describe('convertirSurface', () => {
  it('1 ha = 10 000 m²', () => {
    expect(convertirSurface(1, 'ha', 'm2')).toBe(10_000)
  })

  it('1 alqueire paulista = 2,42 ha et 1 alqueire mineiro = 2 alqueires paulistas', () => {
    expect(convertirSurface(1, 'alqueirePaulista', 'ha')).toBeCloseTo(2.42, 10)
    expect(convertirSurface(1, 'alqueireMineiro', 'alqueirePaulista')).toBeCloseTo(2, 10)
  })

  it('1 ha ≈ 2,471 acres, et l\'aller-retour redonne la valeur de départ', () => {
    expect(convertirSurface(1, 'ha', 'acre')).toBeCloseTo(2.4711, 4)
    expect(convertirSurface(convertirSurface(37.5, 'acre', 'alqueireMineiro'), 'alqueireMineiro', 'acre')).toBeCloseTo(37.5, 10)
  })

  it('1 ha ≈ 1,4 terrain de football', () => {
    expect(10_000 / TERRAIN_FOOTBALL_M2).toBeCloseTo(1.4, 1)
  })
})

describe('convertirRendement', () => {
  it('60 sacs de 60 kg/ha = 3 600 kg/ha = 3,6 t/ha', () => {
    expect(convertirRendement(60, 'scHa', 'kgHa', 60)).toBe(3600)
    expect(convertirRendement(60, 'scHa', 'tHa', 60)).toBeCloseTo(3.6, 10)
  })

  it('tient compte du poids du sac (riz, 50 kg)', () => {
    expect(convertirRendement(9, 'tHa', 'scHa', 50)).toBeCloseTo(180, 10)
  })
})

describe('verifierValeur', () => {
  it('refuse le vide, zéro et les négatifs', () => {
    expect(verifierValeur(Number.NaN)).toBeTruthy()
    expect(verifierValeur(0)).toBeTruthy()
    expect(verifierValeur(-2)).toBeTruthy()
    expect(verifierValeur(2.5)).toBeUndefined()
  })
})
