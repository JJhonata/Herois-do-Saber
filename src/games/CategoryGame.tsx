import { useMemo, useState } from 'react'
import { addStars } from '../lib/progress'
import { playCorrect, playIncorrect } from '../lib/sfx'
import { shootConfetti } from '../lib/confetti'

type Category = 'Animal' | 'Alimento' | 'Objeto' | 'Lugar'
type Item = { name: string; emoji: string; category: Category }

const CATEGORIES: Category[] = ['Animal', 'Alimento', 'Objeto', 'Lugar']
const ITEMS: Item[] = [
  { name: 'Leão', emoji: '🦁', category: 'Animal' },
  { name: 'Maçã', emoji: '🍎', category: 'Alimento' },
  { name: 'Lápis', emoji: '✏️', category: 'Objeto' },
  { name: 'Escola', emoji: '🏫', category: 'Lugar' },
  { name: 'Elefante', emoji: '🐘', category: 'Animal' },
  { name: 'Banana', emoji: '🍌', category: 'Alimento' },
  { name: 'Tesoura', emoji: '✂️', category: 'Objeto' },
  { name: 'Praia', emoji: '🏖️', category: 'Lugar' },
  { name: 'Borboleta', emoji: '🦋', category: 'Animal' },
  { name: 'Pão', emoji: '🍞', category: 'Alimento' },
  { name: 'Relógio', emoji: '⌚', category: 'Objeto' },
  { name: 'Hospital', emoji: '🏥', category: 'Lugar' },
  { name: 'Cachorro', emoji: '🐕', category: 'Animal' },
  { name: 'Cenoura', emoji: '🥕', category: 'Alimento' },
  { name: 'Mochila', emoji: '🎒', category: 'Objeto' },
  { name: 'Parque', emoji: '🏞️', category: 'Lugar' },
  { name: 'Girafa', emoji: '🦒', category: 'Animal' },
  { name: 'Arroz', emoji: '🍚', category: 'Alimento' },
  { name: 'Cadeira', emoji: '🪑', category: 'Objeto' },
  { name: 'Biblioteca', emoji: '📚', category: 'Lugar' },
  { name: 'Tartaruga', emoji: '🐢', category: 'Animal' },
  { name: 'Queijo', emoji: '🧀', category: 'Alimento' },
  { name: 'Guarda-chuva', emoji: '☂️', category: 'Objeto' },
  { name: 'Museu', emoji: '🏛️', category: 'Lugar' },
  { name: 'Pinguim', emoji: '🐧', category: 'Animal' },
  { name: 'Uva', emoji: '🍇', category: 'Alimento' },
  { name: 'Computador', emoji: '💻', category: 'Objeto' },
  { name: 'Fazenda', emoji: '🚜', category: 'Lugar' },
]

export default function CategoryGame() {
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [picked, setPicked] = useState<Category | null>(null)
  const item = useMemo(() => ITEMS[round % ITEMS.length], [round])

  function choose(category: Category) {
    if (picked !== null) return
    setPicked(category)
    if (category === item.category) {
      setScore(s => s + 1)
      addStars('category', 1)
      playCorrect()
      shootConfetti()
      setTimeout(() => { setRound(r => r + 1); setPicked(null) }, 750)
    } else {
      playIncorrect()
      setTimeout(() => setPicked(null), 650)
    }
  }

  return (
    <div className="container">
      <div className="game">
        <h2>Qual é a Categoria? 📚</h2>
        <p>Observe a palavra e escolha o grupo ao qual ela pertence.</p>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span>Rodada: <strong>{round + 1}</strong></span>
          <span>Acertos: <strong>{score}</strong></span>
        </div>
        <div className="category-item">
          <span>{item.emoji}</span>
          <strong>{item.name}</strong>
        </div>
        <div className="choice-grid categories-grid">
          {CATEGORIES.map(category => (
            <button
              key={category}
              className={picked !== null && category === item.category ? 'accent' : picked === category ? 'danger' : ''}
              onClick={() => choose(category)}
            >
              {category === 'Animal' ? '🐾' : category === 'Alimento' ? '🍽️' : category === 'Objeto' ? '🎒' : '📍'} {category}
            </button>
          ))}
        </div>
        <p style={{ minHeight: 24, textAlign: 'center', fontWeight: 700 }}>
          {picked === item.category ? 'Classificação correta! 🌟' : picked ? 'Pense no que essa palavra representa e tente novamente.' : ''}
        </p>
      </div>
    </div>
  )
}
