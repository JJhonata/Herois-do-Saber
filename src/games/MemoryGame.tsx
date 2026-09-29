import { useEffect, useMemo, useRef } from 'react'
import { useGameState } from '../lib/gameSession'
import { playCorrect } from '../lib/sfx'
import { addStars, getRecommendedDifficulty } from '../lib/progress'
import { recordAnswer } from '../lib/review'

type Card = { symbol: string, flipped: boolean, matched: boolean }
type Theme = 'frutas' | 'animais' | 'emojis' | 'veiculos' | 'escola' | 'natureza'

const THEMES: Record<Theme, string[]> = {
  frutas: ['🍎','🍌','🍇','🍓','🍉','🍊','🍍','🥝','🍑','🍒','🍐','🥭'],
  animais: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐷'],
  emojis: ['😀','😁','😂','😊','😍','😎','🤩','🥳','🤠','😺','🤖','👾'],
  veiculos: ['🚗','🚕','🚙','🚌','🚎','🏎️','🚓','🚑','🚒','🚜','🚲','🛴'],
  escola: ['📚','✏️','📒','🎒','📏','🖍️','✂️','🧮','📝','🖊️','📐','🗂️'],
  natureza: ['🌳','🌻','🌈','☀️','🌙','⭐','☁️','🌊','🍃','🌵','🍄','🌸'],
}

const SIZES = [
  { label: '3 x 4', cols: 3, rows: 4 }, // 6 pares
  { label: '4 x 4', cols: 4, rows: 4 }, // 8 pares
  { label: '4 x 5', cols: 4, rows: 5 }, // 10 pares
  { label: '4 x 6', cols: 4, rows: 6 }, // 12 pares
]

export default function MemoryGame() {
  const [theme, setTheme] = useGameState<Theme>('frutas')
  const [size, setSize] = useGameState(() => {
    const recommended = getRecommendedDifficulty('memory')
    return recommended === 'easy' ? SIZES[0] : recommended === 'medium' ? SIZES[1] : SIZES[2]
  })

  const pairs = useMemo(()=> (size.cols * size.rows) / 2, [size])
  const symbols = useMemo(()=> THEMES[theme].slice(0, pairs), [theme, pairs])
  const makeDeck = () => [...symbols, ...symbols].sort(()=> Math.random()-0.5).map(s => ({ symbol: s, flipped:false, matched:false } as Card))

  const [cards, setCards] = useGameState<Card[]>(makeDeck())
  const [openIdxs, setOpenIdxs] = useGameState<number[]>([])
  const [score, setScore] = useGameState(0)
  const [matchedCount, setMatchedCount] = useGameState(0)
  const [locked, setLocked] = useGameState(false)
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) { initialized.current = true; return }
    setCards(makeDeck())
    setOpenIdxs([])
    setScore(0)
    setMatchedCount(0)
    setLocked(false)
  }, [theme, size])

  useEffect(() => {
    if (!locked || openIdxs.length !== 2) return
    const [a, b] = openIdxs
    const timeout = window.setTimeout(() => {
      const matched = cards[a]?.symbol === cards[b]?.symbol
      recordAnswer('memory', `Encontre um par nas posições ${a + 1} e ${b + 1}`, `${cards[a]?.symbol || '?'} e ${cards[b]?.symbol || '?'}`, matched ? 'duas cartas iguais' : 'duas cartas iguais', matched, 'Observe as figuras e tente memorizar onde cada uma aparece.')
      if (matched) {
        setCards((previous) => previous.map((card, index) => index === a || index === b ? { ...card, matched: true } : card))
        setScore((current) => current + 1)
        setMatchedCount((current) => current + 1)
        addStars('memory', 1)
        playCorrect()
      } else {
        setCards((previous) => previous.map((card, index) => index === a || index === b ? { ...card, flipped: false } : card))
      }
      setOpenIdxs([])
      setLocked(false)
    }, 600)
    return () => window.clearTimeout(timeout)
  }, [locked, openIdxs])

  function flip(i: number) {
    if (locked || cards[i].matched || openIdxs.includes(i)) return
    const next = cards.map((c,idx)=> idx===i ? { ...c, flipped: true } : c)
    const nextOpen = [...openIdxs, i]
    setCards(next)
    setOpenIdxs(nextOpen)
    if (nextOpen.length === 2) setLocked(true)
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
              <option value="escola">Escola</option>
              <option value="natureza">Natureza</option>
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
            <button key={i} type="button" className="flip-card" onClick={()=>flip(i)} disabled={locked || c.matched} aria-pressed={c.flipped || c.matched} aria-label={`${c.flipped || c.matched ? c.symbol : 'Carta fechada'}, posição ${i + 1}${c.matched ? ', par encontrado' : ''}`}>
              <div className={`flip-inner ${c.flipped || c.matched ? 'flipped' : ''}`}>
                <div className="flip-face flip-front">❓</div>
                <div className="flip-face flip-back" style={{ fontSize: 28 }}>{c.symbol}</div>
              </div>
            </button>
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
