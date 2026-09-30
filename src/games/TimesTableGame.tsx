import { useGameState } from '../lib/gameSession'
import { addStars, getRecommendedDifficulty, type Difficulty } from '../lib/progress'
import { playCorrect, playIncorrect } from '../lib/sfx'
import { shootConfetti } from '../lib/confetti'
import { recordAnswer } from '../lib/review'

function make(level: Difficulty, previous?: { a: number; b: number }) {
 const max=level==='easy'?5:level==='medium'?9:12
 let next={a:2+Math.floor(Math.random()*(max-1)),b:1+Math.floor(Math.random()*max)}
 for(let attempt=0;attempt<12&&previous&&((next.a===previous.a&&next.b===previous.b)||(next.a===previous.b&&next.b===previous.a));attempt++) next={a:2+Math.floor(Math.random()*(max-1)),b:1+Math.floor(Math.random()*max)}
 return next
}
export default function TimesTableGame(){
 const [level,setLevel]=useGameState<Difficulty>(()=>getRecommendedDifficulty('times')); const [q,setQ]=useGameState(()=>make(getRecommendedDifficulty('times'))); const [answer,setAnswer]=useGameState(''); const [streak,setStreak]=useGameState(0); const [msg,setMsg]=useGameState(''); const [resolved,setResolved]=useGameState(false)
 function changeLevel(next:Difficulty){setLevel(next);setQ(make(next,q));setAnswer('');setMsg('');setResolved(false)}
 function check(){if(resolved||!answer.trim())return;const expected=q.a*q.b;const correct=Number(answer)===expected;recordAnswer('times',`${q.a} × ${q.b}`,answer,String(expected),correct,`Multiplicar ${q.a} por ${q.b} é somar ${q.a} grupos de ${q.b} (ou ${q.b} grupos de ${q.a}).`);if(correct){setResolved(true);setStreak(s=>s+1);addStars('times',1);playCorrect();shootConfetti();setMsg('Acertou! ⭐');setTimeout(()=>{setQ(make(level,q));setAnswer('');setMsg('');setResolved(false)},650)}else{setStreak(0);playIncorrect();setMsg('Quase! Pense em somar o número várias vezes.')}}
 return <div className="container"><div className="game"><h2>Batalha da Tabuada ⚔️✖️</h2><p>Resolva a multiplicação para ganhar estrelas.</p><div className="row difficulty-picker"><label htmlFor="times-level">Nível:</label><select id="times-level" value={level} disabled={resolved} onChange={e=>changeLevel(e.target.value as Difficulty)}><option value="easy">Começando · tabuadas até 5</option><option value="medium">Praticando · tabuadas até 9</option><option value="hard">Desafio · tabuadas até 12</option></select><span>Sequência: 🔥 {streak}</span></div><div className="math-battle"><span>{q.a}</span><b>×</b><span>{q.b}</span><b>=</b><span>?</span></div><div className="row" style={{justifyContent:'center'}}><label className="visually-hidden" htmlFor="times-answer">Resposta</label><input id="times-answer" inputMode="numeric" value={answer} onChange={e=>setAnswer(e.target.value)} onKeyDown={e=>e.key==='Enter'&&check()} placeholder="Resposta" style={{maxWidth:180}} disabled={resolved}/><button className="accent" onClick={check} disabled={resolved}>Atacar!</button></div><p className="game-message" aria-live="polite">{msg}</p></div></div>
}
