import { describe, expect, it } from 'vitest'
import { gameAreas, gameCatalog, gameHints, gameLearnings } from './gameCatalog'

describe('gameCatalog', () => {
  it('mantém rotas e ids únicos para todas as atividades', () => {
    expect(new Set(gameCatalog.map(({ id }) => id)).size).toBe(gameCatalog.length)
    expect(new Set(gameCatalog.map(({ path }) => path)).size).toBe(gameCatalog.length)
    expect(gameCatalog.length).toBe(26)
  })

  it('mantém cada jogo associado a uma área, dica e aprendizagem', () => {
    for (const game of gameCatalog) {
      expect(gameAreas).toContain(game.area)
      expect(gameHints[game.id].length).toBeGreaterThan(20)
      expect(gameLearnings[game.id].length).toBeGreaterThan(30)
    }
  })
})
