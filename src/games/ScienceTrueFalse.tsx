import { useMemo, useState } from 'react'
import { addStars } from '../lib/progress'
import { playCorrect, playIncorrect } from '../lib/sfx'
import { shootConfetti } from '../lib/confetti'

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
]

export default function ScienceTrueFalse() {
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [answer, setAnswer] = useState<boolean | null>(null)
  const fact = useMemo(() => FACTS[round % FACTS.length], [round])
  const correct = answer === fact.answer

  function choose(value: boolean) {
    if (answer !== null) return
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
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span>Pergunta: <strong>{round + 1}</strong></span>
          <span>Acertos: <strong>{score}</strong></span>
        </div>
        <div className="fact-card">
          <div style={{ fontSize: 72 }}>{fact.emoji}</div>
          <p>{fact.statement}</p>
        </div>
        <div className="true-false-actions">
          <button className="accent" onClick={() => choose(true)}>✅ Verdadeiro</button>
          <button className="danger" onClick={() => choose(false)}>❌ Falso</button>
        </div>
        {answer !== null && (
          <div className={`feedback-box ${correct ? 'feedback-correct' : 'feedback-wrong'}`}>
            <strong>{correct ? 'Muito bem!' : 'Não foi dessa vez.'}</strong>
            <div>{fact.explanation}</div>
            <button className="secondary" onClick={next} style={{ marginTop: 12 }}>Próxima pergunta</button>
          </div>
        )}
      </div>
    </div>
  )
}
