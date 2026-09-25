import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getStars, type GameId } from '../lib/progress'

type Game = { id: GameId; path:string; title:string; desc:string; emoji:string; tag:string; cls:string; area:string }
const games: Game[] = [
  { id:'syllable',path:'/syllable',title:'Sílaba Mágica',desc:'Complete as palavras!',emoji:'✨',tag:'1º-3º',cls:'card-syllable',area:'Português' },
  { id:'ditado',path:'/ditado',title:'Ditado',desc:'Ouça e escreva!',emoji:'🎧',tag:'1º-3º',cls:'card-ditado',area:'Português' },
  { id:'scramble',path:'/scramble',title:'Desembaralhar',desc:'Monte a palavra!',emoji:'🔤',tag:'3º-5º',cls:'card-scramble',area:'Português' },
  { id:'sentence',path:'/sentence',title:'Formar Frases',desc:'Coloque as palavras em ordem!',emoji:'🧱',tag:'1º-4º',cls:'card-sentence',area:'Português' },
  { id:'reading',path:'/reading',title:'Detetive da Leitura',desc:'Leia e descubra as respostas!',emoji:'🕵️',tag:'2º-5º',cls:'card-reading',area:'Português' },
  { id:'wordsearch',path:'/wordsearch',title:'Caça-Palavras',desc:'Encontre palavras escondidas!',emoji:'🔎',tag:'1º-5º',cls:'card-wordsearch',area:'Português' },
  { id:'category',path:'/category',title:'Categorias',desc:'Classifique as palavras!',emoji:'📚',tag:'1º-4º',cls:'card-category',area:'Português' },
  { id:'math',path:'/math',title:'Matemática',desc:'Some e aprenda!',emoji:'🧮',tag:'1º-5º',cls:'card-math',area:'Matemática' },
  { id:'sequence',path:'/sequence',title:'Sequências',desc:'Descubra o próximo!',emoji:'🧩',tag:'1º-5º',cls:'card-sequence',area:'Matemática' },
  { id:'times',path:'/times',title:'Batalha da Tabuada',desc:'Treine multiplicação!',emoji:'⚔️',tag:'2º-5º',cls:'card-times',area:'Matemática' },
  { id:'clock',path:'/clock',title:'Relógio e Horas',desc:'Aprenda a ler horários!',emoji:'⏰',tag:'2º-5º',cls:'card-clock',area:'Matemática' },
  { id:'money',path:'/money',title:'Mercadinho',desc:'Calcule preços e troco!',emoji:'🛒',tag:'2º-5º',cls:'card-money',area:'Matemática' },
  { id:'science',path:'/science',title:'Ciências',desc:'Verdadeiro ou falso!',emoji:'🔬',tag:'2º-5º',cls:'card-science',area:'Ciências' },
  { id:'habitat',path:'/habitat',title:'Onde Eu Vivo?',desc:'Descubra os habitats!',emoji:'🐾',tag:'1º-5º',cls:'card-habitat',area:'Ciências' },
  { id:'regions',path:'/regions',title:'Regiões do Brasil',desc:'Conheça nosso país!',emoji:'🇧🇷',tag:'3º-5º',cls:'card-regions',area:'Geografia' },
  { id:'memory',path:'/memory',title:'Memória',desc:'Vire as cartas!',emoji:'🧠',tag:'1º-5º',cls:'card-memory',area:'Raciocínio' },
  { id:'quiz',path:'/quiz',title:'Quiz',desc:'Responda certo!',emoji:'❓',tag:'2º-5º',cls:'card-quiz',area:'Raciocínio' },
  { id:'security',path:'/security',title:'Segurança Digital',desc:'Aprenda a se proteger!',emoji:'🔐',tag:'3º-5º',cls:'card-security',area:'Tecnologia' },
  { id:'typing',path:'/typing',title:'Digitação',desc:'Digite as frases!',emoji:'⌨️',tag:'2º-5º',cls:'card-typing',area:'Tecnologia' },
  { id:'paint',path:'/paint',title:'Pintura',desc:'Desenhe e crie!',emoji:'🎨',tag:'1º-5º',cls:'card-paint',area:'Criatividade' },
]
const areas = [
  ['Todos','🌟'],['Português','📖'],['Matemática','🔢'],['Ciências','🔬'],['Geografia','🗺️'],['Raciocínio','🧠'],['Tecnologia','💻'],['Criatividade','🎨']
]

export default function Home(){
 const [,setTick]=useState(0); const [area,setArea]=useState('Todos')
 useEffect(()=>{const fn=()=>setTick(t=>t+1);window.addEventListener('progress:update',fn);return()=>window.removeEventListener('progress:update',fn)},[])
 const shown=area==='Todos'?games:games.filter(g=>g.area===area)
 const total=games.reduce((n,g)=>n+getStars(g.id),0)
 return <div className="container">
  <div className="hero"><div><h1>Heróis do Saber</h1><p>Aprenda brincando! Escolha uma matéria, complete desafios e ganhe estrelas ✨</p><div className="hero-stars">⭐ {total} estrelas conquistadas</div></div><div><img src="/logo.png?v=1" alt="Heróis do Saber" className="hero-logo"/></div></div>
  <div className="subject-tabs" aria-label="Escolher matéria">{areas.map(([name,icon])=><button key={name} className={area===name?'subject-tab active':'subject-tab'} onClick={()=>setArea(name)}>{icon} {name}</button>)}</div>
  <div className="section-heading"><div><span className="eyebrow">ÁREA DE APRENDIZAGEM</span><h2>{area==='Todos'?'Todos os jogos':area}</h2></div><span>{shown.length} {shown.length===1?'jogo':'jogos'}</span></div>
  <div className="grid">{shown.map(g=><div className={`card ${g.cls}`} key={g.path}><div className="card-top"><div className="game-emoji">{g.emoji}</div><div className="badge">{g.tag}</div></div><span className="subject-label">{g.area}</span><h3>{g.title}</h3><p>{g.desc}</p><div className="star-line">⭐ {getStars(g.id)} estrelas</div><Link to={g.path} style={{width:'100%'}}><button className="accent play-button">Jogar agora</button></Link></div>)}</div>
 </div>
}
