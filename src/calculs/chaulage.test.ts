import { describe, expect, it } from 'vitest'
import { calculerChaulage } from './chaulage'

const sol = { v1: 40, v2: 70, ctc: 10, prnt: 80 }

describe('calculerChaulage', () => {
  it('donne 3,75 t/ha pour V₁ 40 %, V₂ 70 %, CTC 10 et PRNT 80 %', () => {
    const r = calculerChaulage(sol)!
    expect(r.tHa).toBeCloseTo(3.75, 5)
    expect(r.tHaPur).toBeCloseTo(3, 5)
    expect(r.inutile).toBe(false)
  })

  it('ne demande rien si le sol est déjà à la saturation visée', () => {
    const r = calculerChaulage({ ...sol, v1: 75 })!
    expect(r.tHa).toBe(0)
    expect(r.inutile).toBe(true)
  })

  it('accepte une saturation actuelle de 0 %', () => {
    expect(calculerChaulage({ ...sol, v1: 0 })!.tHa).toBeCloseTo(8.75, 5)
  })

  it('refuse un PRNT nul ou une CTC vide', () => {
    expect(calculerChaulage({ ...sol, prnt: 0 })).toBeNull()
    expect(calculerChaulage({ ...sol, ctc: Number.NaN })).toBeNull()
  })
})
