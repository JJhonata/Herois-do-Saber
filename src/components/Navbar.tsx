import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getTotalStars } from '../lib/progress'
import { isSoundEnabled, setSoundEnabled } from '../lib/sfx'

export default function Navbar() {
  const linkStyle: React.CSSProperties = { marginRight: 4 }
  const [stars, setStars] = useState(getTotalStars())
  const [sound, setSound] = useState(isSoundEnabled())
  const [logoOk, setLogoOk] = useState(true)
  const [contrast, setContrast] = useState(()=>{
    try { return localStorage.getItem('herois_contrast') === '1' } catch { return false }
  })
  useEffect(()=>{
    const fn = () => setStars(getTotalStars())
    window.addEventListener('progress:update', fn as any)
    return ()=> window.removeEventListener('progress:update', fn as any)
  }, [])
  useEffect(()=>{
    const onSound = () => setSound(isSoundEnabled())
    window.addEventListener('sound:update', onSound as any)
    return ()=> window.removeEventListener('sound:update', onSound as any)
  }, [])
  useEffect(()=>{
    document.documentElement.toggleAttribute('data-contrast', contrast as any)
    try { localStorage.setItem('herois_contrast', contrast ? '1' : '0') } catch {}
  }, [contrast])
  return (
    <nav>
      <strong style={{ fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
        {logoOk ? (
          <img
            src="/logo.png?v=1"
            alt="Heróis do Saber"
            onError={()=> setLogoOk(false)}
            style={{ height: 28, width: 'auto', display: 'block', objectFit: 'contain' }}
          />
        ) : (
          <span aria-hidden>🦸</span>
        )}
        <span>Heróis do Saber</span>
      </strong>
      <span aria-label="estrelas" title="Estrelas">⭐ {stars}</span>
      <div className="nav-actions" style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
        <button className="secondary" onClick={()=> setSoundEnabled(!sound)} title="Som">{sound ? '🔊' : '🔇'}</button>
        <button className="secondary" onClick={()=> setContrast(c=>!c)} title="Alto contraste">{contrast ? '🌓' : '🌗'}</button>
      </div>
      <div className="nav-links">
        <Link to="/" style={linkStyle}>Início</Link>
        <Link to="/math" style={linkStyle}>Math</Link>
        <Link to="/memory" style={linkStyle}>Memória</Link>
        <Link to="/quiz" style={linkStyle}>Quiz</Link>
        <Link to="/security" style={linkStyle}>Segurança</Link>
        <Link to="/ditado" style={linkStyle}>Ditado</Link>
        <Link to="/scramble" style={linkStyle}>Scramble</Link>
        <Link to="/typing" style={linkStyle}>Digitação</Link>
        <Link to="/paint" style={linkStyle}>Pintura</Link>
      </div>
    </nav>
  )
}