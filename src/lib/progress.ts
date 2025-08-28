type GameId = 'math' | 'memory' | 'quiz' | 'security' | 'ditado' | 'scramble' | 'typing' | 'paint'

type Progress = Record<GameId, number>

const KEY = 'herois_progress_v1'

function read(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as Progress
  } catch {}
  return { math: 0, memory: 0, quiz: 0, security: 0, ditado: 0, scramble: 0, typing: 0, paint: 0 }
}

function write(p: Progress) {
  localStorage.setItem(KEY, JSON.stringify(p))
}

export function addStars(game: GameId, amount = 1) {
  const p = read()
  p[game] = (p[game] || 0) + amount
  write(p)
  window.dispatchEvent(new CustomEvent('progress:update'))
}

export function getStars(game: GameId) {
  return read()[game] || 0
}

export function getTotalStars() {
  const p = read()
  return Object.values(p).reduce((a, b) => a + b, 0)
}

export type { GameId }





