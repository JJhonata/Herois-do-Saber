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
    { q: 'Qual destes é um meio de transporte?', options: ['Cadeira', 'Avião', 'Mesa', 'Janela'], correct: 1 },
    { q: 'Qual cor resulta da mistura de azul com amarelo?', options: ['Roxo', 'Verde', 'Laranja', 'Marrom'], correct: 1 },
    { q: 'Quantos dias tem uma semana?', options: ['5', '6', '7', '8'], correct: 2 },
    { q: 'Qual destes é um instrumento musical?', options: ['Piano', 'Livro', 'Copo', 'Lápis'], correct: 0 },
    { q: 'Que horas da manhã normalmente tomamos café?', options: ['Meia-noite', 'Café da manhã', 'Almoço', 'Jantar'], correct: 1 },
    { q: 'Qual destes é um continente?', options: ['Brasil', 'África', 'Bahia', 'Amazonas'], correct: 1 },
    { q: 'Qual é o plural de “pão”?', options: ['Pãos', 'Pães', 'Paões', 'Pãoses'], correct: 1 },
    { q: 'O que usamos para medir o tempo?', options: ['Régua', 'Relógio', 'Tesoura', 'Bússola'], correct: 1 },
    { q: 'Qual destes é um esporte?', options: ['Futebol', 'Dormir', 'Ler', 'Cozinhar'], correct: 0 },
    { q: 'Qual é o resultado de 6 + 4?', options: ['9', '10', '11', '8'], correct: 1 },
    { q: 'Qual destes é um planeta?', options: ['Lua', 'Sol', 'Terra', 'Estrela Cadente'], correct: 2 },
  ],
  ciencias: [
    { q: 'A água ferve a quantos °C?', options: ['50', '80', '100', '120'], correct: 2 },
    { q: 'Qual planeta é vermelho?', options: ['Vênus', 'Marte', 'Júpiter', 'Saturno'], correct: 1 },
    { q: 'Os peixes respiram com...', options: ['Pulmões', 'Brânquias', 'Pele', 'Boca'], correct: 1 },
    { q: 'As abelhas produzem...', options: ['Leite', 'Mel', 'Manteiga', 'Suco'], correct: 1 },
    { q: 'Plantas fazem fotossíntese usando...', options: ['Luz', 'Açúcar', 'Sal', 'Areia'], correct: 0 },
    { q: 'Qual é o estado da água no gelo?', options: ['Sólido', 'Líquido', 'Gasoso', 'Plasma'], correct: 0 },
    { q: 'O que o coração faz?', options: ['Pensa', 'Bombeia sangue', 'Vê', 'Ouve'], correct: 1 },
    { q: 'De que precisamos para respirar?', options: ['Hélio', 'Oxigênio', 'Nitrogênio líquido', 'Vapor'], correct: 1 },
    { q: 'Qual órgão usamos para cheirar?', options: ['Olhos', 'Nariz', 'Boca', 'Orelhas'], correct: 1 },
    { q: 'O Sol é uma...', options: ['Estrela', 'Planeta', 'Lua', 'Cometa'], correct: 0 },
    { q: 'Qual destes é um mamífero?', options: ['Sapo', 'Tubarão', 'Morcego', 'Papagaio'], correct: 2 },
    { q: 'Água no ponto de congelamento tem quantos °C?', options: ['0', '10', '5', '-5'], correct: 0 },
    { q: 'Qual parte da planta absorve água do solo?', options: ['Folha', 'Raiz', 'Flor', 'Fruto'], correct: 1 },
    { q: 'Insetos têm quantas pernas?', options: ['4', '6', '8', '10'], correct: 1 },
    { q: 'Qual gás as plantas liberam na fotossíntese?', options: ['Oxigênio', 'Hidrogênio', 'Nitrogênio', 'Hélio'], correct: 0 },
    { q: 'O que protege a Terra de radiações solares?', options: ['Montanhas', 'Ozonosfera', 'Nuvens', 'Rios'], correct: 1 },
    { q: 'Qual destes é um réptil?', options: ['Cobra', 'Sapo', 'Formiga', 'Golfinho'], correct: 0 },
    { q: 'Os ossos formam o...', options: ['Sistema nervoso', 'Esqueleto', 'Sistema digestivo', 'Pele'], correct: 1 },
    { q: 'Qual é a principal fonte de energia para a Terra?', options: ['Lua', 'Sol', 'Vento', 'Mar'], correct: 1 },
    { q: 'Qual destes é um sentido humano?', options: ['Pensar', 'Tato', 'Respirar', 'Andar'], correct: 1 },
  ],
  portugues: [
    { q: 'Qual palavra está escrita corretamente?', options: ['Caza', 'Casa', 'Kaza', 'Cassa'], correct: 1 },
    { q: 'Sinônimo de “feliz” é...', options: ['Triste', 'Alegre', 'Bravo', 'Lento'], correct: 1 },
    { q: 'Plural de “flor” é...', options: ['Flores', 'Florês', 'Flor', 'Floris'], correct: 0 },
    { q: 'A sílaba tônica de “janela” é...', options: ['ja', 'ne', 'la', 'to'], correct: 1 },
    { q: 'Antônimo de “alto” é...', options: ['Grande', 'Forte', 'Baixo', 'Claro'], correct: 2 },
    { q: 'Qual frase está corretamente pontuada?', options: ['Oi tudo bem?', 'Oi, tudo bem?', 'Oi tudo, bem?', 'Oi tudo, bem.'], correct: 1 },
    { q: 'Qual é o diminutivo de “casa”?', options: ['Casão', 'Casinha', 'Caseiro', 'Casita'], correct: 1 },
    { q: 'Qual é o aumentativo de “pato”?', options: ['Patão', 'Patinho', 'Pateiro', 'Patudo'], correct: 0 },
    { q: 'Qual destas é uma interjeição?', options: ['Correr', 'Ai!', 'Belo', 'Cedo'], correct: 1 },
    { q: 'Qual é o feminino de “ator”?', options: ['Atora', 'Atriz', 'Atoriza', 'Atorona'], correct: 1 },
    { q: 'Qual palavra é um verbo?', options: ['Correr', 'Rápido', 'Azul', 'Mesa'], correct: 0 },
    { q: 'Qual é um adjetivo?', options: ['Cantar', 'Feliz', 'Casa', 'Brasil'], correct: 1 },
    { q: 'Qual é o plural de “animal”?', options: ['Animais', 'Animales', 'Animáls', 'Animaes'], correct: 0 },
    { q: 'Qual destas tem acento?', options: ['Parabens', 'Voce', 'Fácil', 'Feliz'], correct: 2 },
    { q: 'Complete: Eu ____ ao parque.', options: ['vou', 'vai', 'fui', 'iremos'], correct: 0 },
    { q: 'Sinônimo de “rápido” é...', options: ['Devagar', 'Veloz', 'Lento', 'Calmo'], correct: 1 },
    { q: 'Antônimo de “triste” é...', options: ['Contente', 'Chateado', 'Aborrecido', 'Mau'], correct: 0 },
    { q: 'Qual é a forma correta?', options: ['Houveram muitas pessoas', 'Houve muitas pessoas', 'Teve muitas pessoas', 'Tinha muitas pessoas'], correct: 1 },
    { q: 'Qual pronome completa: ____ amo você.', options: ['Me', 'Te', 'Eu', 'Nos'], correct: 2 },
    { q: 'Qual artigo definido masculino singular?', options: ['Os', 'Um', 'O', 'Uns'], correct: 2 },
  ],
  geografia: [
    { q: 'Região com a Floresta Amazônica:', options: ['Sul', 'Sudeste', 'Norte', 'Centro-Oeste'], correct: 2 },
    { q: 'O maior oceano é o...', options: ['Atlântico', 'Índico', 'Ártico', 'Pacífico'], correct: 3 },
    { q: 'Capitais do Nordeste: Salvador é de...', options: ['PE', 'AL', 'BA', 'SE'], correct: 2 },
    { q: 'Qual é o país ao sul do Brasil?', options: ['Peru', 'Chile', 'Argentina', 'Equador'], correct: 2 },
    { q: 'Qual continente tem o deserto do Saara?', options: ['Ásia', 'África', 'América', 'Europa'], correct: 1 },
    { q: 'Qual é a capital de São Paulo (estado)?', options: ['Campinas', 'Santos', 'São Paulo', 'Sorocaba'], correct: 2 },
    { q: 'O Rio Amazonas deságua em qual oceano?', options: ['Pacífico', 'Índico', 'Atlântico', 'Ártico'], correct: 2 },
    { q: 'O Brasil fica em qual continente?', options: ['África', 'Europa', 'América do Sul', 'Ásia'], correct: 2 },
    { q: 'Qual é o ponto cardeal oposto ao norte?', options: ['Leste', 'Sul', 'Oeste', 'Nordeste'], correct: 1 },
    { q: 'Qual país fala português na Europa?', options: ['Espanha', 'Itália', 'Portugal', 'França'], correct: 2 },
    { q: 'Qual destes é um bioma brasileiro?', options: ['Tundra', 'Taiga', 'Caatinga', 'Pradaria'], correct: 2 },
    { q: 'Qual é a capital do México?', options: ['Guadalajara', 'Monterrey', 'Cidade do México', 'Cancún'], correct: 2 },
    { q: 'Qual continente é conhecido como “berço da humanidade”?', options: ['Ásia', 'África', 'Europa', 'Oceania'], correct: 1 },
    { q: 'Qual desses é um deserto?', options: ['Saara', 'Amazônia', 'Pantanal', 'Everest'], correct: 0 },
    { q: 'Qual é a capital da Argentina?', options: ['Córdoba', 'Mendoza', 'Rosário', 'Buenos Aires'], correct: 3 },
    { q: 'Quantos estados tem o Brasil?', options: ['24', '26', '27', '25'], correct: 2 },
    { q: 'Qual é o maior país do mundo em área?', options: ['China', 'Estados Unidos', 'Rússia', 'Canadá'], correct: 2 },
    { q: 'Qual oceano banha o litoral brasileiro?', options: ['Pacífico', 'Índico', 'Atlântico', 'Glacial'], correct: 2 },
    { q: 'Qual é a capital do Chile?', options: ['Santiago', 'Valparaíso', 'Concepción', 'Iquique'], correct: 0 },
    { q: 'Qual direção fica entre norte e leste?', options: ['Noroeste', 'Nordeste', 'Sudeste', 'Sudoeste'], correct: 1 },
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