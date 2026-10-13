import { gameCatalog, type GameId } from './gameCatalog'
import { getPreferredDifficulty } from './learnerProfile'

type Progress = Record<GameId, number>

const KEY = 'herois_progress_v1'
const LAST_GAME_KEY = 'herois_last_game_v1'
const VISITED_GAMES_KEY = 'herois_visited_games_v1'
const ACTIVITY_DAYS_KEY = 'herois_activity_days_v1'

export type Difficulty = 'easy' | 'medium' | 'hard'

export function getRecommendedDifficulty(game: GameId): Difficulty {
  const preference = getPreferredDifficulty()
  if (preference) return preference
  const stars = getStars(game)
  if (stars >= 15) return 'hard'
  if (stars >= 5) return 'medium'
  return 'easy'
}

function read(): Progress {
  const progress = Object.fromEntries(gameCatalog.map(({ id }) => [id, 0])) as Progress
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return progress
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return progress
    for (const { id } of gameCatalog) {
      const value = (parsed as Record<string, unknown>)[id]
      if (typeof value === 'number' && Number.isFinite(value) && value >= 0) progress[id] = value
    }
  } catch {}
  return progress
}

function write(p: Progress) {
  try { localStorage.setItem(KEY, JSON.stringify(p)) } catch {}
}

function todayKey() {
  const date = new Date()
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

function recordActivity() {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(ACTIVITY_DAYS_KEY) || '[]')
    const days = Array.isArray(saved) ? saved.filter((day): day is string => typeof day === 'string') : []
    const today = todayKey()
    if (!days.includes(today)) localStorage.setItem(ACTIVITY_DAYS_KEY, JSON.stringify([...days, today].slice(-90)))
  } catch {}
}

export function addStars(game: GameId, amount = 1) {
  if (!Number.isFinite(amount) || amount <= 0) return
  recordActivity()
  const p = read()
  p[game] += amount
  write(p)
  window.dispatchEvent(new CustomEvent('progress:update'))
}

export function getStars(game: GameId) {
  return read()[game] || 0
}

export function getTotalStars() {
  const p = read()
  return gameCatalog.reduce((sum, { id }) => sum + p[id], 0)
}

export function setLastPlayedGame(game: GameId) {
  try {
    recordActivity()
    localStorage.setItem(LAST_GAME_KEY, game)
    const parsed: unknown = JSON.parse(localStorage.getItem(VISITED_GAMES_KEY) || '[]')
    const visited = Array.isArray(parsed) ? parsed.filter((value): value is GameId => gameCatalog.some(({ id }) => id === value)) : []
    if (!visited.includes(game)) visited.push(game)
    localStorage.setItem(VISITED_GAMES_KEY, JSON.stringify(visited))
  } catch {}
}

export function getLearningStreak() {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(ACTIVITY_DAYS_KEY) || '[]')
    const days = new Set(Array.isArray(saved) ? saved.filter((day): day is string => typeof day === 'string') : [])
    const date = new Date()
    let streak = 0
    while (days.has(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`)) {
      streak += 1
      date.setDate(date.getDate() - 1)
    }
    return streak
  } catch { return 0 }
}

export function getLastPlayedGame(): GameId | null {
  try {
    const value = localStorage.getItem(LAST_GAME_KEY)
    return gameCatalog.some(({ id }) => id === value) ? value as GameId : null
  } catch { return null }
}

export function getLearningProgress() {
  const progress = read()
  const totalStars = Object.values(progress).reduce((sum, value) => sum + value, 0)
  let visitedIds: GameId[] = []
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(VISITED_GAMES_KEY) || '[]')
    if (Array.isArray(parsed)) visitedIds = parsed.filter((value): value is GameId => gameCatalog.some(({ id }) => id === value))
  } catch {}
  const gamesExplored = new Set(visitedIds).size
  const subjectsExplored = new Set(gameCatalog.filter(({ id }) => visitedIds.includes(id)).map(({ area }) => area)).size
  const bySubject = [...new Set(gameCatalog.map(({ area }) => area))].map((area) => {
    const games = gameCatalog.filter((game) => game.area === area)
    const played = games.filter(({ id }) => visitedIds.includes(id)).length
    const stars = games.reduce((sum, { id }) => sum + progress[id], 0)
    return { area, played, games: games.length, stars }
  })

  const milestones = [
    { id: 'first-star', title: 'Primeira estrela', icon: '🌟', current: Math.min(totalStars, 1), target: 1 },
    { id: 'game-explorer', title: 'Explore 3 jogos', icon: '🧭', current: Math.min(gamesExplored, 3), target: 3 },
    { id: 'curious-mind', title: 'Conheça 3 matérias', icon: '📚', current: Math.min(subjectsExplored, 3), target: 3 },
    { id: 'star-collector', title: 'Junte 10 estrelas', icon: '🏅', current: Math.min(totalStars, 10), target: 10 },
  ].map((milestone) => ({ ...milestone, complete: milestone.current >= milestone.target }))

  return { totalStars, gamesExplored, subjectsExplored, streakDays: getLearningStreak(), milestones, bySubject }
}

export function getSuggestedGame(exclude?: GameId) {
  return gameCatalog
    .filter(({ id }) => id !== exclude)
    .sort((a, b) => getStars(a.id) - getStars(b.id))[0] || gameCatalog[0]
}

export type { GameId }
