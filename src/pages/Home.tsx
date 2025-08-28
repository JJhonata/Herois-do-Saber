import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getStars } from '../lib/progress'

const games = [
  { id: 'math', path: '/math', title: 'Matemática', desc: 'Some e aprenda!', emoji: '🧮', tag: '1º-5º', cls: 'card-math' },
  { id: 'memory', path: '/memory', title: 'Memória', desc: 'Vire as cartas!', emoji: '🧠', tag: '1º-5º', cls: 'card-memory' },
  { id: 'quiz', path: '/quiz', title: 'Quiz', desc: 'Responda certo!', emoji: '❓', tag: '2º-5º', cls: 'card-quiz' },
  { id: 'security', path: '/security', title: 'Segurança', desc: 'Crie senhas!', emoji: '🔐', tag: '3º-5º', cls: 'card-security' },
  { id: 'ditado', path: '/ditado', title: 'Ditado', desc: 'Ouça e escreva!', emoji: '🎧', tag: '1º-3º', cls: 'card-ditado' },
  { id: 'scramble', path: '/scramble', title: 'Desembaralhar', desc: 'Monte a palavra!', emoji: '🔤', tag: '3º-5º', cls: 'card-scramble' },
  { id: 'typing', path: '/typing', title: 'Digitação', desc: 'Digite as frases!', emoji: '⌨️', tag: '2º-5º', cls: 'card-typing' },
  { id: 'paint', path: '/paint', title: 'Pintura', desc: 'Desenhe e salve!', emoji: '🎨', tag: '1º-5º', cls: 'card-paint' },
] as const

export default function Home() {
  const [tick, setTick] = useState(0)
  useEffect(()=>{
    const fn = () => setTick(t=>t+1)
    window.addEventListener('progress:update', fn as any)
    return ()=> window.removeEventListener('progress:update', fn as any)
  }, [])
  return (
    <div className="container">
      <div className="hero">
        <div>
          <h1>Heróis do Saber</h1>
          <p>Aprenda brincando! Escolha um jogo e ganhe estrelas ✨</p>
        </div>
        <div style={{ transform: 'translateX(-28px)' }}>
          <img
            src="/logo.png?v=1"
            alt="Heróis do Saber"
            style={{ height: 150, width: 'auto', display: 'block', objectFit: 'contain' }}
          />
        </div>
      </div>
      <div className="grid" style={{ marginTop: 16 }}>
        {games.map(g => (
          <div className={`card ${g.cls}`} key={g.path}>
            <div className="badge">{g.tag}</div>
            <div style={{ fontSize: 36 }}>{g.emoji}</div>
            <h3>{g.title}</h3>
            <p style={{ margin: 0 }}>{g.desc}</p>
            <p style={{ margin: 0 }}>⭐ {getStars(g.id as any)} estrelas</p>
            <Link to={g.path}><button className="accent" style={{ width: '100%' }}>Jogar</button></Link>
          </div>
        ))}
      </div>
    </div>
  )
}


