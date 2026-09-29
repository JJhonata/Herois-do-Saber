import { useGameState } from '../lib/gameSession'
import { addStars, getRecommendedDifficulty, type Difficulty } from '../lib/progress'
import { recordAnswer } from '../lib/review'
import { playCorrect, playIncorrect } from '../lib/sfx'

const WORDS = [
  { w: 'gato', hint: '🐱 Mia e gosta de leite' }, { w: 'casa', hint: '🏠 Tem portas, janelas e telhado' },
  { w: 'bola', hint: '⚽ Usamos para jogar futebol' }, { w: 'livro', hint: '📚 Contém histórias e conhecimento' },
  { w: 'escola', hint: '🎒 Lugar onde estudamos e fazemos amigos' }, { w: 'heroi', hint: '🦸 Quem salva o dia e ajuda os outros' },
  { w: 'amigo', hint: '👫 Pessoa de quem gostamos muito' }, { w: 'feliz', hint: '😊 Sentimento de alegria' },
  { w: 'saber', hint: '🧠 O que aprendemos e conhecemos' }, { w: 'paz', hint: '🕊️ Quando não há brigas ou guerras' },
  { w: 'terra', hint: '🌍 Planeta azul onde vivemos' }, { w: 'mar', hint: '🌊 Água salgada que vai até o horizonte' },
  { w: 'flor', hint: '🌸 Tem pétalas coloridas e perfume' }, { w: 'rio', hint: '🏞️ Água doce que corre entre as montanhas' },
  { w: 'nuvem', hint: '☁️ Fica no céu e às vezes chove' }, { w: 'sol', hint: '☀️ Nos aquece e ilumina o dia' },
  { w: 'lua', hint: '🌙 Aparece à noite no céu' }, { w: 'vento', hint: '💨 Faz as folhas dançarem' },
  { w: 'chuva', hint: '🌧️ Água que cai do céu' }, { w: 'areia', hint: '🏖️ Encontramos na praia' },
  { w: 'festa', hint: '🎉 Comemoramos com bolo e balões' }, { w: 'doce', hint: '🍭 Tem sabor de açúcar e mel' },
  { w: 'branco', hint: '🤍 Cor da neve e das nuvens' }, { w: 'verde', hint: '💚 Cor das plantas e da grama' },
  { w: 'azul', hint: '💙 Cor do céu e do oceano' }, { w: 'amarelo', hint: '💛 Cor do sol e de muitas flores' },
  { w: 'esporte', hint: '⚽ Atividade que fazemos para nos exercitar' }, { w: 'time', hint: '👥 Grupo que joga junto' },
  { w: 'noticia', hint: '📰 Informação importante do dia' }, { w: 'musica', hint: '🎵 Combinação de sons' },
  { w: 'arvore', hint: '🌳 Tem tronco, galhos e folhas' }, { w: 'cachorro', hint: '🐕 Melhor amigo de muitas pessoas' },
  { w: 'familia', hint: '👨‍👩‍👧‍👦 Pessoas que amamos' }, { w: 'brincar', hint: '🎮 Atividade divertida' },
  { w: 'aprender', hint: '📖 Processo de adquirir conhecimento' }, { w: 'sonhar', hint: '💭 O que fazemos quando dormimos' },
  { w: 'cantar', hint: '🎤 Usamos a voz para fazer música' }, { w: 'dançar', hint: '💃 Movimentamos o corpo ao ritmo da música' },
  { w: 'pintar', hint: '🎨 Criamos arte com cores' }, { w: 'desenhar', hint: '✏️ Fazemos figuras com lápis e papel' },
]

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5)
}

function wordsFor(level: Difficulty) {
  const words = WORDS.filter(({ w }) => level === 'easy' ? w.length <= 4 : level === 'medium' ? w.length >= 5 && w.length <= 6 : w.length >= 7)
  return shuffle(words.length ? words : WORDS)
}

function scramble(word: string) {
  let letters = word.split('')
  for (let attempt = 0; attempt < 8 && letters.join('') === word; attempt++) letters = shuffle(letters)
  return letters.join('')
}

export default function WordScramble() {
  const [level, setLevel] = useGameState<Difficulty>(() => getRecommendedDifficulty('scramble'))
  const [deck, setDeck] = useGameState(() => wordsFor(getRecommendedDifficulty('scramble')))
  const [index, setIndex] = useGameState(0)
  const [scrambled, setScrambled] = useGameState(() => scramble(deck[0].w))
  const [input, setInput] = useGameState('')
  const [tries, setTries] = useGameState(0)
  const [solved, setSolved] = useGameState(false)
  const pick = deck[index]

  function advance() {
    const next = index + 1
    if (next >= deck.length) {
      const shuffled = wordsFor(level)
      setDeck(shuffled)
      setIndex(0)
      setScrambled(scramble(shuffled[0].w))
    } else {
      setIndex(next)
      setScrambled(scramble(deck[next].w))
    }
    setInput('')
    setTries(0)
    setSolved(false)
  }

  function check() {
    if (solved) return
    setTries((count) => count + 1)
    const correct = input.trim().toLocaleLowerCase('pt-BR') === pick.w
    if (!input.trim()) return
    recordAnswer('scramble', `Desembaralhe: ${scrambled} (${pick.hint})`, input.trim(), pick.w, correct, `A palavra correta é ${pick.w}. Use a dica e reorganize as letras.`)
    if (correct) {
      setSolved(true)
      addStars('scramble', 1)
      playCorrect()
      setTimeout(advance, 800)
    } else {
      playIncorrect()
    }
  }

  function changeLevel(next: Difficulty) {
    const nextDeck = wordsFor(next)
    setLevel(next)
    setDeck(nextDeck)
    setIndex(0)
    setScrambled(scramble(nextDeck[0].w))
    setInput('')
    setTries(0)
    setSolved(false)
  }

  return <div className="container"><div className="game">
    <h2>Desembaralhar Palavras 🔤</h2>
    <p>Dica: {pick.hint}</p>
    <div className="row difficulty-picker"><label htmlFor="scramble-level">Nível:</label><select id="scramble-level" value={level} onChange={event => changeLevel(event.target.value as Difficulty)}><option value="easy">Começando · palavras curtas</option><option value="medium">Praticando · palavras médias</option><option value="hard">Desafio · palavras longas</option></select></div>
    <p>Palavra: <strong style={{ letterSpacing: 2, fontSize: 24 }}>{scrambled}</strong></p>
    <label className="visually-hidden" htmlFor="scramble-answer">Digite a palavra</label>
    <input id="scramble-answer" value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && check()} disabled={solved} autoComplete="off" />
    <div className="row">
      <button className="accent" onClick={check} disabled={solved}>Conferir</button>
      <button className="secondary" onClick={advance} disabled={solved}>Pular palavra</button>
      <span>Tentativas: {tries}</span>
    </div>
    <p className="game-message" aria-live="polite">{solved ? 'Muito bem! 🎉' : 'Você consegue, tente novamente!'}</p>
  </div></div>
}
