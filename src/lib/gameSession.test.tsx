// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it } from 'vitest'
import { clearGameSession, GameSession, hasGameSession, useGameState } from './gameSession'

function defineWrapper(gameId: 'math' | 'quiz') {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <GameSession gameId={gameId}>{children}</GameSession>
  }
}

describe('gameSession', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('restaura um estado por sua chave semântica', () => {
    const wrapper = defineWrapper('math')
    const first = renderHook(() => useGameState(0, 'score'), { wrapper })

    act(() => first.result.current[1](7))
    first.unmount()

    const restored = renderHook(() => useGameState(0, 'score'), { wrapper })
    expect(restored.result.current[0]).toBe(7)
    expect(hasGameSession('math')).toBe(true)
  })

  it('preserva valores null salvos', () => {
    const wrapper = defineWrapper('math')
    const first = renderHook(() => useGameState<string | null>('answer', 'answer'), { wrapper })

    act(() => first.result.current[1](null))
    first.unmount()

    const restored = renderHook(() => useGameState<string | null>('fallback', 'answer'), { wrapper })
    expect(restored.result.current[0]).toBeNull()
  })

  it('isola o mesmo slot entre jogos diferentes', () => {
    const math = renderHook(() => useGameState(0, 'score'), { wrapper: defineWrapper('math') })
    const quiz = renderHook(() => useGameState(0, 'score'), { wrapper: defineWrapper('quiz') })

    act(() => math.result.current[1](3))
    act(() => quiz.result.current[1](8))

    expect(math.result.current[0]).toBe(3)
    expect(quiz.result.current[0]).toBe(8)
  })

  it('remove todos os estados do jogo solicitado', () => {
    const wrapper = defineWrapper('math')
    const hook = renderHook(() => useGameState(0, 'score'), { wrapper })
    act(() => hook.result.current[1](4))

    clearGameSession('math')
    const restored = renderHook(() => useGameState(0, 'score'), { wrapper })

    expect(restored.result.current[0]).toBe(0)
    expect(hasGameSession('math')).toBe(false)
  })
})
