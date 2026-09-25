import { useState } from 'react'
import { addStars } from '../lib/progress'
import { playCorrect, playIncorrect } from '../lib/sfx'
import { shootConfetti } from '../lib/confetti'

function make(){const a=2+Math.floor(Math.random()*11),b=1+Math.floor(Math.random()*12);return {a,b}}
export default function TimesTableGame(){
 const [q,setQ]=useState(make); const [answer,setAnswer]=useState(''); const [streak,setStreak]=useState(0); const [msg,setMsg]=useState('')
 function check(){if(Number(answer)===q.a*q.b){setStreak(s=>s+1);addStars('times',1);playCorrect();shootConfetti();setMsg('Acertou! ⭐');setTimeout(()=>{setQ(make());setAnswer('');setMsg('')},650)}else{setStreak(0);playIncorrect();setMsg('Quase! Pense em somar o número várias vezes.')}}
 return <div className="container"><div className="game"><h2>Batalha da Tabuada ⚔️✖️</h2><p>Resolva a multiplicação para ganhar estrelas.</p><div className="math-battle"><span>{q.a}</span><b>×</b><span>{q.b}</span><b>=</b><span>?</span></div><div className="row" style={{justifyContent:'center'}}><input inputMode="numeric" value={answer} onChange={e=>setAnswer(e.target.value)} onKeyDown={e=>e.key==='Enter'&&check()} placeholder="Resposta" style={{maxWidth:180}}/><button className="accent" onClick={check}>Atacar!</button></div><p className="game-message">Sequência: 🔥 {streak} &nbsp; {msg}</p></div></div>
}
