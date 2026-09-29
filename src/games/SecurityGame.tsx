import { useGameState } from '../lib/gameSession'
import { playCorrect, playIncorrect } from '../lib/sfx'
import { addStars, getRecommendedDifficulty, type Difficulty } from '../lib/progress'

type Q = { q: string, options: string[], correct: number }

const SAFETY_QUESTIONS: Q[] = [
  { q: 'Um estranho no jogo pede seu número. O que você faz?', options: ['Envio por mensagem privada', 'Peço para meu responsável enviar', 'Não envio e aviso um adulto', 'Envio apenas o primeiro dígito'], correct: 2 },
  { q: 'Recebeu um link de prêmio milagroso. O que fazer?', options: ['Clicar rápido', 'Compartilhar com amigos', 'Ignorar e perguntar a um adulto', 'Inserir meus dados para ganhar'], correct: 2 },
  { q: 'Alguém está sendo maldoso no chat. Qual atitude?', options: ['Responder xingando', 'Silenciar, bloquear e avisar um adulto', 'Sair do jogo para sempre', 'Contar minha senha a ele'], correct: 1 },
  { q: 'Senha segura é...', options: ['MeuNome123', 'DataDeNascimento', 'Mistura letras, números e símbolos', '123456'], correct: 2 },
  { q: 'Uma pessoa diz ser seu colega e pede endereço. Você...', options: ['Envia o endereço', 'Pede o endereço dela', 'Não envia e avisa um adulto', 'Marca um encontro'], correct: 2 },
  { q: 'Uma foto pede sua localização para postar. O que fazer?', options: ['Ativar localização', 'Perguntar a um adulto antes', 'Postar sem pensar', 'Marcar a escola'], correct: 1 },
  { q: 'Um app desconhecido pede permissões demais. Você...', options: ['Instala assim mesmo', 'Pede ajuda a um adulto e pesquisa', 'Desliga o celular', 'Dá todas as permissões'], correct: 1 },
  { q: 'Um amigo online pede sua senha para te “ajudar”.', options: ['Envio a senha', 'Troco de senha', 'Nunca compartilho senha', 'Escrevo em papel e envio'], correct: 2 },
  { q: 'Verifiquei um perfil falso se passando por famoso. Eu...', options: ['Envio dados para ganhar brinde', 'Sigo e compartilho', 'Ignoro e aviso um adulto', 'Compro um produto no link'], correct: 2 },
  { q: 'Publicar fotos com uniforme da escola é...', options: ['Seguro sempre', 'Perigoso, pode expor onde estudo', 'Obrigatório', 'Permitido com senha'], correct: 1 },
  { q: 'Em Wi‑Fi público devo...', options: ['Digitar senhas bancárias', 'Evitar acessar contas importantes', 'Compartilhar o Wi‑Fi', 'Desligar o celular'], correct: 1 },
  { q: 'Se receber um e‑mail estranho com anexo...', options: ['Abro o anexo', 'Apago ou pergunto a um adulto', 'Respondo com meus dados', 'Repasso aos amigos'], correct: 1 },
  { q: 'Alguém pede foto pessoal em troca de moedas do jogo. Você...', options: ['Envia a foto', 'Ignora e reporta', 'Negocia outra coisa', 'Pede segredo'], correct: 1 },
  { q: 'Para atualizar um app, o melhor é...', options: ['Baixar de site aleatório', 'Pedir a um adulto e usar loja oficial', 'Instalar qualquer APK', 'Nunca atualizar'], correct: 1 },
  { q: 'Mensagem diz “urgente! confirme dados agora”. Você...', options: ['Clica no link', 'Verifica com um adulto antes', 'Envia documento', 'Responde com endereço'], correct: 1 },
  { q: 'Um desconhecido quer te encontrar pessoalmente. O correto é...', options: ['Aceitar se for de dia', 'Levar um amigo apenas', 'Não marcar e avisar um adulto', 'Ir escondido'], correct: 2 },
  { q: 'Um site pede cartão para um “teste grátis”. Você...', options: ['Digita o cartão', 'Tira foto do cartão', 'Pede ajuda e verifica a segurança', 'Envia por áudio'], correct: 2 },
  { q: 'Ao criar senha, é importante...', options: ['Usar a mesma em tudo', 'Compartilhar com amigos', 'Ativar autenticação em dois fatores', 'Anotar no perfil'], correct: 2 },
  { q: 'Se alguém te ameaça no jogo...', options: ['Guarda segredo', 'Responde com ameaça', 'Bloqueia, salva evidências e avisa adulto', 'Dá itens do jogo'], correct: 2 },
  { q: 'Recebeu um QR code de origem desconhecida. Você...', options: ['Escaneia na hora', 'Pede um adulto para verificar', 'Clica e baixa app', 'Compartilha com turma'], correct: 1 },
]
const PASS_THRESHOLD = Math.ceil(SAFETY_QUESTIONS.length * 0.7)

export default function SecurityGame() {
  const [level, setLevel] = useGameState<Difficulty>(() => getRecommendedDifficulty('security'))
  const [i, setI] = useGameState(0)
  const [chosen, setChosen] = useGameState<number | null>(null)
  const [score, setScore] = useGameState(0)
  const [finished, setFinished] = useGameState(false)
  const [awardedMedal, setAwardedMedal] = useGameState(false)
  const q = SAFETY_QUESTIONS[i]
  const optionCount = level === 'easy' ? 2 : level === 'medium' ? 3 : 4
  const visibleOptions = q.options.map((text, index) => ({ text, index }))
    .filter(({ index }) => index === q.correct || index < optionCount)

  function pick(idx: number) {
    if (chosen !== null) return
    setChosen(idx)
    if (idx === q.correct) {
      setScore(s=>s+1)
      playCorrect()
      addStars('security', 1)
      setTimeout(()=> {
        if (i === SAFETY_QUESTIONS.length - 1) {
          setFinished(true)
        } else {
          next()
        }
      }, 800)
    } else {
      playIncorrect()
    }
  }

  function next() {
    setChosen(null)
    setI((i+1) % SAFETY_QUESTIONS.length)
  }

  const TIPS = [
    'Nunca compartilhe dados pessoais (endereço, telefone, senha).',
    'Se algo parecer estranho, chame um adulto de confiança.',
    'Use senhas fortes e únicas; não repita senhas.',
    'Não clique em links suspeitos ou “prêmios milagrosos”.',
    'Se alguém for maldoso, silencie/bloqueie e reporte.',
  ]

  return (
    <div className="container">
      <div className="game">
        <h2>Segurança Online 🔐</h2>
        <div className="row difficulty-picker"><label htmlFor="security-level">Nível:</label><select id="security-level" value={level} onChange={event => { setLevel(event.target.value as Difficulty); setChosen(null) }}><option value="easy">Começando · 2 opções</option><option value="medium">Praticando · 3 opções</option><option value="hard">Desafio · 4 opções</option></select></div>
        {!finished ? (
          <>
            <p>Pergunta {i+1} de {SAFETY_QUESTIONS.length} — Pontos: <strong>{score}</strong></p>
            <p style={{ fontSize: 18 }}>{q.q}</p>
            <div className="row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
              {visibleOptions.map(({ text: opt, index: idx }) => (
                <button key={idx} onClick={()=>pick(idx)} className={chosen===idx ? (idx===q.correct ? 'accent' : 'danger') : ''}>
                  {String.fromCharCode(65+idx)}. {opt}
                </button>
              ))}
            </div>
            {chosen !== null && chosen !== q.correct && (
              <div className="row" style={{ marginTop: 10 }}>
                <button className="secondary" onClick={next}>Próxima</button>
              </div>
            )}
          </>
        ) : (
          <>
            <p><strong>Parabéns!</strong> Você concluiu o quiz com {score} ponto(s).</p>
            {score >= PASS_THRESHOLD ? (
              <>
                <p>Você passou! 🏅 (mínimo para passar: {PASS_THRESHOLD})</p>
                {!awardedMedal && (
                  <button className="accent" onClick={()=> { addStars('security', 3); setAwardedMedal(true); }}>Receber medalha (+3 estrelas)</button>
                )}
              </>
            ) : (
              <p>Quase lá! Você precisa de pelo menos {PASS_THRESHOLD} acertos. Tente novamente!</p>
            )}
            <p>Dicas importantes:</p>
            <ul>
              {TIPS.map((t, idx)=> <li key={idx}>{t}</li>)}
            </ul>
            <div className="row">
              <button className="accent" onClick={()=> { setI(0); setScore(0); setFinished(false); setChosen(null); setAwardedMedal(false) }}>Recomeçar</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
