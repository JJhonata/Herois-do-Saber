import { useMemo } from 'react'
import { useGameState } from '../lib/gameSession'
import { shuffledCycleIndex } from '../lib/questionFlow'
import { addStars, getRecommendedDifficulty, type Difficulty } from '../lib/progress'
import { playCorrect, playIncorrect } from '../lib/sfx'
import { shootConfetti } from '../lib/confetti'
import { recordAnswer } from '../lib/review'

type Fact = { statement: string; answer: boolean; explanation: string; emoji: string }

const FACTS: Fact[] = [
  { statement: 'O Sol é uma estrela.', answer: true, explanation: 'O Sol é a estrela mais próxima da Terra.', emoji: '☀️' },
  { statement: 'As plantas não precisam de água para viver.', answer: false, explanation: 'As plantas precisam de água, luz e nutrientes para crescer.', emoji: '🌱' },
  { statement: 'A Terra gira ao redor do Sol.', answer: true, explanation: 'Esse movimento é chamado de translação.', emoji: '🌍' },
  { statement: 'Peixes respiram usando pulmões como os seres humanos.', answer: false, explanation: 'A maioria dos peixes respira por brânquias.', emoji: '🐟' },
  { statement: 'A água pode ser encontrada nos estados sólido, líquido e gasoso.', answer: true, explanation: 'Gelo, água líquida e vapor são três estados físicos da água.', emoji: '💧' },
  { statement: 'A Lua produz sua própria luz.', answer: false, explanation: 'A Lua reflete a luz que recebe do Sol.', emoji: '🌙' },
  { statement: 'O coração ajuda a bombear o sangue pelo corpo.', answer: true, explanation: 'O coração impulsiona o sangue pelo sistema circulatório.', emoji: '❤️' },
  { statement: 'Todo animal nasce de um ovo.', answer: false, explanation: 'Há animais ovíparos e também vivíparos, entre outros grupos.', emoji: '🐣' },
  { statement: 'Separar materiais recicláveis ajuda o meio ambiente.', answer: true, explanation: 'A separação facilita a reciclagem e reduz resíduos.', emoji: '♻️' },
  { statement: 'O ar não ocupa espaço.', answer: false, explanation: 'Mesmo invisível, o ar é matéria e ocupa espaço.', emoji: '💨' },
  { statement: 'Os seres humanos precisam de oxigênio para respirar.', answer: true, explanation: 'O oxigênio participa do processo de respiração celular.', emoji: '🫁' },
  { statement: 'O gelo é água no estado sólido.', answer: true, explanation: 'Ao congelar, a água passa do estado líquido para o sólido.', emoji: '🧊' },
  { statement: 'As aranhas são insetos.', answer: false, explanation: 'Aranhas são aracnídeos e possuem oito pernas.', emoji: '🕷️' },
  { statement: 'A raiz ajuda a planta a absorver água do solo.', answer: true, explanation: 'As raízes absorvem água e sais minerais.', emoji: '🌿' },
  { statement: 'O planeta Terra possui apenas água salgada.', answer: false, explanation: 'Também existe água doce em rios, lagos, geleiras e no subsolo.', emoji: '🌎' },
  { statement: 'Mamíferos alimentam seus filhotes com leite.', answer: true, explanation: 'A produção de leite é uma característica dos mamíferos.', emoji: '🐄' },
  { statement: 'Som pode se propagar no vácuo.', answer: false, explanation: 'O som precisa de um meio material para se propagar.', emoji: '🔊' },
  { statement: 'A reciclagem pode transformar materiais usados em novos produtos.', answer: true, explanation: 'Reciclar reduz desperdícios e reaproveita matérias-primas.', emoji: '♻️' },
  { statement: 'O cérebro faz parte do sistema nervoso.', answer: true, explanation: 'O cérebro coordena muitas funções do corpo.', emoji: '🧠' },
  { statement: 'Todos os planetas possuem luz própria.', answer: false, explanation: 'Planetas refletem a luz das estrelas; não produzem luz como elas.', emoji: '🪐' },
  { statement: 'A Terra tem um satélite natural chamado Lua.', answer: true, explanation: 'A Lua acompanha a Terra em sua órbita e reflete a luz do Sol.', emoji: '🌕' },
  { statement: 'O som consegue viajar pelo espaço vazio.', answer: false, explanation: 'O som precisa de matéria, como ar ou água, para se propagar.', emoji: '🚀' },
  { statement: 'As baleias são mamíferos.', answer: true, explanation: 'Baleias respiram ar, têm sangue quente e amamentam seus filhotes.', emoji: '🐋' },
  { statement: 'Mercúrio é o planeta mais próximo do Sol.', answer: true, explanation: 'Mercúrio é o primeiro planeta do Sistema Solar a partir do Sol.', emoji: '☀️' },
  { statement: 'A luz viaja mais devagar que o som no ar.', answer: false, explanation: 'A luz chega muito antes do som, como vemos durante uma tempestade.', emoji: '⚡' },
  { statement: 'A água do mar é geralmente salgada.', answer: true, explanation: 'A água do mar contém sais dissolvidos; rios e lagos costumam ter água doce.', emoji: '🌊' },
  { statement: 'As raízes ajudam a planta a se prender ao solo.', answer: true, explanation: 'Além de absorver água e sais minerais, as raízes ajudam a sustentar a planta.', emoji: '🌱' },
  { statement: 'O ar é uma mistura de gases.', answer: true, explanation: 'O ar contém principalmente nitrogênio e oxigênio, além de outros gases.', emoji: '💨' },
  { statement: 'A sombra aparece quando a luz atravessa um objeto opaco.', answer: false, explanation: 'A sombra aparece quando um objeto bloqueia a passagem da luz.', emoji: '🔦' },
  { statement: 'O gelo derrete quando recebe calor suficiente.', answer: true, explanation: 'Com o aquecimento, a água passa do estado sólido para o líquido.', emoji: '🧊' },
  { statement: 'Os morcegos são aves porque voam.', answer: false, explanation: 'Morcegos são mamíferos: têm pelos e alimentam os filhotes com leite.', emoji: '🦇' },
]

export default function ScienceTrueFalse() {
  const [level, setLevel] = useGameState<Difficulty>(() => getRecommendedDifficulty('science'))
  const [round, setRound] = useGameState(0)
  const [score, setScore] = useGameState(0)
  const [answer, setAnswer] = useGameState<boolean | null>(null)
  const deck = level === 'easy'
    ? [...FACTS.slice(0, 8), ...FACTS.slice(20, 24)]
    : level === 'medium'
      ? [...FACTS.slice(4, 16), ...FACTS.slice(24, 27)]
      : FACTS.slice(8)
  const fact = useMemo(() => deck[shuffledCycleIndex(deck.length, round, `science:${level}`)], [round, level])
  const correct = answer === fact.answer

  function choose(value: boolean) {
    if (answer !== null) return
    recordAnswer('science', fact.statement, value ? 'Verdadeiro' : 'Falso', fact.answer ? 'Verdadeiro' : 'Falso', value === fact.answer, fact.explanation)
    setAnswer(value)
    if (value === fact.answer) {
      setScore(s => s + 1)
      addStars('science', 1)
      playCorrect()
      shootConfetti()
    } else {
      playIncorrect()
    }
  }

  function next() {
    setRound(r => r + 1)
    setAnswer(null)
  }

  return (
    <div className="container">
      <div className="game">
        <h2>Verdadeiro ou Falso: Ciências 🔬</h2>
        <div className="row difficulty-picker"><label htmlFor="science-level">Nível:</label><select id="science-level" value={level} onChange={event => { setLevel(event.target.value as Difficulty); setRound(0); setScore(0); setAnswer(null) }}><option value="easy">Começando · fatos básicos</option><option value="medium">Praticando · observe os detalhes</option><option value="hard">Desafio · conceitos científicos</option></select></div>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span>Pergunta: <strong>{round + 1}</strong></span>
          <span>Acertos: <strong>{score}</strong></span>
        </div>
        <div className="fact-card">
          <div style={{ fontSize: 72 }}>{fact.emoji}</div>
          <p>{fact.statement}</p>
        </div>
        <div className="true-false-actions">
          <button className="accent" disabled={answer !== null} onClick={() => choose(true)}>✅ Verdadeiro</button>
          <button className="danger" disabled={answer !== null} onClick={() => choose(false)}>❌ Falso</button>
        </div>
        {answer !== null && (
          <div className={`feedback-box ${correct ? 'feedback-correct' : 'feedback-wrong'}`} role="status" aria-live="polite">
            <strong>{correct ? 'Muito bem!' : 'Não foi dessa vez.'}</strong>
            <div>{fact.explanation}</div>
            <button className="secondary" onClick={next} style={{ marginTop: 12 }}>Próxima pergunta</button>
          </div>
        )}
      </div>
    </div>
  )
}
