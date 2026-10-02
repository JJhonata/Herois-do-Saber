import { Link, NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getTotalStars } from '../lib/progress'
import { isSoundEnabled, setSoundEnabled } from '../lib/sfx'
import { applyAccessibilityPreferences, readAccessibilityPreferences, type AccessibilityPreferences } from '../lib/preferences'

export default function Navbar() {
  const [stars, setStars] = useState(getTotalStars())
  const [sound, setSound] = useState(isSoundEnabled())
  const [logoOk, setLogoOk] = useState(true)
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(readAccessibilityPreferences)
  useEffect(()=>{
    const fn = () => setStars(getTotalStars())
    window.addEventListener('progress:update', fn as any)
    return ()=> window.removeEventListener('progress:update', fn as any)
  }, [])
  useEffect(() => { applyAccessibilityPreferences(preferences) }, [preferences])

  function updatePreferences(next: Partial<AccessibilityPreferences>) {
    setPreferences((current) => ({ ...current, ...next }))
  }
  useEffect(()=>{
    const onSound = () => setSound(isSoundEnabled())
    window.addEventListener('sound:update', onSound as any)
    return ()=> window.removeEventListener('sound:update', onSound as any)
  }, [])
  return (
    <nav>
      <Link to="/" className="nav-brand">
        {logoOk ? (
          <img
            src="/logo.webp"
            alt="Heróis do Saber"
            onError={()=> setLogoOk(false)}
            className="nav-logo"
          />
        ) : (
          <span aria-hidden>🦸</span>
        )}
        <span>Heróis do Saber</span>
      </Link>
      <span className="nav-stars" aria-label="estrelas" title="Estrelas">⭐ {stars}</span>
      <div className="nav-actions">
        <button type="button" className="secondary" onClick={()=> setSoundEnabled(!sound)} title={sound ? 'Desativar sons' : 'Ativar sons'} aria-label={sound ? 'Desativar sons' : 'Ativar sons'} aria-pressed={sound}>{sound ? '🔊' : '🔇'}</button>
        <details className="accessibility-menu">
          <summary aria-label="Abrir opções de acessibilidade" title="Acessibilidade">Aa</summary>
          <div className="accessibility-popover" aria-label="Opções de acessibilidade">
            <strong>Acessibilidade</strong>
            <div className="accessibility-size">
              <button type="button" className="secondary" aria-label="Diminuir texto" disabled={preferences.textSize === 16} onClick={() => updatePreferences({ textSize: preferences.textSize === 20 ? 18 : 16 })}>A−</button>
              <span>Texto {preferences.textSize}px</span>
              <button type="button" className="secondary" aria-label="Aumentar texto" disabled={preferences.textSize === 20} onClick={() => updatePreferences({ textSize: preferences.textSize === 16 ? 18 : 20 })}>A+</button>
            </div>
            <button type="button" className="secondary contrast-toggle" aria-pressed={preferences.highContrast} onClick={() => updatePreferences({ highContrast: !preferences.highContrast })}>
              {preferences.highContrast ? '✓ Alto contraste' : 'Alto contraste'}
            </button>
            <button type="button" className="secondary contrast-toggle" aria-pressed={preferences.reducedMotion} onClick={() => updatePreferences({ reducedMotion: !preferences.reducedMotion })}>
              {preferences.reducedMotion ? '✓ Reduzir animações' : 'Reduzir animações'}
            </button>
          </div>
        </details>
      </div>
      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => `home-link${isActive ? ' active' : ''}`}>🏠 Início</NavLink>
        <NavLink to="/books" className={({ isActive }) => `books-link${isActive ? ' active' : ''}`}>📚 Biblioteca</NavLink>
      </div>
      <NavLink to="/books" className={({ isActive }) => `nav-books-compact${isActive ? ' active' : ''}`} aria-label="Biblioteca de leitura" title="Biblioteca de leitura">📚</NavLink>
    </nav>
  )
}
