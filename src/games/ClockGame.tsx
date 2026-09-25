import { useMemo, useState } from 'react'
import { addStars } from '../lib/progress'
import { playCorrect, playIncorrect } from '../lib/sfx'

const times=[['06:00','seis horas'],['07:00','sete horas'],['08:30','oito e meia'],['09:15','nove e quinze'],['10:00','dez horas'],['11:45','onze e quarenta e cinco'],['12:30','doze e meia'],['13:00','uma da tarde'],['14:15','duas e quinze da tarde'],['15:00','três da tarde'],['16:30','quatro e meia da tarde'],['17:45','cinco e quarenta e cinco da tarde'],['18:30','seis e meia da tarde'],['19:00','sete da noite'],['20:15','oito e quinze da noite'],['21:00','nove da noite']]
export default function ClockGame(){const [i,setI]=useState(0);const [msg,setMsg]=useState('');const [score,setScore]=useState(0);const item=times[i%times.length];const opts=useMemo(()=>[item[1],...times.filter(x=>x[1]!==item[1]).sort(()=>Math.random()-.5).slice(0,3).map(x=>x[1])].sort(()=>Math.random()-.5),[i]);
 function pick(o:string){if(o===item[1]){addStars('clock',1);playCorrect();setScore(s=>s+1);setMsg('Isso mesmo! ⏰');setTimeout(()=>{setI(x=>x+1);setMsg('')},650)}else{playIncorrect();setMsg('Observe os números do relógio e tente de novo.')}}
 return <div className="container"><div className="game"><h2>Que Horas São? ⏰</h2><p>Leia o relógio digital e escolha como falamos esse horário.</p><div className="digital-clock">{item[0]}</div><div className="choice-grid">{opts.map(o=><button key={o} onClick={()=>pick(o)}>{o}</button>)}</div><p className="game-message">Acertos: {score} · {msg}</p></div></div>}
