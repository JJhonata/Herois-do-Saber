import { useMemo, useState } from 'react'
import { addStars } from '../lib/progress'
import { playCorrect, playIncorrect } from '../lib/sfx'
import { shootConfetti } from '../lib/confetti'

type Level = 'easy' | 'medium' | 'hard'
type Question = { values: number[]; answer: number; options: number[]; clue: string }

function shuffle<T>(items: T[]) { return [...items].sort(() => Math.random() - .5) }

function buildQuestion(level: Level, seed: number): Question {
  const bases = {
    easy: [
      { start: 1, step: 1, clue: 'Conte de 1 em 1' },
      { start: 2, step: 2, clue: 'Conte de 2 em 2' },
      { start: 5, step: 5, clue: 'Conte de 5 em 5' },
      { start: 10, step: 10, clue: 'Conte de 10 em 10' },
      { start: 4, step: 2, clue: 'Continue pulando de 2 em 2' },
    ],
    medium: [
      { start: 3, step: 3, clue: 'Some sempre o mesmo valor' },
      { start: 10, step: 4, clue: 'Observe quanto aumenta' },
      { start: 6, step: 6, clue: 'Descubra o salto da sequência' },
      { start: 25, step: 5, clue: 'Some cinco a cada passo' },
      { start: 50, step: -4, clue: 'A sequência está diminuindo de 4 em 4' },
    ],
    hard: [
      { start: 40, step: -5, clue: 'A sequência está diminuindo' },
      { start: 72, step: -8, clue: 'Subtraia sempre o mesmo valor' },
      { start: 15, step: 7, clue: 'Observe a diferença entre os números' },
      { start: 100, step: -12, clue: 'Subtraia doze a cada passo' },
      { start: 11, step: 11, clue: 'Observe o salto constante' },
    ],
  }[level]
  const model = bases[seed % bases.length]
  const values = Array.from({ length: 4 }, (_, i) => model.start + model.step * i)
  const answer = model.start + model.step * 4
  const distance = Math.max(1, Math.abs(model.step))
  const options = shuffle([answer, answer + distance, answer - distance, answer + distance * 2])
  return { values, answer, options, clue: model.clue }
}

export default function SequenceGame() {
  const [level, setLevel] = useState<Level>('easy')
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const question = useMemo(() => buildQuestion(level, round), [level, round])

  function choose(value: number) {
    if (picked !== null) return
    setPicked(value)
    if (value === question.answer) {
      setScore(s => s + 1)
      addStars('sequence', 1)
      playCorrect()
      shootConfetti()
      setTimeout(() => { setRound(r => r + 1); setPicked(null) }, 800)
    } else {
      playIncorrect()
      setTimeout(() => setPicked(null), 650)
    }
  }

  return (
    <div className="container">
      <div className="game">
        <h2>Sequência dos Heróis 🧩</h2>
        <p>Descubra qual número vem depois.</p>
        <div className="row">
          <label>Nível:</label>
          <select value={level} onChange={e => { setLevel(e.target.value as Level); setRound(0); setPicked(null) }}>
            <option value="easy">Fácil</option>
            <option value="medium">Médio</option>
            <option value="hard">Difícil</option>
          </select>
          <span style={{ marginLeft: 'auto' }}>Acertos: <strong>{score}</strong></span>
        </div>
        <div className="number-sequence">
          {question.values.map(v => <span key={v}>{v}</span>)}
          <span className="question-mark">?</span>
        </div>
        <p style={{ textAlign: 'center' }}>💡 Dica: {question.clue}</p>
        <div className="choice-grid">
          {question.options.map(option => (
            <button
              key={option}
              className={picked !== null && option === question.answer ? 'accent' : picked === option ? 'danger' : ''}
              onClick={() => choose(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <p style={{ minHeight: 24, textAlign: 'center', fontWeight: 700 }}>
          {picked === question.answer ? 'Sequência descoberta! ⭐' : picked !== null ? 'Observe a diferença e tente outra vez.' : ''}
        </p>
      </div>
    </div>
  )
}
