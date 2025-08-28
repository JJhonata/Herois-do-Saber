import { useEffect, useMemo, useState } from 'react'
import { playBonus, playCorrect, playIncorrect } from '../lib/sfx'
import { shootConfetti } from '../lib/confetti'
import { addStars } from '../lib/progress'

type Level = 1 | 2 | 3
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
  const ranges: Record<Level, number> = { 1: 10, 2: 20, 3: 50 }
  const smallRanges: Record<Level, number> = { 1: 5, 2: 10, 3: 12 }
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
  const [level, setLevel] = useState<Level>(1)
  const [op, setOp] = useState<Op>('add')
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(0)
  const q = useMemo(()=> buildQuestion(level, op), [level, round, op])
  const [chosen, setChosen] = useState<number | null>(null)
  const [msg, setMsg] = useState('')
  const [series, setSeries] = useState(10)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [streak, setStreak] = useState(0)

  // cronômetro opcional
  useEffect(()=>{
    if (timeLeft === null) return
    if (timeLeft <= 0) { setMsg('Tempo esgotado!'); setChosen(q.correct); setTimeout(()=> next(), 700); return }
    const id = setTimeout(()=> setTimeLeft(s => (s as number) - 1), 1000)
    return ()=> clearTimeout(id)
  }, [timeLeft])

  function choose(opt: number) {
    setChosen(opt)
    const ok = opt === q.correct
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
    setChosen(null)
    setMsg('')
    setRound(r => r + 1)
    if (timeLeft !== null) setTimeLeft(15) // reinicia o tempo por questão
    setSeries(s => Math.max(0, s - 1))
  }

  return (
    <div className="container">
      <div className="game">
        <h2>Matemática ➗✖️➕➖</h2>
        <div className="row">
          <label>Nível:</label>
          <select value={level} onChange={e=> setLevel(Number(e.target.value) as Level)}>
            <option value={1}>Fácil (0-10)</option>
            <option value={2}>Médio (0-20)</option>
            <option value={3}>Difícil (0-50)</option>
          </select>
          <label style={{ marginLeft: 12 }}>Operação:</label>
          <select value={op} onChange={e=> setOp(e.target.value as Op)}>
            <option value="add">Adição (+)</option>
            <option value="sub">Subtração (−)</option>
            <option value="mul">Multiplicação (×)</option>
            <option value="div">Divisão (÷)</option>
            <option value="mix">Misturar</option>
          </select>
          <label style={{ marginLeft: 12 }}>Série:</label>
          <select value={series} onChange={e=> setSeries(Number(e.target.value))}>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
          <label style={{ marginLeft: 12 }}>Cronômetro:</label>
          <select value={String(timeLeft !== null)} onChange={e=> setTimeLeft(e.target.value==='true' ? 15 : null)}>
            <option value="false">Desligado</option>
            <option value="true">Ligado (15s)</option>
          </select>
          <span style={{ marginLeft: 'auto' }}>Pontuação: <strong>{score}</strong></span>
        </div>
        <div style={{ fontSize: 16, opacity: .8 }}>Sequência: <strong>{streak}</strong>{timeLeft!==null && <> • Tempo: <strong>{timeLeft}s</strong></>}</div>
        <div style={{ fontSize: 36, margin: '8px 0 16px' }}>{q.a} {q.symbol} {q.b} = ?</div>
        <div className="row" style={{ gap: 12 }}>
          {q.options.map((opt, i)=> (
            <button key={i} className={opt===q.correct && chosen!==null ? 'accent' : ''} disabled={chosen!==null} onClick={()=>choose(opt)} style={{ fontSize: 22, minWidth: 72 }}>
              {opt}
            </button>
          ))}
        </div>
        <p style={{ minHeight: 24 }}>{msg}</p>
        <div className="row">
          <button className="secondary" onClick={next}>Próxima</button>
        </div>
      </div>
    </div>
  )
}


