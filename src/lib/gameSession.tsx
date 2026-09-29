import { createContext, useCallback, useContext, useId, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import type { GameId } from './gameCatalog'

const KEY = 'herois_game_sessions_v1'
const GameSessionContext = createContext<GameId | null>(null)

type Sessions = Record<string, Record<string, unknown>>

function readSessions(): Sessions {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(KEY) || '{}')
    return value && typeof value === 'object' && !Array.isArray(value) ? value as Sessions : {}
  } catch { return {} }
}

function resolveInitial<T>(initial: T | (() => T)): T {
  return typeof initial === 'function' ? (initial as () => T)() : initial
}

function readSlot<T>(game: GameId, slot: string, initial: T): T {
  const saved = readSessions()[game]?.[slot]
  return saved === undefined ? initial : saved as T
}

function writeSlot<T>(game: GameId, slot: string, value: T) {
  try {
    const sessions = readSessions()
    sessions[game] = { ...sessions[game], [slot]: value }
    localStorage.setItem(KEY, JSON.stringify(sessions))
  } catch {}
}

export function GameSession({ gameId, children }: { gameId: GameId; children: ReactNode }) {
  return <GameSessionContext.Provider value={gameId}>{children}</GameSessionContext.Provider>
}

/** Behaves like useState while restoring and saving each game's React state in local storage. */
export function useGameState<T>(initial: T | (() => T)): [T, Dispatch<SetStateAction<T>>] {
  const gameId = useContext(GameSessionContext)
  const slot = useId()
  const [value, setValue] = useState<T>(() => {
    const initialValue = resolveInitial(initial)
    return gameId ? readSlot(gameId, slot, initialValue) : initialValue
  })
  const setPersistedValue = useCallback<Dispatch<SetStateAction<T>>>((next) => {
    setValue((current) => {
      const resolved = typeof next === 'function' ? (next as (previous: T) => T)(current) : next
      if (gameId) writeSlot(gameId, slot, resolved)
      return resolved
    })
  }, [gameId, slot])
  return [value, setPersistedValue]
}

export function clearGameSession(gameId: GameId) {
  try {
    const sessions = readSessions()
    delete sessions[gameId]
    localStorage.setItem(KEY, JSON.stringify(sessions))
  } catch {}
}

export function hasGameSession(gameId: GameId) {
  return Object.keys(readSessions()[gameId] || {}).length > 0
}
