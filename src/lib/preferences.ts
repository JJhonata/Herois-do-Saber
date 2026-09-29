export type AccessibilityPreferences = { textSize: 16 | 18 | 20; highContrast: boolean; reducedMotion: boolean }

const KEY = 'herois_accessibility_v1'
const DEFAULTS: AccessibilityPreferences = { textSize: 16, highContrast: false, reducedMotion: false }

export function readAccessibilityPreferences(): AccessibilityPreferences {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) || 'null')
    if (!parsed || typeof parsed !== 'object') return DEFAULTS
    const value = parsed as Record<string, unknown>
    const textSize = value.textSize === 18 || value.textSize === 20 ? value.textSize : 16
    return { textSize, highContrast: value.highContrast === true, reducedMotion: value.reducedMotion === true }
  } catch { return DEFAULTS }
}

export function applyAccessibilityPreferences(preferences: AccessibilityPreferences) {
  const root = document.documentElement
  root.style.setProperty('--base-font-size', `${preferences.textSize}px`)
  root.dataset.contrast = String(preferences.highContrast)
  if (preferences.reducedMotion) root.dataset.reducedMotion = 'true'
  else delete root.dataset.reducedMotion
  try { localStorage.setItem(KEY, JSON.stringify(preferences)) } catch {}
}
