import type { Difficulty } from './progress'

const KEY = 'herois_learning_profile_v1'

export function getPreferredDifficulty(): Difficulty | null {
  try {
    const value = localStorage.getItem(KEY)
    return value === 'easy' || value === 'medium' || value === 'hard' ? value : null
  } catch { return null }
}

export function setPreferredDifficulty(value: Difficulty | null) {
  try {
    if (value) localStorage.setItem(KEY, value)
    else localStorage.removeItem(KEY)
    window.dispatchEvent(new CustomEvent('profile:update'))
  } catch {}
}

export function hasLearningProfileResponse() {
  try { return localStorage.getItem(KEY) !== null } catch { return false }
}

export function skipLearningProfile() {
  try { localStorage.setItem(KEY, 'later') } catch {}
}
