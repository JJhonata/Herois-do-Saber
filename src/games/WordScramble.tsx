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
  { w: 'sol', hint: 'Estrela que brilha durante o dia' },
  { w: 'flor', hint: 'Planta colorida que cresce no jardim' },
  { w: 'arcoiris', hint: 'Fenômeno que ocorre após a chuva' },
  { w: 'peixe', hint: 'Animal que vive na água' },
  { w: 'chuva', hint: 'Água que cai do céu' },
  { w: 'nuvem', hint: 'Formação de vapor d\'água no céu' },
  { w: 'cachorro', hint: 'Animal que gosta de correr e brincar' },
  { w: 'estrela', hint: 'Objeto brilhante no céu durante a noite' },
  { w: 'montanha', hint: 'Formação de terra alta' },
  { w: 'pipa', hint: 'Brinquedo que voa no céu com fio' },
]

export default function WordScramble() {
  const [index, setIndex] = useState(() => Math.floor(Math.random()*WORDS.length))
  const pick = WORDS[index]
  const scrambled = useMemo(()=> pick.w.split('').sort(()=> Math.random()-0.5).join(''), [pick])
  const [input, setInput] = useState('')
  const [tries, setTries] = useState(0)
  const ok = input.toLowerCase() === pick.w
  useEffect(()=>{
    if (ok) {
      playCorrect();
      addStars('scramble', 1)
      const t = setTimeout(()=>{
        // próxima palavra
        setIndex(i=> (i+1) % WORDS.length)
        setInput('')
        setTries(0)
      }, 800)
      return () => clearTimeout(t)
    }
  }, [ok])
  return (
    <div className="container">
      <div className="game">
        <h2>Desembaralhar Palavras 🔤</h2>
        <p>Dica: {pick.hint}</p>
        <p>Palavra: <strong style={{ letterSpacing: 2, fontSize: 24 }}>{scrambled}</strong></p>
        <input value={input} onChange={e=>setInput(e.target.value)} />
        <div className="row">
          <button className="secondary" onClick={()=> { setTries(t=>t+1); if (!ok) playIncorrect() }}>Tentar</button>
          <span>Tentativas: {tries}</span>
        </div>
        <p>{ok ? 'Muito bem! 🎉' : 'Você consegue, tente novamente!'}</p>
      </div>
    </div>
  )
}


