import { useMemo, useState } from 'react'
import { addStars } from '../lib/progress'
import { playCorrect, playIncorrect } from '../lib/sfx'

const ITEMS=[
 {text:'Lia acordou cedo, colocou a mochila nas costas e foi para a escola com seu irmão.',q:'Para onde Lia foi?',a:'Para a escola',opts:['Para a escola','Para a praia','Para o mercado','Para o hospital']},
 {text:'Depois da chuva, Pedro viu um arco-íris no céu e chamou sua mãe para observar.',q:'O que Pedro viu?',a:'Um arco-íris',opts:['Uma estrela','Um arco-íris','Um avião','Uma árvore']},
 {text:'Na biblioteca, Ana escolheu um livro sobre animais e sentou-se em silêncio para ler.',q:'O que Ana escolheu?',a:'Um livro sobre animais',opts:['Um jogo','Um livro sobre animais','Uma bola','Um mapa']},
 {text:'João levou uma garrafa de água para o treino de futebol porque o dia estava muito quente.',q:'Por que João levou água?',a:'Porque o dia estava quente',opts:['Porque o dia estava quente','Porque estava chovendo','Porque esqueceu a bola','Porque iria cozinhar']},
 {text:'Marina plantou uma semente de feijão em um vaso e todos os dias colocou um pouco de água.',q:'O que Marina plantou?',a:'Uma semente de feijão',opts:['Uma flor de papel','Uma semente de feijão','Uma árvore grande','Uma cenoura']},
 {text:'Carlos terminou a tarefa de casa antes de ligar o videogame.',q:'O que Carlos fez primeiro?',a:'Terminou a tarefa',opts:['Ligou o videogame','Foi dormir','Terminou a tarefa','Saiu para correr']},
 {text:'No sábado, a família de Bia foi ao parque e levou frutas, sanduíches e suco para o piquenique.',q:'Onde aconteceu o piquenique?',a:'No parque',opts:['Na escola','No parque','No hospital','No cinema']},
 {text:'O cachorro de Lucas latiu quando ouviu alguém bater no portão.',q:'O que fez o cachorro latir?',a:'Alguém bateu no portão',opts:['A televisão ligou','Alguém bateu no portão','Lucas dormiu','Começou a chover']},
 {text:'A professora pediu que cada aluno guardasse os livros antes do recreio.',q:'O que os alunos deveriam guardar?',a:'Os livros',opts:['Os brinquedos','Os livros','Os lanches','Os sapatos']},
 {text:'Sofia apagou a luz ao sair do quarto para economizar energia.',q:'Por que Sofia apagou a luz?',a:'Para economizar energia',opts:['Para dormir','Para economizar energia','Para chamar alguém','Para abrir a janela']},
]
export default function ReadingGame(){const [i,setI]=useState(0);const [msg,setMsg]=useState('');const [score,setScore]=useState(0);const item=ITEMS[i%ITEMS.length];const opts=useMemo(()=>[...item.opts].sort(()=>Math.random()-.5),[i]);function choose(o:string){if(o===item.a){addStars('reading',2);setScore(s=>s+1);playCorrect();setMsg('Você entendeu o texto! 📖');setTimeout(()=>{setI(x=>x+1);setMsg('')},700)}else{playIncorrect();setMsg('Leia o texto novamente e procure a informação.')}}return <div className="container"><div className="game"><h2>Detetive da Leitura 🕵️📖</h2><div className="reading-text">{item.text}</div><h3 style={{textAlign:'center'}}>{item.q}</h3><div className="choice-grid">{opts.map(o=><button key={o} onClick={()=>choose(o)}>{o}</button>)}</div><p className="game-message">Acertos: {score} · {msg}</p></div></div>}
