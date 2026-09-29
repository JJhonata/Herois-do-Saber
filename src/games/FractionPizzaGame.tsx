import { useMemo, useState } from 'react'
import { useGameState } from '../lib/gameSession'
import { addStars, getRecommendedDifficulty, type Difficulty } from '../lib/progress'
import { playCorrect, playIncorrect } from '../lib/sfx'
import { shootConfetti } from '../lib/confetti'
import { recordAnswer } from '../lib/review'

type Fraction = { numerator: number; denominator: number }

const fractions: Record<Difficulty, Fraction[]> = {
  easy: [{ numerator: 1, denominator: 2 }, { numerator: 1, denominator: 3 }, { numerator: 1, denominator: 4 }, { numerator: 2, denominator: 3 }],
  medium: [{ numerator: 2, denominator: 3 }, { numerator: 3, denominator: 4 }, { numerator: 2, denominator: 5 }, { numerator: 3, denominator: 5 }, { numerator: 5, denominator: 6 }],
  hard: [{ numerator: 3, denominator: 8 }, { numerator: 5, denominator: 8 }, { numerator: 4, denominator: 7 }, { numerator: 5, denominator: 6 }, { numerator: 7, denominator: 10 }],
}

function formatFraction({ numerator, denominator }: Fraction) { return `${numerator}/${denominator}` }

export default function FractionPizzaGame() {
  const [level, setLevel] = useGameState<Difficulty>(() => getRecommendedDifficulty('fractions'))
  const [round, setRound] = useGameState(0)
  const [picked, setPicked] = useGameState<string | null>(null)
  const [message, setMessage] = useGameState('')
  const [wrongAnswer, setWrongAnswer] = useState(false)
  const fraction = fractions[level][round % fractions[level].length]
  const options = useMemo(() => {
    const correct = formatFraction(fraction)
    const alternatives = Array.from({ length: 9 }, (_, index) => index + 2)
      .flatMap((denominator) => Array.from({ length: denominator - 1 }, (_, index) => ({ numerator: index + 1, denominator })))
      .filter(({ numerator, denominator }) => numerator * fraction.denominator !== fraction.numerator * denominator)
      .map(formatFraction)
    return [correct, ...alternatives.sort(() => Math.random() - 0.5).slice(0, 3)].sort(() => Math.random() - 0.5)
  }, [round, level, fraction])

  function choose(option: string) {
    if (picked) return
    const expected = formatFraction(fraction)
    const correct = option === expected
    recordAnswer('fractions', `Que fração da pizza está com cobertura? (${fraction.numerator} de ${fraction.denominator} pedaços)`, option, expected, correct, `O denominador ${fraction.denominator} mostra o total de pedaços iguais. O numerador ${fraction.numerator} mostra quantos têm cobertura.`)
    if (correct) {
      setPicked(option)
      setWrongAnswer(false)
      setMessage(`Correto! ${fraction.numerator} é o numerador: pedaços com cobertura. ${fraction.denominator} é o denominador: pedaços ao todo.`)
      addStars('fractions', 1)
      playCorrect()
      shootConfetti()
    } else {
      setWrongAnswer(true)
      playIncorrect()
      setMessage('Conte primeiro os pedaços com cobertura e depois todos os pedaços.')
    }
  }

  function nextPizza() {
    setRound((value) => value + 1)
    setPicked(null)
    setWrongAnswer(false)
    setMessage('')
  }

  return <div className="container"><div className="game fraction-game">
    <h2>Pizzaria das Frações 🍕</h2>
    <p>Observe os pedaços iguais e escolha a fração que mostra a cobertura.</p>
    <div className="row difficulty-picker"><label htmlFor="fractions-level">Nível:</label><select id="fractions-level" value={level} onChange={(event) => { setLevel(event.target.value as Difficulty); setRound(0); setPicked(null); setWrongAnswer(false); setMessage('') }}><option value="easy">Começando · partes simples</option><option value="medium">Praticando · novos denominadores</option><option value="hard">Desafio · pizzas divididas em mais partes</option></select></div>
    <section className="fraction-order" aria-label={`Pizza com ${fraction.numerator} de ${fraction.denominator} pedaços com cobertura`}>
      <span aria-hidden="true" className="fraction-chef">👩‍🍳</span>
      <div><strong>Pedido da rodada {round + 1}</strong><p>“Quero {fraction.numerator} {fraction.numerator === 1 ? 'pedaço' : 'pedaços'} com cobertura. A pizza tem {fraction.denominator} pedaços do mesmo tamanho.”</p></div>
    </section>
    <div className="fraction-pieces" role="img" aria-label={`${fraction.numerator} de ${fraction.denominator} pedaços têm cobertura`} style={{ '--piece-count': fraction.denominator } as React.CSSProperties}>
      {Array.from({ length: fraction.denominator }, (_, index) => <span className={`fraction-piece${index < fraction.numerator ? ' topped' : ''}`} key={index} aria-hidden="true"><svg viewBox="0 0 100 100"><path d="M50 7 8 87q42-15 84 0L50 7Z" className="pizza-slice-base"/><path d="M11 83q39-14 78 0" className="pizza-slice-crust"/>{index < fraction.numerator && <g className="pizza-toppings"><circle cx="42" cy="48" r="5"/><circle cx="57" cy="62" r="5"/><circle cx="50" cy="35" r="4"/></g>}</svg></span>)}
    </div>
    <p className="fraction-count">As bolinhas vermelhas mostram a cobertura. Todos os pedaços têm o mesmo tamanho.</p>
    <div className="choice-grid fraction-options" aria-label="Escolha a fração">
      {options.map((option) => <button type="button" key={option} disabled={Boolean(picked)} className={picked === option ? 'accent' : ''} onClick={() => choose(option)}>{option}</button>)}
    </div>
    <p className="game-message" aria-live="polite">{picked ? message : wrongAnswer ? message : ''}</p>
    {picked && <button type="button" className="accent fraction-next-button" onClick={nextPizza}>Próxima pizza →</button>}
  </div></div>
}
