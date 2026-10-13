// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest'
import { addStars, getLearningProgress, getStars, getTotalStars, getLastPlayedGame, getLearningStreak, setLastPlayedGame } from './progress'

describe('progress', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('inicia cada jogo sem estrelas', () => {
    expect(getStars('math')).toBe(0)
    expect(getTotalStars()).toBe(0)
  })

  it('acumula estrelas e atualiza os marcos', () => {
    addStars('math', 3)
    addStars('reading', 1)

    expect(getStars('math')).toBe(3)
    expect(getTotalStars()).toBe(4)
    expect(getLearningProgress().milestones.find(({ id }) => id === 'first-star')?.complete).toBe(true)
    expect(getLearningStreak()).toBe(1)
  })

  it('ignora valores inválidos e registra o último jogo', () => {
    addStars('math', 0)
    addStars('math', -2)
    addStars('math', Number.NaN)
    setLastPlayedGame('quiz')

    expect(getStars('math')).toBe(0)
    expect(getLastPlayedGame()).toBe('quiz')
  })
})
