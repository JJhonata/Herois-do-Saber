// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest'
import { getGameMistakeCount, recordAnswer } from './review'

describe('review', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('conta somente respostas incorretas disponíveis para revisão', () => {
    recordAnswer('math', '1 + 1', '3', '2', false, 'Some novamente.')
    recordAnswer('math', '2 + 2', '4', '4', true, 'Muito bem.')
    recordAnswer('math', '3 + 3', '6', '6', true, 'Muito bem.')

    expect(getGameMistakeCount('math')).toBe(1)
  })
})
