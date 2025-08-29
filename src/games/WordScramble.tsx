import { useEffect, useMemo, useState } from 'react'
import { playCorrect, playIncorrect } from '../lib/sfx'
import { addStars } from '../lib/progress'

const WORDS = [
  { w: 'gato', hint: 'Animal de estimação' },
  { w: 'casa', hint: 'Onde moramos' },
  { w: 'bola', hint: 'Brinquedo redondo' },
  { w: 'livro', hint: 'Tem muitas páginas' },
  { w: 'escola', hint: 'Lugar de aprender' },
  { w: 'heroi', hint: 'Quem ajuda e aprende' },
  { w: 'amigo', hint: 'Companheiro' },
  { w: 'feliz', hint: 'Sentimento bom' },
  { w: 'saber', hint: 'Conhecimento' },
  { w: 'paz', hint: 'Sem guerra' },
  { w: 'terra', hint: 'Planeta onde vivemos' },
  { w: 'mar', hint: 'Grande corpo de água salgada' },
  { w: 'flor', hint: 'Parte colorida da planta' },
  { w: 'rio', hint: 'Curso de água' },
  { w: 'nuvem', hint: 'Fica no céu' },
  { w: 'sol', hint: 'Estrela do nosso sistema' },
  { w: 'lua', hint: 'Satélite natural da Terra' },
  { w: 'vento', hint: 'Ar em movimento' },
  { w: 'chuva', hint: 'Água que cai do céu' },
  { w: 'areia', hint: 'Encontra-se na praia' },
  { w: 'festa', hint: 'Evento para celebrar' },
  { w: 'doce', hint: 'Sabor do açúcar' },
  { w: 'branco', hint: 'Cor da neve' },
  { w: 'verde', hint: 'Cor das folhas' },
  { w: 'azul', hint: 'Cor do céu' },
  { w: 'amarelo', hint: 'Cor do sol no desenho' },
  { w: 'esporte', hint: 'Atividade física' },
  { w: 'time', hint: 'Grupo que joga junto' },
  { w: 'noticia', hint: 'Informação do dia' },
  { w: 'musica', hint: 'Arte de sons' },
]

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function WordScramble() {
  const [deck, setDeck] = useState(() => shuffle(WORDS))
  const [index, setIndex] = useState(0)
  const pick = deck[index]
  const scrambled = useMemo(()=> pick.w.split('').sort(()=> Math.random()-0.5).join(''), [pick])
  const [input, setInput] = useState('')
  const [tries, setTries] = useState(0)
  const ok = input.toLowerCase() === pick.w
  useEffect(()=>{
    if (ok) {
      playCorrect();
      addStars('scramble', 1)
      const t = setTimeout(()=>{
        // próxima palavra (embaralhamento global)
        setIndex(i=> {
          const next = i + 1
          if (next >= deck.length) {
            setDeck(shuffle(deck))
            return 0
          }
          return next
        })
        setInput('')
        setTries(0)
      }, 800)
      return () => clearTimeout(t)
    }
  }, [ok, deck])
  return (
    <div className="container">
      <div className="game">
        <h2>Desembaralhar Palavras 🔤</h2>
        <p>Dica: {pick.hint}</p>
        <p>Palavra: <strong style={{ letterSpacing: 2, fontSize: 24 }}>{scrambled}</strong></p>
        <input value={input} onChange={e=>setInput(e.target.value)} />
        <div className="row">
          <button className="secondary" onClick={()=> { setTries(t=>t+1); if (!ok) playIncorrect() }}>Tentar</button>
          <button className="secondary" onClick={()=> {
            setIndex(i=> {
              const next = i + 1
              if (next >= deck.length) {
                setDeck(shuffle(deck))
                return 0
              }
              return next
            })
            setInput('')
            setTries(0)
          }}>Próxima</button>
          <span>Tentativas: {tries}</span>
        </div>
        <p>{ok ? 'Muito bem! 🎉' : 'Você consegue, tente novamente!'}</p>
      </div>
    </div>
  )
}