import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getTotalStars } from '../lib/progress'
import { isSoundEnabled, setSoundEnabled } from '../lib/sfx'

export default function Navbar() {
  const linkStyle: React.CSSProperties = { marginRight: 4 }
  const [stars, setStars] = useState(getTotalStars())
  const [sound, setSound] = useState(isSoundEnabled())
  const [logoOk, setLogoOk] = useState(true)
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
  return (
    <nav>
      <Link to="/" style={{ fontSize: 18, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'white' }}>
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
      </Link>
      <span aria-label="estrelas" title="Estrelas">⭐ {stars}</span>
      <div className="nav-actions" style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
        <button className="secondary" onClick={()=> setSoundEnabled(!sound)} title="Som">{sound ? '🔊' : '🔇'}</button>
      </div>
      <div className="nav-links">
        <Link to="/" style={linkStyle} className="home-link">🏠 Início</Link>
      </div>
    </nav>
  )
}