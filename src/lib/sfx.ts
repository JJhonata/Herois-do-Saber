// Efeitos sonoros simples com Web Audio API (beeps curtos)
let ctx: AudioContext | null = null
let soundEnabled = (()=>{
  try { const v = localStorage.getItem('herois_sound'); return v ? v === '1' : true } catch { return true }
})()

function ensureCtx() {
  if (!ctx) {
    const Ctor = (window as any).AudioContext || (window as any).webkitAudioContext
    if (Ctor) ctx = new Ctor()
  }
  return ctx
}

function beep(freq: number, durationMs: number, type: OscillatorType = 'sine', volume = 0.08) {
  if (!soundEnabled) return
  const audio = ensureCtx()
  if (!audio) return
  const osc = audio.createOscillator()
  const gain = audio.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.value = volume
  osc.connect(gain)
  gain.connect(audio.destination)
  const now = audio.currentTime
  osc.start(now)
  osc.stop(now + durationMs / 1000)
}

export function playCorrect() {
  beep(880, 90, 'sine')
  setTimeout(() => beep(1320, 100, 'sine'), 90)
}

export function playIncorrect() {
  beep(200, 120, 'sawtooth')
}

export function playBonus() {
  beep(660, 70, 'triangle')
  setTimeout(() => beep(990, 70, 'triangle'), 70)
  setTimeout(() => beep(1320, 90, 'triangle'), 140)
}

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled
  try { localStorage.setItem('herois_sound', enabled ? '1' : '0') } catch {}
  window.dispatchEvent(new CustomEvent('sound:update'))
}

export function isSoundEnabled() { return soundEnabled }





