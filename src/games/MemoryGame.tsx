import { useEffect, useMemo, useState } from 'react'
import { playCorrect } from '../lib/sfx'
import { addStars } from '../lib/progress'

type Card = { symbol: string, flipped: boolean, matched: boolean }
type Theme = 'frutas' | 'animais' | 'emojis' | 'veiculos'

const THEMES: Record<Theme, string[]> = {
  frutas: ['🍎','🍌','🍇','🍓','🍉','🍊','🍍','🥝','🍑','🍒','🍐','🥭'],
  animais: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐷'],
  emojis: ['😀','😁','😂','😊','😍','😎','🤩','🥳','🤠','😺','🤖','👾'],
  veiculos: ['🚗','🚕','🚙','🚌','🚎','🏎️','🚓','🚑','🚒','🚜','🚲','🛴'],
}

const SIZES = [
  { label: '3 x 4', cols: 3, rows: 4 }, // 6 pares
  { label: '4 x 4', cols: 4, rows: 4 }, // 8 pares
  { label: '4 x 5', cols: 4, rows: 5 }, // 10 pares
]

export default function MemoryGame() {
  const [theme, setTheme] = useState<Theme>('frutas')
  const [size, setSize] = useState( SIZES[1] )

  const pairs = useMemo(()=> (size.cols * size.rows) / 2, [size])
  const symbols = useMemo(()=> THEMES[theme].slice(0, pairs), [theme, pairs])
  const makeDeck = () => [...symbols, ...symbols].sort(()=> Math.random()-0.5).map(s => ({ symbol: s, flipped:false, matched:false } as Card))

  const [cards, setCards] = useState<Card[]>(makeDeck())
  const [openIdxs, setOpenIdxs] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [matchedCount, setMatchedCount] = useState(0)
  const [locked, setLocked] = useState(false)

  useEffect(() => {
    setCards(makeDeck())
    setOpenIdxs([])
    setScore(0)
    setMatchedCount(0)
  }, [theme, size])

  function flip(i: number) {
    if (locked || cards[i].matched || openIdxs.includes(i)) return
    const next = cards.map((c,idx)=> idx===i ? { ...c, flipped: true } : c)
    const nextOpen = [...openIdxs, i]
    setCards(next)
    setOpenIdxs(nextOpen)
    if (nextOpen.length === 2) {
      setLocked(true)
      const [a,b] = nextOpen
      setTimeout(() => {
        if (next[a].symbol === next[b].symbol) {
          setCards(prev => prev.map((c,idx)=> idx===a || idx===b ? { ...c, matched: true } : c))
          setScore(s => s + 1)
          setMatchedCount(m => m + 1)
          addStars('memory', 1)
          playCorrect()
        } else {
          setCards(prev => prev.map((c,idx)=> idx===a || idx===b ? { ...c, flipped: false } : c))
        }
        setOpenIdxs([])
        setLocked(false)
      }, 600)
    }
  }

  const completed = matchedCount === pairs

  function restart() {
    setCards(makeDeck())
    setOpenIdxs([])
    setScore(0)
    setMatchedCount(0)
  }

  return (
    <div className="container">
      <div className="game">
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Memória 🧠</h2>
          <div className="row" style={{ gap: 8 }}>
            <label>Tema:</label>
            <select value={theme} onChange={e=> setTheme(e.target.value as Theme)}>
              <option value="frutas">Frutas</option>
              <option value="animais">Animais</option>
              <option value="emojis">Emojis</option>
              <option value="veiculos">Veículos</option>
            </select>
            <label style={{ marginLeft: 8 }}>Tamanho:</label>
            <select value={size.label} onChange={e=> setSize(SIZES.find(s=>s.label===e.target.value) || SIZES[1])}>
              {SIZES.map(s => <option key={s.label} value={s.label}>{s.label}</option>)}
            </select>
          </div>
        </div>
        <p>Pares encontrados: <strong>{score}</strong> / {pairs}</p>
        <div className="flip-grid" style={{ gridTemplateColumns: `repeat(${size.cols}, minmax(72px, 96px))` }}>
          {cards.map((c,i)=> (
            <div key={i} className="flip-card" onClick={()=>flip(i)}>
              <div className={`flip-inner ${c.flipped || c.matched ? 'flipped' : ''}`}>
                <div className="flip-face flip-front">❓</div>
                <div className="flip-face flip-back" style={{ fontSize: 28 }}>{c.symbol}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="row" style={{ marginTop: 12 }}>
          <button className="secondary" onClick={restart}>Reiniciar</button>
          {completed && <span>Parabéns! 🎉</span>}
        </div>
      </div>
    </div>
  )
}