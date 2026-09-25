import { useState } from 'react'
import { addStars } from '../lib/progress'
import { playCorrect, playIncorrect } from '../lib/sfx'

const WORDS=['ESCOLA','LIVRO','AMIGO','CASA','SOL','GATO','BOLA','FLOR']
export default function WordSearchGame(){const [target,setTarget]=useState(WORDS[0]);const [answer,setAnswer]=useState('');const [found,setFound]=useState<string[]>([]);const [msg,setMsg]=useState('');
 function check(){const a=answer.trim().toUpperCase();if(WORDS.includes(a)&&!found.includes(a)){setFound([...found,a]);addStars('wordsearch',1);playCorrect();setMsg('Palavra encontrada! 🔎');setAnswer('');const next=WORDS.find(w=>w!==a&&!found.includes(w));if(next)setTarget(next)}else{playIncorrect();setMsg('Essa palavra não está na lista ou já foi encontrada.')}}
 return <div className="container"><div className="game"><h2>Caça-Palavras 🔎🔤</h2><p>Encontre e digite as palavras escondidas na grade. A próxima pista é <strong>{target}</strong>.</p><div className="word-search-grid" aria-label="grade de letras">{['E','S','C','O','L','A','X','L','I','V','R','O','Q','A','M','I','G','O','C','A','S','A','Z','S','O','L','P','G','A','T','O','B','O','L','A','F','L','O','R','X','Y','Z'].map((c,i)=><span key={i}>{c}</span>)}</div><div className="row" style={{justifyContent:'center'}}><input value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="Digite uma palavra"/><button className="accent" onClick={check}>Encontrei!</button></div><p className="game-message">Encontradas: {found.join(', ') || 'nenhuma'}<br/>{msg}</p></div></div>}
