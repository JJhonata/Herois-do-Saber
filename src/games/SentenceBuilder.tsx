import { useMemo } from 'react'
import { useGameState } from '../lib/gameSession'
import { shuffledCycleIndex, shuffle } from '../lib/questionFlow'
import { addStars, getRecommendedDifficulty, type Difficulty } from '../lib/progress'
import { playCorrect, playIncorrect } from '../lib/sfx'
import { recordAnswer } from '../lib/review'
import { shootConfetti } from '../lib/confetti'

const ITEMS = [
  'O gato dorme no sofá',
  'A menina lê um livro',
  'Nós brincamos no parque',
  'O sol ilumina a manhã',
  'A professora ensina a turma',
  'O cachorro corre no quintal',
  'As crianças estudam com atenção',
  'Meu amigo trouxe uma bola azul',
  'A chuva molhou as plantas do jardim',
  'Nós cuidamos bem do meio ambiente',
  'O passarinho canta todas as manhãs',
  'Minha família gosta de ler histórias',
  'A turma visitou a biblioteca da escola',
  'O peixe nada depressa no aquário',
  'Hoje aprendemos uma palavra nova',
  'A lua aparece brilhante no céu',
]

export default function SentenceBuilder(){
  const [level,setLevel]=useGameState<Difficulty>(()=>getRecommendedDifficulty('sentence')); const [round,setRound]=useGameState(0); const [picked,setPicked]=useGameState<string[]>([]); const [msg,setMsg]=useGameState(''); const [solved,setSolved]=useGameState(false)
  const deck=ITEMS.filter(sentence=>level==='easy'?sentence.split(' ').length<=5:level==='medium'?sentence.split(' ').length===6:sentence.split(' ').length>=7)
  const sentence=deck[shuffledCycleIndex(deck.length,round,`sentence:${level}`)]
  const words=useMemo(()=>shuffle(sentence.split(' ')),[round,level])
  const available=words.filter((_,i)=>!picked.includes(`${i}`))
  function choose(word:string){
    const index=words.findIndex((w,i)=>w===word && !picked.includes(`${i}`)); if(index<0)return
    setPicked([...picked,`${index}`]); setMsg('')
  }
  const built=picked.map(i=>words[Number(i)]).join(' ')
  function check(){
    if(solved)return
    const correct=built===sentence
    recordAnswer('sentence', 'Organize as palavras para formar uma frase.', built, sentence, correct, 'A ordem das palavras ajuda a frase a comunicar uma ideia clara.')
    if(correct){ setSolved(true); addStars('sentence',2); playCorrect(); shootConfetti(); setMsg('Perfeito! Você montou a frase! 🎉'); setTimeout(()=>{setRound(r=>r+1);setPicked([]);setMsg('');setSolved(false)},900) }
    else { playIncorrect(); setMsg('Ainda não. Observe a ordem das palavras e tente novamente.') }
  }
  return <div className="container"><div className="game"><h2>Construtor de Frases 🧱📝</h2><p>Toque nas palavras na ordem correta para formar uma frase.</p>
    <div className="row difficulty-picker"><label htmlFor="sentence-level">Nível:</label><select id="sentence-level" value={level} onChange={event=>{setLevel(event.target.value as Difficulty);setRound(0);setPicked([]);setSolved(false);setMsg('')}}><option value="easy">Começando · frases curtas</option><option value="medium">Praticando · frases médias</option><option value="hard">Desafio · frases longas</option></select></div>
    <div className="sentence-target">{built || 'Monte a frase aqui...'}</div>
    <div className="word-bank">{available.map((w)=> <button key={`${w}-${words.indexOf(w)}`} className="secondary" onClick={()=>choose(w)} disabled={solved}>{w}</button>)}</div>
    <div className="row" style={{justifyContent:'center',marginTop:16}}><button onClick={()=>{setPicked([]);setSolved(false);setMsg('')}} disabled={solved}>Recomeçar</button><button className="accent" onClick={check} disabled={picked.length!==words.length||solved}>Conferir</button></div>
    <p className="game-message" aria-live="polite">{msg}</p></div></div>
}
