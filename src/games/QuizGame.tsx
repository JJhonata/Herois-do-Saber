import { useMemo, useState } from 'react'
import { playCorrect, playIncorrect } from '../lib/sfx'
import { addStars } from '../lib/progress'

type Q = { q: string, options: string[], correct: number }
type Category = 'geral' | 'ciencias' | 'portugues' | 'geografia'

const BANK: Record<Category, Q[]> = {
  geral: [
    { q: 'Qual é a capital do Brasil?', options: ['Rio', 'Brasília', 'São Paulo', 'BH'], correct: 1 },
    { q: 'Quanto é 3 + 2?', options: ['4', '5', '6', '2'], correct: 1 },
    { q: 'Qual é uma vogal?', options: ['b', 'c', 'a', 'd'], correct: 2 },
    { q: 'Qual é um número par?', options: ['3', '5', '8', '9'], correct: 2 },
    { q: 'Qual animal mia?', options: ['Cachorro', 'Gato', 'Pássaro', 'Vaca'], correct: 1 },
    { q: 'O sol nasce no...', options: ['Norte', 'Leste', 'Sul', 'Oeste'], correct: 1 },
    { q: 'Quanto é 10 - 6?', options: ['3', '5', '4', '2'], correct: 2 },
    { q: 'Qual é o maior mamífero?', options: ['Elefante', 'Baleia-azul', 'Girafa', 'Urso'], correct: 1 },
    { q: 'Ar é formado por...', options: ['Somente oxigênio', 'Mistura de gases', 'Somente gás carbônico', 'Água'], correct: 1 },
  ],
  ciencias: [
    { q: 'A água ferve a quantos °C?', options: ['50', '80', '100', '120'], correct: 2 },
    { q: 'Qual planeta é vermelho?', options: ['Vênus', 'Marte', 'Júpiter', 'Saturno'], correct: 1 },
    { q: 'Os peixes respiram com...', options: ['Pulmões', 'Brânquias', 'Pele', 'Boca'], correct: 1 },
    { q: 'As abelhas produzem...', options: ['Leite', 'Mel', 'Manteiga', 'Suco'], correct: 1 },
    { q: 'Plantas fazem fotossíntese usando...', options: ['Luz', 'Açúcar', 'Sal', 'Areia'], correct: 0 },
  ],
  portugues: [
    { q: 'Qual palavra está escrita corretamente?', options: ['Caza', 'Casa', 'Kaza', 'Cassa'], correct: 1 },
    { q: 'Sinônimo de “feliz” é...', options: ['Triste', 'Alegre', 'Bravo', 'Lento'], correct: 1 },
    { q: 'Plural de “flor” é...', options: ['Flores', 'Florês', 'Flor', 'Floris'], correct: 0 },
    { q: 'A sílaba tônica de “janela” é...', options: ['ja', 'ne', 'la', 'to'], correct: 1 },
    { q: 'Antônimo de “alto” é...', options: ['Grande', 'Forte', 'Baixo', 'Claro'], correct: 2 },
  ],
  geografia: [
    { q: 'Região com a Floresta Amazônica:', options: ['Sul', 'Sudeste', 'Norte', 'Centro-Oeste'], correct: 2 },
    { q: 'O maior oceano é o...', options: ['Atlântico', 'Índico', 'Ártico', 'Pacífico'], correct: 3 },
    { q: 'Capitais do Nordeste: Salvador é de...', options: ['PE', 'AL', 'BA', 'SE'], correct: 2 },
    { q: 'Qual é o país ao sul do Brasil?', options: ['Peru', 'Chile', 'Argentina', 'Equador'], correct: 2 },
    { q: 'Qual continente tem o deserto do Saara?', options: ['Ásia', 'África', 'América', 'Europa'], correct: 1 },
  ],
}

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function QuizGame() {
  const [category, setCategory] = useState<Category>('geral')
  const questions = useMemo(() => shuffle(BANK[category]).slice(0, 7), [category])
  const [i, setI] = useState(0)
  const [chosen, setChosen] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const q = questions[i]
  function restart(cat: Category) {
    setCategory(cat)
    setI(0)
    setScore(0)
    setChosen(null)
  }

  function pick(idx: number) {
    if (chosen !== null) return
    setChosen(idx)
    if (idx === q.correct) { setScore(s=>s+1); playCorrect(); addStars('quiz', 1); setTimeout(()=> next(), 700) } else { playIncorrect() }
  }

  function next() {
    setChosen(null)
    setI((i+1) % questions.length)
  }

  return (
    <div className="container">
      <div className="game">
        <h2>Quiz ❓</h2>
        <div className="row" style={{ alignItems: 'center' }}>
          <label>Categoria:</label>
          <select value={category} onChange={e=> restart(e.target.value as Category)}>
            <option value="geral">Geral</option>
            <option value="ciencias">Ciências</option>
            <option value="portugues">Português</option>
            <option value="geografia">Geografia</option>
          </select>
          <span style={{ marginLeft: 'auto' }}>Pergunta {i+1} de {questions.length} — Pontos: <strong>{score}</strong></span>
        </div>
        <div style={{ height: 8 }} />
        <p style={{ fontSize: 22 }}>{q.q}</p>
        <div className="row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
          {q.options.map((opt, idx) => (
            <button key={idx} onClick={()=>pick(idx)} className={chosen===idx ? (idx===q.correct ? 'accent' : 'danger') : ''} style={{ fontSize: 18, textAlign: 'left' }}>
              {opt}
            </button>
          ))}
        </div>
        <div className="row" style={{ marginTop: 12 }}>
          <button className="secondary" onClick={next}>Próxima</button>
        </div>
      </div>
    </div>
  )
}


