import { useMemo } from 'react'
import { useGameState } from '../lib/gameSession'
import { shuffledCycleIndex, shuffle } from '../lib/questionFlow'
import { addStars, getRecommendedDifficulty, type Difficulty } from '../lib/progress'
import { playCorrect, playIncorrect } from '../lib/sfx'
import { shootConfetti } from '../lib/confetti'
import { recordAnswer } from '../lib/review'

type Cycle = { name: string; emoji: string; steps: string[]; learning: string }
const cycles: Record<Difficulty, Cycle[]> = {
  easy: [
    { name: 'Ciclo de vida da planta', emoji: '🌱', steps: ['A semente encontra água, luz e solo.', 'A semente germina e a planta começa a crescer.', 'A planta adulta produz novas sementes para recomeçar o ciclo.'], learning: 'Uma planta nasce de uma semente, cresce e pode produzir sementes que darão origem a outras plantas.' },
    { name: 'O caminho da água', emoji: '💧', steps: ['O Sol aquece a água de rios e mares.', 'O vapor sobe e forma nuvens.', 'A chuva retorna aos rios e mares, e o Sol aquece a água novamente.'], learning: 'A água circula entre a superfície e a atmosfera em um ciclo contínuo.' },
    { name: 'Da flor a uma nova planta', emoji: '🌸', steps: ['A flor recebe pólen.', 'A flor forma um fruto com sementes.', 'Uma semente pode germinar e dar origem a uma nova planta.'], learning: 'Em muitas plantas, a polinização ajuda a formar frutos com sementes, que podem germinar e originar novas plantas.' },
  ],
  medium: [
    { name: 'A borboleta', emoji: '🦋', steps: ['A borboleta adulta põe ovos.', 'Do ovo nasce a lagarta.', 'A lagarta forma uma crisálida.', 'Da crisálida sai a borboleta adulta.'], learning: 'A borboleta passa por ovo, lagarta, crisálida e fase adulta. Essa transformação é uma metamorfose.' },
    { name: 'O ciclo da água', emoji: '🌦️', steps: ['O calor do Sol evapora parte da água.', 'O vapor esfria e forma pequenas gotas.', 'As gotas se juntam e formam nuvens.', 'A água cai como chuva e retorna a rios e mares.'], learning: 'Evaporação, condensação e precipitação são etapas do ciclo da água.' },
    { name: 'Ciclo de vida da rã', emoji: '🐸', steps: ['A rã adulta põe ovos na água.', 'Dos ovos nascem girinos.', 'O girino cresce, cria patas e perde a cauda.', 'A rã adulta pode pôr ovos e começar o ciclo novamente.'], learning: 'A rã passa por mudanças durante a vida: ovo, girino e fase adulta.' },
  ],
  hard: [
    { name: 'Ciclo de vida da borboleta', emoji: '🦋', steps: ['A borboleta adulta põe ovos nas folhas.', 'Dos ovos nascem lagartas.', 'A lagarta come folhas e cresce.', 'A lagarta forma uma crisálida.', 'Uma borboleta adulta sai da crisálida e pode pôr ovos novamente.'], learning: 'A borboleta passa por ovo, lagarta, crisálida e fase adulta. A borboleta adulta põe ovos e o ciclo recomeça.' },
    { name: 'Ciclo de vida do girassol', emoji: '🌻', steps: ['A semente encontra água, ar e temperatura adequados.', 'A semente germina e nasce uma muda.', 'A planta cresce e produz flores.', 'A flor forma sementes.', 'As sementes podem germinar e iniciar novas plantas.'], learning: 'O girassol nasce de uma semente, cresce, floresce e produz sementes que podem iniciar um novo ciclo.' },
    { name: 'O ciclo da água completo', emoji: '🌊', steps: ['O calor provoca evaporação de mares, rios e do solo.', 'O vapor sobe e esfria na atmosfera.', 'O vapor condensa e forma nuvens.', 'A água retorna como chuva, neve ou granizo.', 'A água infiltra no solo ou escoa até rios e oceanos.'], learning: 'A água muda de estado e circula pela atmosfera, pelo solo, pelos rios e pelos oceanos.' },
  ],
}

export default function HabitatCycleGame() {
  const [level, setLevel] = useGameState<Difficulty>(() => getRecommendedDifficulty('nature'))
  const [round, setRound] = useGameState(0)
  const [savedSteps, setSavedSteps] = useGameState<string[]>([])
  const [, setMessage] = useGameState('')
  const [completed, setCompleted] = useGameState(false)
  const [selected, setSelected] = useGameState<string | null>(null)
  const cycle = cycles[level][shuffledCycleIndex(cycles[level].length, round, `nature:${level}`)]
  const firstWrongIndex = savedSteps.findIndex((step, index) => step !== cycle.steps[index])
  const stepIndex = Math.min(cycle.steps.length - 1, firstWrongIndex === -1 ? savedSteps.length : firstWrongIndex)
  const sequence = cycle.steps.slice(0, stepIndex)
  const options = useMemo(() => shuffle(cycle.steps.slice(stepIndex)), [level, round, stepIndex])
  const expected = cycle.steps[stepIndex]
  const isCorrect = selected !== null && selected === expected
  const feedback = selected === null ? '' : isCorrect ? 'Isso mesmo! Essa é a próxima etapa. 🌟' : 'Ainda não. Pense no que precisa acontecer antes dessa etapa.'

  function choose(step: string) {
    if (completed || isCorrect) return
    const correct = step === expected
    recordAnswer('nature', `No ciclo "${cycle.name}", o que acontece na etapa ${stepIndex + 1}?`, step, expected, correct, cycle.learning)
    setSelected(step)
    if (correct) {
      setMessage('Isso mesmo! Essa é a próxima etapa. 🌟')
      playCorrect()
    } else {
      setMessage('Ainda não. Pense no que precisa acontecer antes dessa etapa.')
      playIncorrect()
    }
  }

  function continueCycle() {
    if (!isCorrect) return
    const nextStepIndex = stepIndex + 1
    setSavedSteps(cycle.steps.slice(0, nextStepIndex))
    setSelected(null)
    if (nextStepIndex === cycle.steps.length) {
      setCompleted(true)
      setMessage(`Ciclo completo! ${cycle.learning}`)
      addStars('nature', 1)
      shootConfetti()
    } else {
      setMessage('')
    }
  }

  function nextCycle() {
    setRound((value) => value + 1)
    setSavedSteps([])
    setSelected(null)
    setCompleted(false)
    setMessage('')
  }

  return <div className="container"><div className="game nature-game">
    <h2>Ciclos da Natureza 🌿</h2>
    <p>Toque na opção que vem agora. Você responde uma etapa por vez.</p>
    <div className="row difficulty-picker"><label htmlFor="nature-level">Nível:</label><select id="nature-level" value={level} onChange={(event) => { setLevel(event.target.value as Difficulty); setRound(0); setSavedSteps([]); setSelected(null); setCompleted(false); setMessage('') }}><option value="easy">Começando · ciclos curtos</option><option value="medium">Praticando · mais etapas</option><option value="hard">Desafio · etapas mais detalhadas</option></select></div>
    <section className="nature-cycle-heading"><span aria-hidden="true">{cycle.emoji}</span><div><strong>{cycle.name}</strong><small>Etapa {completed ? cycle.steps.length : stepIndex + 1} de {cycle.steps.length}</small></div></section>
    {completed ? <>
      <h3 className="nature-result-title">Você completou o ciclo! 🎉</h3>
      <ol className="nature-sequence-summary">{cycle.steps.map((step) => <li key={step}>{step}</li>)}</ol>
      <p className="nature-learning-note">{cycle.learning}</p>
      <button type="button" className="accent nature-next-button" onClick={nextCycle}>Próximo ciclo →</button>
    </> : <>
      <div className="nature-progress-track" aria-label={`Etapa ${stepIndex + 1} de ${cycle.steps.length}`}><span style={{ width: `${(stepIndex / cycle.steps.length) * 100}%` }} /></div>
      {sequence.length > 0 && <ol className="nature-sequence-summary" aria-label="Etapas descobertas até agora">{sequence.map((step) => <li key={step}>{step}</li>)}</ol>}
      <h3 className="nature-question">{stepIndex === 0 ? 'O que acontece primeiro?' : 'E depois, o que acontece?'}</h3>
      <div className="nature-choices" aria-label="Escolha a próxima etapa">
        {options.map((step) => <button type="button" key={step} disabled={isCorrect} className={selected === step ? (isCorrect ? 'correct' : 'incorrect') : ''} onClick={() => choose(step)}><span aria-hidden="true">{selected === step ? (isCorrect ? '✓' : '↻') : '○'}</span>{step}</button>)}
      </div>
      <p className={`game-message nature-feedback${selected && !isCorrect ? ' retry' : ''}`} aria-live="polite">{feedback}</p>
      {isCorrect && <button type="button" className="accent nature-next-button" onClick={continueCycle}>{stepIndex + 1 === cycle.steps.length ? 'Concluir ciclo' : 'Próxima etapa →'}</button>}
    </>}
  </div></div>
}
