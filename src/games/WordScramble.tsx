import { useEffect, useMemo, useState } from 'react'
import { playCorrect, playIncorrect } from '../lib/sfx'
import { addStars } from '../lib/progress'

const WORDS = [
  { w: 'gato', hint: '🐱 Mia e gosta de leite' },
  { w: 'casa', hint: '🏠 Tem portas, janelas e telhado' },
  { w: 'bola', hint: '⚽ Usamos para jogar futebol' },
  { w: 'livro', hint: '📚 Contém histórias e conhecimento' },
  { w: 'escola', hint: '🎒 Lugar onde estudamos e fazemos amigos' },
  { w: 'heroi', hint: '🦸 Quem salva o dia e ajuda os outros' },
  { w: 'amigo', hint: '👫 Pessoa que gostamos muito' },
  { w: 'feliz', hint: '😊 Sentimento quando estamos alegres' },
  { w: 'saber', hint: '🧠 O que aprendemos e conhecemos' },
  { w: 'paz', hint: '🕊️ Quando não há brigas ou guerras' },
  { w: 'terra', hint: '🌍 Planeta azul onde vivemos' },
  { w: 'mar', hint: '🌊 Água salgada que vai até o horizonte' },
  { w: 'flor', hint: '🌸 Tem pétalas coloridas e perfume' },
  { w: 'rio', hint: '🏞️ Água doce que corre entre as montanhas' },
  { w: 'nuvem', hint: '☁️ Fica no céu e às vezes chove' },
  { w: 'sol', hint: '☀️ Nos aquece e ilumina o dia' },
  { w: 'lua', hint: '🌙 Aparece à noite no céu' },
  { w: 'vento', hint: '💨 Faz as folhas dançarem' },
  { w: 'chuva', hint: '🌧️ Água que cai do céu' },
  { w: 'areia', hint: '🏖️ Encontramos na praia, é dourada' },
  { w: 'festa', hint: '🎉 Comemoramos com bolo e balões' },
  { w: 'doce', hint: '🍭 Tem sabor de açúcar e mel' },
  { w: 'branco', hint: '🤍 Cor da neve e das nuvens' },
  { w: 'verde', hint: '💚 Cor das plantas e da grama' },
  { w: 'azul', hint: '💙 Cor do céu e do oceano' },
  { w: 'amarelo', hint: '💛 Cor do sol e das flores' },
  { w: 'esporte', hint: '⚽ Atividade que fazemos para nos exercitar' },
  { w: 'time', hint: '👥 Grupo que joga junto no mesmo objetivo' },
  { w: 'noticia', hint: '📰 Informação importante do dia' },
  { w: 'musica', hint: '🎵 Combinação de sons que nos emociona' },
  { w: 'arvore', hint: '🌳 Tem tronco, galhos e muitas folhas' },
  { w: 'cachorro', hint: '🐕 Melhor amigo do homem' },
  { w: 'familia', hint: '👨‍👩‍👧‍👦 Pessoas que amamos e vivem conosco' },
  { w: 'brincar', hint: '🎮 Atividade divertida que fazemos' },
  { w: 'aprender', hint: '📖 Processo de adquirir conhecimento' },
  { w: 'sonhar', hint: '💭 O que fazemos quando dormimos' },
  { w: 'cantar', hint: '🎤 Usamos a voz para fazer música' },
  { w: 'dançar', hint: '💃 Movimentamos o corpo ao ritmo da música' },
  { w: 'pintar', hint: '🎨 Criamos arte com cores' },
  { w: 'desenhar', hint: '✏️ Fazemos figuras com lápis e papel' },
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