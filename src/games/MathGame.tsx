import { useEffect, useMemo } from 'react'
import { useGameState } from '../lib/gameSession'
import { playBonus, playCorrect, playIncorrect } from '../lib/sfx'
import { shootConfetti } from '../lib/confetti'
import { addStars, getRecommendedDifficulty } from '../lib/progress'
import { recordAnswer } from '../lib/review'

type Level = 1 | 2 | 3 | 4 | 5
type Op = 'add' | 'sub' | 'mul' | 'div' | 'mix'

function randomIn(max: number) { return Math.floor(Math.random() * (max + 1)) }
function pickOp(op: Op): Exclude<Op, 'mix'> {
  if (op !== 'mix') return op
  const ops: Exclude<Op, 'mix'>[] = ['add', 'sub', 'mul', 'div']
  return ops[Math.floor(Math.random()*ops.length)]
}
function symbolOf(op: Exclude<Op, 'mix'>) { return op==='add' ? '＋' : op==='sub' ? '−' : op==='mul' ? '×' : '÷' }
function buildOptions(correct: number, op: Exclude<Op, 'mix'>) {
  const options = new Set<number>([correct])
  const baseOffsets = op==='mul' ? [1,2,3,4,5,6,7,8,9,10] : op==='div' ? [1,2,3,4,5] : [1,2,3,4,5,6,7]
  let i = 0
  while (options.size < 4 && i < 50) {
    const sign = i % 2 === 0 ? 1 : -1
    const offset = baseOffsets[i % baseOffsets.length] * sign
    const candidate = correct + offset
    if (candidate >= 0) options.add(candidate)
    i++
  }
  return Array.from(options).slice(0,4).sort(()=> Math.random()-0.5)
}
function buildQuestion(level: Level, op: Op) {
  const chosen = pickOp(op)
  const ranges: Record<Level, number> = { 1: 10, 2: 20, 3: 50, 4: 100, 5: 500 }
  const smallRanges: Record<Level, number> = { 1: 5, 2: 10, 3: 12, 4: 15, 5: 20 }
  let a = randomIn(ranges[level])
  let b = randomIn(ranges[level])
  if (chosen === 'sub') { if (b > a) [a, b] = [b, a] }
  if (chosen === 'mul') { a = randomIn(smallRanges[level]); b = randomIn(smallRanges[level]) }
  if (chosen === 'div') {
    // garantir divisão exata: a = x*y, b = y
    const y = Math.max(1, randomIn(smallRanges[level]))
    const x = randomIn(smallRanges[level])
    a = x * y
    b = y
  }
  const correct = chosen==='add' ? (a+b) : chosen==='sub' ? (a-b) : chosen==='mul' ? (a*b) : Math.floor(a/b)
  const shuffled = buildOptions(correct, chosen)
  return { a, b, op: chosen, correct, options: shuffled, symbol: symbolOf(chosen) }
}

export default function MathGame() {
  const [level, setLevel] = useGameState<Level>(() => {
    const recommended = getRecommendedDifficulty('math')
    return recommended === 'easy' ? 1 : recommended === 'medium' ? 3 : 5
  })
  const [op, setOp] = useGameState<Op>('add')
  const [score, setScore] = useGameState(0)
  const [round, setRound] = useGameState(0)
  const q = useMemo(()=> buildQuestion(level, op), [level, round, op])
  const [chosen, setChosen] = useGameState<number | null>(null)
  const [msg, setMsg] = useGameState('')
  const [series, setSeries] = useGameState(10)
  const [remaining, setRemaining] = useGameState(10)
  const [finished, setFinished] = useGameState(false)
  const [timeLeft, setTimeLeft] = useGameState<number | null>(null)
  const [streak, setStreak] = useGameState(0)

  // cronômetro opcional
  useEffect(()=>{
    if (timeLeft === null) return
    if (timeLeft <= 0) { setMsg('Tempo esgotado!'); setChosen(q.correct); const id = setTimeout(()=> next(), 700); return () => clearTimeout(id) }
    const id = setTimeout(()=> setTimeLeft(s => (s as number) - 1), 1000)
    return ()=> clearTimeout(id)
  }, [timeLeft])

  function choose(opt: number) {
    if (chosen !== null || finished) return
    setChosen(opt)
    const ok = opt === q.correct
    recordAnswer('math', `${q.a} ${q.symbol} ${q.b}`, String(opt), String(q.correct), ok, 'Resolva a operação com calma e confira o sinal usado na conta.')
    setMsg(ok ? 'Muito bem! ✅' : 'Ops, tente outra vez!')
    if (ok) {
      setScore(s => s + 1)
      setStreak(k => k + 1)
      if ((streak + 1) % 5 === 0) playBonus()
      playCorrect(); addStars('math', 1); shootConfetti(); setTimeout(()=> next(), 700)
    } else {
      setStreak(0)
      playIncorrect()
    }
  }
  function next() {
    if (remaining <= 1) {
      setRemaining(0)
      setFinished(true)
      setTimeLeft(null)
      setChosen(null)
      setMsg('Série concluída!')
      return
    }
    setRemaining(value => value - 1)
    setChosen(null)
    setMsg('')
    setRound(r => r + 1)
    if (timeLeft !== null) setTimeLeft(15) // reinicia o tempo por questão
  }

  function changeSeries(value: number) {
    setSeries(value)
    setRemaining(value)
    setFinished(false)
    setScore(0)
    setStreak(0)
    setChosen(null)
    setMsg('')
    setRound(round => round + 1)
    if (timeLeft !== null) setTimeLeft(15)
  }

  function restartSeries() {
    setRemaining(series)
    setFinished(false)
    setScore(0)
    setStreak(0)
    setChosen(null)
    setMsg('')
    setRound(round => round + 1)
  }

  return (
    <div className="container">
      <div className="game">
        <h2>Matemática ➗✖️➕➖</h2>
        <div className="row">
          <label htmlFor="math-level">Nível:</label>
          <select id="math-level" value={level} onChange={e=> { setLevel(Number(e.target.value) as Level); restartSeries() }}>
            <option value={1}>Fácil (0-10)</option>
            <option value={2}>Médio (0-20)</option>
            <option value={3}>Difícil (0-50)</option>
            <option value={4}>Desafio (0-100)</option>
            <option value={5}>Super-herói (0-500)</option>
          </select>
          <label style={{ marginLeft: 12 }} htmlFor="math-operation">Operação:</label>
          <select id="math-operation" value={op} onChange={e=> { setOp(e.target.value as Op); restartSeries() }}>
            <option value="add">Adição (+)</option>
            <option value="sub">Subtração (−)</option>
            <option value="mul">Multiplicação (×)</option>
            <option value="div">Divisão (÷)</option>
            <option value="mix">Misturar</option>
          </select>
          <label style={{ marginLeft: 12 }} htmlFor="math-series">Série:</label>
          <select id="math-series" value={series} onChange={e=> changeSeries(Number(e.target.value))}>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
          <label style={{ marginLeft: 12 }} htmlFor="math-timer">Cronômetro:</label>
          <select id="math-timer" value={String(timeLeft !== null)} onChange={e=> setTimeLeft(e.target.value==='true' ? 15 : null)}>
            <option value="false">Desligado</option>
            <option value="true">Ligado (15s)</option>
          </select>
          <span style={{ marginLeft: 'auto' }}>Pontuação: <strong>{score}</strong></span>
        </div>
        {finished ? <div className="series-summary" role="status">
          <h3>Série concluída! 🏆</h3><p>Você acertou {score} de {series} questões.</p>
          <button className="accent" onClick={restartSeries}>Jogar outra série</button>
        </div> : <>
          <div style={{ fontSize: 16, opacity: .8 }}>Questão {series - remaining + 1} de {series} · Sequência: <strong>{streak}</strong>{timeLeft!==null && <> • Tempo: <strong>{timeLeft}s</strong></>}</div>
          <div style={{ fontSize: 36, margin: '8px 0 16px' }}>{q.a} {q.symbol} {q.b} = ?</div>
          <div className="row" style={{ gap: 12 }}>
            {q.options.map((opt, i)=> (
              <button key={i} className={opt===q.correct && chosen!==null ? 'accent' : ''} disabled={chosen!==null} onClick={()=>choose(opt)} style={{ fontSize: 22, minWidth: 72 }}>
                {opt}
              </button>
            ))}
          </div>
          <p style={{ minHeight: 24 }} aria-live="polite">{msg}</p>
          <div className="row">
            <button className="secondary" onClick={next} disabled={chosen === q.correct}>Próxima</button>
          </div>
        </>}
      </div>
    </div>
  )
}
