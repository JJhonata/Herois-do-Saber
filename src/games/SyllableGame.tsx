import { useMemo, useState } from 'react'
import { addStars } from '../lib/progress'
import { playCorrect, playIncorrect } from '../lib/sfx'
import { shootConfetti } from '../lib/confetti'

type Item = {
  word: string
  emoji: string
  parts: string[]
  missing: number
  options: string[]
}

const ITEMS: Item[] = [
  { word: 'CASA', emoji: '🏠', parts: ['CA', 'SA'], missing: 1, options: ['SA', 'TA', 'PA', 'LA'] },
  { word: 'BOLA', emoji: '⚽', parts: ['BO', 'LA'], missing: 0, options: ['BO', 'CO', 'DO', 'FO'] },
  { word: 'GATO', emoji: '🐱', parts: ['GA', 'TO'], missing: 1, options: ['TO', 'DO', 'PO', 'NO'] },
  { word: 'PATO', emoji: '🦆', parts: ['PA', 'TO'], missing: 0, options: ['PA', 'BA', 'DA', 'CA'] },
  { word: 'JANELA', emoji: '🪟', parts: ['JA', 'NE', 'LA'], missing: 1, options: ['NE', 'ME', 'LE', 'PE'] },
  { word: 'ESCOLA', emoji: '🏫', parts: ['ES', 'CO', 'LA'], missing: 1, options: ['CO', 'GO', 'BO', 'TO'] },
  { word: 'BANANA', emoji: '🍌', parts: ['BA', 'NA', 'NA'], missing: 0, options: ['BA', 'PA', 'MA', 'DA'] },
  { word: 'SAPATO', emoji: '👟', parts: ['SA', 'PA', 'TO'], missing: 1, options: ['PA', 'BA', 'TA', 'CA'] },
  { word: 'CADERNO', emoji: '📒', parts: ['CA', 'DER', 'NO'], missing: 2, options: ['NO', 'MO', 'LO', 'TO'] },
  { word: 'BORBOLETA', emoji: '🦋', parts: ['BOR', 'BO', 'LE', 'TA'], missing: 2, options: ['LE', 'ME', 'TE', 'DE'] },
  { word: 'PIPOCA', emoji: '🍿', parts: ['PI', 'PO', 'CA'], missing: 1, options: ['PO', 'BO', 'TO', 'DO'] },
  { word: 'COELHO', emoji: '🐰', parts: ['CO', 'E', 'LHO'], missing: 0, options: ['CO', 'GO', 'TO', 'BO'] },
  { word: 'TOMATE', emoji: '🍅', parts: ['TO', 'MA', 'TE'], missing: 2, options: ['TE', 'DE', 'PE', 'LE'] },
  { word: 'MACACO', emoji: '🐒', parts: ['MA', 'CA', 'CO'], missing: 1, options: ['CA', 'GA', 'PA', 'TA'] },
  { word: 'FOGUETE', emoji: '🚀', parts: ['FO', 'GUE', 'TE'], missing: 1, options: ['GUE', 'QUE', 'GE', 'DE'] },
  { word: 'CAVALO', emoji: '🐴', parts: ['CA', 'VA', 'LO'], missing: 1, options: ['VA', 'FA', 'DA', 'LA'] },
  { word: 'MENINO', emoji: '👦', parts: ['ME', 'NI', 'NO'], missing: 0, options: ['ME', 'NE', 'PE', 'TE'] },
  { word: 'ABACAXI', emoji: '🍍', parts: ['A', 'BA', 'CA', 'XI'], missing: 3, options: ['XI', 'SI', 'CHI', 'ZI'] },
]

function shuffled<T>(items: T[]) {
  return [...items].sort(() => Math.random() - .5)
}

export default function SyllableGame() {
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState<string | null>(null)
  const item = ITEMS[round % ITEMS.length]
  const options = useMemo(() => shuffled(item.options), [round])

  function choose(option: string) {
    if (answered) return
    setAnswered(option)
    const ok = option === item.parts[item.missing]
    if (ok) {
      setScore(s => s + 1)
      addStars('syllable', 1)
      playCorrect()
      shootConfetti()
      setTimeout(() => {
        setRound(r => r + 1)
        setAnswered(null)
      }, 800)
    } else {
      playIncorrect()
      setTimeout(() => setAnswered(null), 650)
    }
  }

  return (
    <div className="container">
      <div className="game">
        <h2>Sílaba Mágica ✨🔤</h2>
        <p>Descubra qual sílaba está faltando para completar a palavra.</p>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span>Rodada: <strong>{round + 1}</strong></span>
          <span>Acertos: <strong>{score}</strong></span>
        </div>
        <div style={{ textAlign: 'center', margin: '26px 0' }}>
          <div style={{ fontSize: 70 }}>{item.emoji}</div>
          <div className="syllable-word" aria-label={`Palavra ${item.word}`}>
            {item.parts.map((part, i) => (
              <span key={`${part}-${i}`} className={`syllable-piece ${i === item.missing ? 'missing' : ''}`}>
                {i === item.missing ? '___' : part}
              </span>
            ))}
          </div>
        </div>
        <div className="choice-grid">
          {options.map(option => {
            const correct = answered && option === item.parts[item.missing]
            const wrong = answered === option && option !== item.parts[item.missing]
            return (
              <button
                key={option}
                className={correct ? 'accent' : wrong ? 'danger' : ''}
                onClick={() => choose(option)}
              >
                {option}
              </button>
            )
          })}
        </div>
        <p style={{ minHeight: 24, textAlign: 'center', fontWeight: 700 }}>
          {answered === item.parts[item.missing] ? 'Muito bem! Palavra completa! 🎉' : answered ? 'Quase! Tente outra sílaba.' : 'Escolha uma sílaba.'}
        </p>
      </div>
    </div>
  )
}
