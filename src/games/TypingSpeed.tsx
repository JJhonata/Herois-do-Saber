import { useEffect, useMemo, useRef } from 'react'
import { useGameState } from '../lib/gameSession'
import { playCorrect } from '../lib/sfx'
import { addStars } from '../lib/progress'

type Level = 'facil' | 'medio' | 'dificil'
const BANK: Record<Level, string[]> = {
  facil: [
    'Eu gosto de estudar.',
    'Aprender é ser herói.',
    'A escola é legal.',
    'Ler é divertido.',
    'Eu amo matemática.',
    'Gosto de escrever histórias.',
    'A professora é muito gentil.',
    'Eu ajudo meus amigos.',
    'Brincar no recreio é bom.',
    'Hoje fiz a lição de casa.',
    'Eu cuido do meu material.',
    'Beber água faz bem.',
    'Dormir cedo ajuda a aprender.',
    'Eu respeito meus colegas.',
    'O caderno está organizado.',
    'Eu gosto de ciência.',
    'A leitura traz conhecimento.',
    'Contar até dez é fácil.',
    'Eu escrevo com atenção.',
    'O quadro é verde na sala.',
  ],
  medio: [
    'Programar é divertido e desafiador.',
    'Ler livros aumenta muito o saber.',
    'Os heróis sempre ajudam os amigos.',
    'Estudar todos os dias melhora muito.',
    'A prática constante melhora a habilidade de digitar.',
    'Organização diária facilita a vida na escola.',
    'Projetos em grupo ensinam colaboração e respeito.',
    'A curiosidade abre portas para novas descobertas.',
    'Anotar ideias rápidas evita que elas se percam.',
    'Resolver problemas exige calma e paciência.',
    'A revisão do conteúdo fixa melhor a memória.',
    'Uma boa postura evita dores ao estudar.',
    'Planejar o estudo ajuda a cumprir metas.',
    'A tecnologia pode ajudar muito na aprendizagem.',
    'Reler o texto melhora a compreensão global.',
    'Treinar digitação aumenta a velocidade com precisão.',
    'Aprender com erros é parte do processo.',
    'Dividir tarefas grandes em partes menores ajuda.',
    'Escrever um pouco por dia melhora a fluência.',
    'Leitura em voz alta melhora a dicção e confiança.',
  ],
  dificil: [
    'A curiosidade é o pavio na vela do aprendizado.',
    'A prática constante transforma esforço em habilidade.',
    'Disciplina é liberdade, estudo é poder.',
    'Persistência silenciosa constrói resultados extraordinários ao longo do tempo.',
    'Foco absoluto reduz o ruído e eleva a qualidade do estudo.',
    'Metas claras orientam a ação e medem o progresso real.',
    'Leitura crítica separa opinião de fato com precisão.',
    'Síntese eficaz transforma informação em conhecimento aplicável.',
    'Erros analisados viram mapas para a próxima tentativa.',
    'Atenção plena reduz distrações e amplia a retenção.',
    'Vocabulário rico expande o alcance do pensamento.',
    'Tempo bem gerido multiplica as oportunidades de aprender.',
    'Repetição espaçada fortalece a memória de longo prazo.',
    'Analogias iluminam conceitos complexos com clareza.',
    'Autoria consciente dá voz única às suas ideias.',
    'Prototipar cedo revela falhas ocultas no raciocínio.',
    'Argumentos sólidos exigem evidências e lógica consistentes.',
    'Domínio técnico floresce com prática deliberada diária.',
    'Reflexão metódica transforma experiência em sabedoria.',
  ],
}

export default function TypingSpeed() {
  const [level, setLevel] = useGameState<Level>('facil')
  const phrases = useMemo(()=> BANK[level], [level])
  const [practice, setPractice] = useGameState(false)
  const [custom, setCustom] = useGameState('Digite seu próprio texto aqui...')
  const [text, setText] = useGameState('')
  const [started, setStarted] = useGameState(false)
  const [seconds, setSeconds] = useGameState(0)
  const timerRef = useRef<number | null>(null)
  const initializedPhrases = useRef(false)
  const [target, setTarget] = useGameState(phrases[0])
  const [awarded, setAwarded] = useGameState(false)

  useEffect(()=>{
    if (started) {
      timerRef.current = window.setInterval(()=> setSeconds(s=>s+1), 1000)
    }
    return ()=> { if (timerRef.current) window.clearInterval(timerRef.current) }
  }, [started])

  useEffect(()=>{ if (!initializedPhrases.current) { initializedPhrases.current = true; return }; setTarget(phrases[0]); setText(''); setSeconds(0); setStarted(false); setAwarded(false) }, [phrases])

  const complete = text === target

  useEffect(() => {
    if (practice || !complete) return
    const timeout = window.setTimeout(() => {
      const index = phrases.indexOf(target)
      setTarget(phrases[index < 0 || index + 1 >= phrases.length ? 0 : index + 1])
      setText('')
      setSeconds(0)
      setStarted(false)
      setAwarded(false)
    }, 800)
    return () => window.clearTimeout(timeout)
  }, [complete, practice, phrases, target])

  useEffect(() => {
    if (complete) setStarted(false)
  }, [complete])

  useEffect(()=>{
    if (complete && !practice && !awarded) {
      setAwarded(true)
      playCorrect()
      addStars('typing', 1)
    }
  }, [complete, awarded])

  function restart() {
    setText('')
    setSeconds(0)
    setStarted(false)
    setAwarded(false)
    if (practice) {
      setTarget(custom)
    } else {
      setTarget(phrases[Math.floor(Math.random()*phrases.length)])
    }
  }

  return (
    <div className="container">
      <div className="game">
        <h2>Digitação ⌨️</h2>
        <div className="row" style={{ alignItems: 'center' }}>
          <label>Nível:</label>
          <select value={level} onChange={e=> setLevel(e.target.value as Level)}>
            <option value="facil">Fácil</option>
            <option value="medio">Médio</option>
            <option value="dificil">Difícil</option>
          </select>
          <label style={{ marginLeft: 12 }}>Prática livre:</label>
          <select value={String(practice)} onChange={e=> { const v = e.target.value==='true'; setPractice(v); if (v) setTarget(custom); else setTarget(phrases[0]); setText(''); setSeconds(0); setStarted(false); setAwarded(false) }}>
            <option value="false">Não</option>
            <option value="true">Sim</option>
          </select>
          <span style={{ marginLeft: 'auto' }}>Tempo: <strong>{seconds}s</strong></span>
        </div>
        <div style={{ height: 8 }} />
        {practice ? (
          <div className="row" style={{ alignItems: 'center', gap: 8 }}>
            <label style={{ whiteSpace: 'nowrap' }}>Texto da prática:</label>
            <input style={{ flex: 1 }} value={custom} onChange={e=> { setCustom(e.target.value); if (practice) setTarget(e.target.value) }} />
          </div>
        ) : null}
        <p>Digite a frase:</p>
        <p style={{ fontWeight: 600 }}><em>{target}</em></p>
        <div className="row">
          <button onClick={()=>{ setStarted(true); setText(''); setSeconds(0); setAwarded(false) }} className="accent">Iniciar</button>
          <button onClick={restart} className="secondary">Reiniciar</button>
          {!practice && <button className="secondary" onClick={()=> { setTarget(phrases[Math.floor(Math.random()*phrases.length)]); setText(''); setSeconds(0); setStarted(false); setAwarded(false) }}>Próxima frase</button>}
        </div>
        <textarea rows={4} value={text} onChange={e=>setText(e.target.value)} style={{ width: '100%', marginTop: 8 }} />
        <p>{complete ? 'Perfeito! 🎉' : 'Continue, você está indo bem!'}</p>
      </div>
    </div>
  )
}
