import { describe, expect, it } from 'vitest'
import { shuffledCycleIndex, shuffle } from './questionFlow'

describe('questionFlow', () => {
  it('preserva todos os itens ao embaralhar', () => {
    const items = ['a', 'b', 'c', 'd']
    expect(shuffle(items).sort()).toEqual(items.sort())
  })

  it('retorna sempre um índice válido no ciclo', () => {
    for (let step = 0; step < 30; step += 1) {
      expect(shuffledCycleIndex(5, step, 'test')).toBeGreaterThanOrEqual(0)
      expect(shuffledCycleIndex(5, step, 'test')).toBeLessThan(5)
    }
  })

  it('é determinístico para a mesma semente e etapa', () => {
    expect(shuffledCycleIndex(8, 13, 'test')).toBe(shuffledCycleIndex(8, 13, 'test'))
  })
})
