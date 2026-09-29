import type { GameId } from './gameCatalog'

const KEY = 'herois_round_review_v1'

export type AnswerReview = {
  id: string
  question: string
  answer: string
  expected: string
  correct: boolean
  explanation: string
  at: number
}

type StoredGameReview = { attempts: AnswerReview[]; total: number }
type ReviewStore = Partial<Record<GameId, StoredGameReview>>

function read(): ReviewStore {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(KEY) || '{}')
    return data && typeof data === 'object' && !Array.isArray(data) ? data as ReviewStore : {}
  } catch { return {} }
}

export function getGameReview(game: GameId): AnswerReview[] {
  const records = read()[game]?.attempts
  return Array.isArray(records) ? records.slice(-50) : []
}

export function getGameReviewCount(game: GameId) {
  const total = read()[game]?.total
  return typeof total === 'number' ? total : 0
}

export function getGameRoundReview(game: GameId, round: number): AnswerReview[] {
  const stored = read()[game]
  if (!stored || round < 1) return []
  const offset = Math.max(0, stored.total - stored.attempts.length)
  const start = (round - 1) * 5 - offset
  return stored.attempts.slice(Math.max(0, start), Math.max(0, start) + 5)
}

export function recordAnswer(game: GameId, question: string, answer: string, expected: string, correct: boolean, explanation: string) {
  const store = read()
  const current = store[game] || { attempts: [], total: 0 }
  const attempt: AnswerReview = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    question: question.slice(0, 300),
    answer: answer.slice(0, 120),
    expected: expected.slice(0, 120),
    correct,
    explanation: explanation.slice(0, 240),
    at: Date.now(),
  }
  store[game] = { attempts: [...current.attempts, attempt].slice(-50), total: current.total + 1 }
  try { localStorage.setItem(KEY, JSON.stringify(store)) } catch {}
  window.dispatchEvent(new CustomEvent('review:update', { detail: { game } }))
}

export function clearGameReview(game: GameId) {
  const store = read()
  delete store[game]
  try { localStorage.setItem(KEY, JSON.stringify(store)) } catch {}
  window.dispatchEvent(new CustomEvent('review:update', { detail: { game } }))
}
