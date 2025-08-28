import { useEffect, useMemo, useRef, useState } from 'react'
import { playBonus, playCorrect } from '../lib/sfx'
import { addStars } from '../lib/progress'

type Level = 'facil' | 'medio' | 'dificil'
const BANK: Record<Level, string[]> = {
  facil: [
    'Eu gosto de estudar.',
    'Aprender é ser herói.',
    'A escola é legal.',
    'Ler é divertido.',
    'Eu amo matemática.',
  ],
  medio: [
    'Programar é divertido e desafiador.',
    'Ler livros aumenta muito o saber.',
    'Os heróis sempre ajudam os amigos.',
    'Estudar todos os dias melhora muito.',
  ],
  dificil: [
    'A curiosidade é o pavio na vela do aprendizado.',
    'A prática constante transforma esforço em habilidade.',
    'Disciplina é liberdade, estudo é poder.',
  ],
}

export default function TypingSpeed() {
  const [level, setLevel] = useState<Level>('facil')
  const phrases = useMemo(()=> BANK[level], [level])
  const [practice, setPractice] = useState(false)
  const [custom, setCustom] = useState('Digite seu próprio texto aqui...')
  const [text, setText] = useState('')
  const [started, setStarted] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const timerRef = useRef<number | null>(null)
  const [target, setTarget] = useState(phrases[0])

  useEffect(()=>{
    if (started) {
      timerRef.current = window.setInterval(()=> setSeconds(s=>s+1), 1000)
    }
    return ()=> { if (timerRef.current) window.clearInterval(timerRef.current) }
  }, [started])

  useEffect(()=>{ setTarget(phrases[0]); setText(''); setSeconds(0); setStarted(false) }, [phrases])

  const complete = text === target
  const [awarded, setAwarded] = useState(false)
  useTypingAutoAdvance(!practice && complete, target, setTarget, () => { setText(''); setSeconds(0); setStarted(false); setAwarded(false) }, phrases)

  function restart() {
    setText('')
    setSeconds(0)
    setStarted(false)
    if (practice) {
      setTarget(custom)
    } else {
      setTarget(phrases[Math.floor(Math.random()*phrases.length)])
    }
  }

  return (
    <div className="container">
      <div className="game">
        <h2>Digitação ⌨️</h2>
        <div className="row" style={{ alignItems: 'center' }}>
          <label>Nível:</label>
          <select value={level} onChange={e=> setLevel(e.target.value as Level)}>
            <option value="facil">Fácil</option>
            <option value="medio">Médio</option>
            <option value="dificil">Difícil</option>
          </select>
          <label style={{ marginLeft: 12 }}>Prática livre:</label>
          <select value={String(practice)} onChange={e=> { const v = e.target.value==='true'; setPractice(v); if (v) setTarget(custom); else setTarget(phrases[0]); setText(''); setSeconds(0); setStarted(false) }}>
            <option value="false">Não</option>
            <option value="true">Sim</option>
          </select>
          <span style={{ marginLeft: 'auto' }}>Tempo: <strong>{seconds}s</strong></span>
        </div>
        <div style={{ height: 8 }} />
        {practice ? (
          <div className="row" style={{ alignItems: 'center', gap: 8 }}>
            <label style={{ whiteSpace: 'nowrap' }}>Texto da prática:</label>
            <input style={{ flex: 1 }} value={custom} onChange={e=> { setCustom(e.target.value); if (practice) setTarget(e.target.value) }} />
          </div>
        ) : null}
        <p>Digite a frase:</p>
        <p style={{ fontWeight: 600 }}><em>{target}</em></p>
        <div className="row">
          <button onClick={()=>{ setStarted(true); setText(''); setSeconds(0) }} className="accent">Iniciar</button>
          <button onClick={restart} className="secondary">Reiniciar</button>
          {!practice && <button className="secondary" onClick={()=> setTarget(phrases[Math.floor(Math.random()*phrases.length)])}>Próxima frase</button>}
        </div>
        <textarea rows={4} value={text} onChange={e=>setText(e.target.value)} style={{ width: '100%', marginTop: 8 }} />
        <p>{complete ? 'Perfeito! 🎉' : 'Continue, você está indo bem!'}</p>
        {complete && !awarded && (setAwarded(true), playCorrect(), addStars('typing', 1))}
      </div>
    </div>
  )
}

// Avança automaticamente para a próxima frase após concluir
export function useTypingAutoAdvance(
  complete: boolean,
  target: string,
  setTarget: (v: string)=> void,
  reset: ()=> void,
  phrases: string[],
) {
  useEffect(()=>{
    if (!complete) return
    const t = setTimeout(()=>{
      const idx = phrases.indexOf(target)
      const next = phrases[(idx >= 0 ? idx : 0) + 1 >= phrases.length ? 0 : (idx + 1)]
      setTarget(next)
      reset()
    }, 800)
    return ()=> clearTimeout(t)
  }, [complete, target, setTarget, reset, phrases])
}

function countCorrectChars(input: string, target: string) {
  let n = 0
  for (let i = 0; i < input.length && i < target.length; i++) {
    if (input[i] === target[i]) n++
  }
  return n
}


