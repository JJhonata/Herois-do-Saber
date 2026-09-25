import { useMemo, useState } from 'react'
import { addStars } from '../lib/progress'
import { playCorrect, playIncorrect } from '../lib/sfx'
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
const shuffle = <T,>(a:T[]) => [...a].sort(()=>Math.random()-.5)

export default function SentenceBuilder(){
  const [round,setRound]=useState(0); const [picked,setPicked]=useState<string[]>([]); const [msg,setMsg]=useState('')
  const sentence=ITEMS[round%ITEMS.length]
  const words=useMemo(()=>shuffle(sentence.split(' ')),[round])
  const available=words.filter((_,i)=>!picked.includes(`${i}`))
  function choose(word:string){
    const index=words.findIndex((w,i)=>w===word && !picked.includes(`${i}`)); if(index<0)return
    setPicked([...picked,`${index}`]); setMsg('')
  }
  const built=picked.map(i=>words[Number(i)]).join(' ')
  function check(){
    if(built===sentence){ addStars('sentence',2); playCorrect(); shootConfetti(); setMsg('Perfeito! Você montou a frase! 🎉'); setTimeout(()=>{setRound(r=>r+1);setPicked([]);setMsg('')},900) }
    else { playIncorrect(); setMsg('Ainda não. Observe a ordem das palavras e tente novamente.') }
  }
  return <div className="container"><div className="game"><h2>Construtor de Frases 🧱📝</h2><p>Toque nas palavras na ordem correta para formar uma frase.</p>
    <div className="sentence-target">{built || 'Monte a frase aqui...'}</div>
    <div className="word-bank">{available.map((w)=> <button key={`${w}-${words.indexOf(w)}`} className="secondary" onClick={()=>choose(w)}>{w}</button>)}</div>
    <div className="row" style={{justifyContent:'center',marginTop:16}}><button onClick={()=>setPicked([])}>Recomeçar</button><button className="accent" onClick={check} disabled={picked.length!==words.length}>Conferir</button></div>
    <p className="game-message">{msg}</p></div></div>
}
