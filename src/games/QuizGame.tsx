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
    { q: 'Qual é a cor do céu em um dia claro?', options: ['Azul', 'Verde', 'Amarelo', 'Vermelho'], correct: 0 },
    { q: 'O que usamos para escovar os dentes?', options: ['Pente', 'Escova de dentes', 'Fio dental', 'Tesoura'], correct: 1 },
    { q: 'Qual é o nome do animal que pula e tem uma bolsa?', options: ['Coelho', 'Macaco', 'Canguru', 'Leão'], correct: 2 },
    { q: 'Quantos dias tem uma semana?', options: ['5', '7', '6', '8'], correct: 1 },
    { q: 'Qual é a fruta que é amarela e curvada?', options: ['Maçã', 'Abacaxi', 'Banana', 'Laranja'], correct: 2 },
    { q: 'Qual é o maior planeta do sistema solar?', options: ['Terra', 'Marte', 'Júpiter', 'Saturno'], correct: 2 },
    { q: 'Qual é o nome do nosso satélite natural?', options: ['Lua', 'Sol', 'Estrela', 'Planeta'], correct: 0 },
    { q: 'Qual é o animal que tem o pescoço longo?', options: ['Leão', 'Girafa', 'Cavalo', 'Tigre'], correct: 1 },
    { q: 'O que usamos para escrever?', options: ['Agulha', 'Tesoura', 'Lápis', 'Borracha'], correct: 2 },
    { q: 'Quantos segundos tem um minuto?', options: ['30', '60', '90', '100'], correct: 1 },
  ],
  ciencias: [
    { q: 'A água ferve a quantos °C?', options: ['50', '80', '100', '120'], correct: 2 },
    { q: 'Qual planeta é vermelho?', options: ['Vênus', 'Marte', 'Júpiter', 'Saturno'], correct: 1 },
    { q: 'Os peixes respiram com...', options: ['Pulmões', 'Brânquias', 'Pele', 'Boca'], correct: 1 },
    { q: 'As abelhas produzem...', options: ['Leite', 'Mel', 'Manteiga', 'Suco'], correct: 1 },
    { q: 'Plantas fazem fotossíntese usando...', options: ['Luz', 'Açúcar', 'Sal', 'Areia'], correct: 0 },
    { q: 'Os dinossauros existiram há quanto tempo?', options: ['1000 anos', '1 milhão de anos', '65 milhões de anos', '200 milhões de anos'], correct: 2 },
    { q: 'A Lua é feita de...', options: ['Pedra', 'Ferro', 'Gelo', 'Madeira'], correct: 0 },
    { q: 'O que as plantas precisam para crescer?', options: ['Sol, água e ar', 'Somente água', 'Água e luz elétrica', 'Somente sol'], correct: 0 },
    { q: 'O que é o ciclo da água?', options: ['Chuva', 'Evaporação', 'Infiltração', 'Todos os itens acima'], correct: 3 },
    { q: 'Quem descobriu a penicilina?', options: ['Albert Einstein', 'Isaac Newton', 'Alexander Fleming', 'Louis Pasteur'], correct: 2 },
    { q: 'O que os seres humanos precisam para viver?', options: ['Água', 'Comida', 'Ar', 'Todos os itens acima'], correct: 3 },
    { q: 'Os dinossauros existiram há quanto tempo?', options: ['1000 anos', '1 milhão de anos', '65 milhões de anos', '200 milhões de anos'], correct: 2 },
    { q: 'O que as plantas fazem durante o dia?', options: ['Respiram', 'Fazem fotossíntese', 'Dormem', 'Fazem sombra'], correct: 1 },
    { q: 'Qual desses animais voa?', options: ['Cavalo', 'Passarinho', 'Gato', 'Cachorro'], correct: 1 },
    { q: 'De onde vem o leite?', options: ['Do supermercado', 'Do campo', 'Do mar', 'Das árvores'], correct: 1 },
  ],
  portugues: [
    { q: 'Qual palavra está escrita corretamente?', options: ['Caza', 'Casa', 'Kaza', 'Cassa'], correct: 1 },
    { q: 'Sinônimo de “feliz” é...', options: ['Triste', 'Alegre', 'Bravo', 'Lento'], correct: 1 },
    { q: 'Plural de “flor” é...', options: ['Flores', 'Florês', 'Flor', 'Floris'], correct: 0 },
    { q: 'A sílaba tônica de “janela” é...', options: ['ja', 'ne', 'la', 'to'], correct: 1 },
    { q: 'Antônimo de “alto” é...', options: ['Grande', 'Forte', 'Baixo', 'Claro'], correct: 2 },
    { q: 'Qual é o antônimo de “feliz”?', options: ['Triste', 'Alegre', 'Contento', 'Satisfeito'], correct: 0 },
    { q: 'O que é uma frase declarativa?', options: ['Frase que faz uma pergunta', 'Frase que dá uma ordem', 'Frase que faz uma afirmação', 'Frase que expressa um desejo'], correct: 2 },
    { q: 'Qual é o plural de “cão”?', options: ['Cãos', 'Cães', 'Cãoes', 'Cãeses'], correct: 1 },
    { q: 'Qual dessas palavras é um verbo?', options: ['Correr', 'Cachorro', 'Morar', 'Casa'], correct: 0 },
    { q: 'Qual é o antônimo de “feliz”?', options: ['Triste', 'Alegre', 'Contento', 'Satisfeito'], correct: 0 },
    { q: 'Qual dessas palavras é um verbo?', options: ['Correr', 'Cachorro', 'Morar', 'Casa'], correct: 0 },
    { q: 'Qual é a forma correta do plural de “pão”?', options: ['Pães', 'Paoes', 'Pãos', 'Pãesinho'], correct: 0 },
    { q: 'O que é um substantivo?', options: ['Nome de algo ou alguém', 'Ação', 'Qualidade', 'Estado'], correct: 0 },
    { q: 'Qual palavra está errada?', options: ['Menina', 'Menino', 'Meninao', 'Meninas'], correct: 2 },
  ],
  geografia: [
    { q: 'Região com a Floresta Amazônica:', options: ['Sul', 'Sudeste', 'Norte', 'Centro-Oeste'], correct: 2 },
    { q: 'O maior oceano é o...', options: ['Atlântico', 'Índico', 'Ártico', 'Pacífico'], correct: 3 },
    { q: 'Capitais do Nordeste: Salvador é de...', options: ['PE', 'AL', 'BA', 'SE'], correct: 2 },
    { q: 'Qual é o país ao sul do Brasil?', options: ['Peru', 'Chile', 'Argentina', 'Equador'], correct: 2 },
    { q: 'Qual continente tem o deserto do Saara?', options: ['Ásia', 'África', 'América', 'Europa'], correct: 1 },
    { q: 'Qual é o maior país do mundo?', options: ['Brasil', 'Estados Unidos', 'Rússia', 'China'], correct: 2 },
    { q: 'Quantos continentes existem no mundo?', options: ['6', '7', '8', '5'], correct: 1 },
    { q: 'Qual é a maior cidade do Brasil?', options: ['Rio de Janeiro', 'São Paulo', 'Salvador', 'Brasília'], correct: 1 },
    { q: 'Onde fica a Muralha da China?', options: ['Japão', 'China', 'Coreia', 'Índia'], correct: 1 },
    { q: 'Qual é o nome do maior rio do mundo?', options: ['Mississippi', 'Amazonas', 'Yangtze', 'Nilo'], correct: 1 },
    { q: 'Qual é o maior país do mundo?', options: ['Brasil', 'Estados Unidos', 'Rússia', 'China'], correct: 2 },
    { q: 'Quantos continentes existem no mundo?', options: ['6', '7', '8', '5'], correct: 1 },
    { q: 'Qual é a maior cidade do Brasil?', options: ['Rio de Janeiro', 'São Paulo', 'Salvador', 'Brasília'], correct: 1 },
    { q: 'Onde fica a Muralha da China?', options: ['Japão', 'China', 'Coreia', 'Índia'], correct: 1 },
    { q: 'Qual é o nome do maior rio do mundo?', options: ['Mississippi', 'Amazonas', 'Yangtze', 'Nilo'], correct: 1 },
  ],
}

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function QuizGame() {
  const [category, setCategory] = useState<Category>('geral')
  const questions = useMemo(() => shuffle(BANK[category]).slice(0, 20), [category])
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


