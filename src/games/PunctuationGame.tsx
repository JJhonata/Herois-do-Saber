import { useGameState } from '../lib/gameSession'
import { addStars, getRecommendedDifficulty, type Difficulty } from '../lib/progress'
import { playCorrect, playIncorrect } from '../lib/sfx'
import { recordAnswer } from '../lib/review'

type Task = { before: string; after: string; mark: string; hint: string; explanation: string }
const tasks: Record<Difficulty, Task[]> = {
  easy: [
    { before: 'Olá', after: ' como vai?', mark: ',', hint: 'A saudação continua na mesma frase.', explanation: 'A vírgula separa a saudação “Olá” do restante da frase.' },
    { before: 'O céu está azul', after: '', mark: '.', hint: 'A ideia terminou.', explanation: 'O ponto final indica que a frase terminou.' },
    { before: 'A gata dorme no sofá', after: '', mark: '.', hint: 'A frase conta algo e terminou.', explanation: 'Usamos ponto final para encerrar essa afirmação.' },
    { before: 'Bom dia', after: ' Pedro.', mark: ',', hint: 'A frase chama uma pessoa pelo nome.', explanation: 'A vírgula separa a saudação do nome da pessoa.' },
    { before: 'A aula começou cedo', after: '', mark: '.', hint: 'A frase conta algo e terminou.', explanation: 'O ponto final encerra essa afirmação.' },
    { before: 'Vamos jogar bola', after: '', mark: '.', hint: 'A ideia terminou.', explanation: 'O ponto final marca o fim da frase.' },
    { before: 'A mochila azul é minha', after: '', mark: '.', hint: 'A frase informa algo e terminou.', explanation: 'O ponto final encerra uma afirmação.' },
    { before: 'Hoje é segunda-feira', after: '', mark: '.', hint: 'A frase informa algo e terminou.', explanation: 'O ponto final encerra uma afirmação.' },
    { before: 'Pai', after: ' posso ajudar?', mark: ',', hint: 'A frase chama uma pessoa pelo nome.', explanation: 'A vírgula separa o nome da pessoa que está sendo chamada.' },
    { before: 'Ravi', after: ' feche a janela.', mark: ',', hint: 'A frase chama uma pessoa pelo nome.', explanation: 'A vírgula separa o nome da pessoa que está sendo chamada.' },
  ],
  medium: [
    { before: 'Onde você mora', after: '', mark: '?', hint: 'A frase faz uma pergunta.', explanation: 'O ponto de interrogação aparece no fim de uma pergunta.' },
    { before: 'Na cesta havia pão', after: ' queijo e frutas.', mark: ',', hint: 'Separe os itens de uma lista.', explanation: 'A vírgula separa itens de uma lista; antes do último item usamos “e”.' },
    { before: 'Marina', after: ' venha brincar.', mark: ',', hint: 'A frase chama uma pessoa pelo nome.', explanation: 'A vírgula separa o nome da pessoa que está sendo chamada.' },
    { before: 'Você terminou a tarefa', after: '', mark: '?', hint: 'A frase faz uma pergunta.', explanation: 'O ponto de interrogação encerra uma pergunta.' },
    { before: 'Rita', after: ' você deixou seu casaco aqui?', mark: ',', hint: 'A frase chama uma pessoa pelo nome.', explanation: 'A vírgula separa o nome da pessoa que está sendo chamada.' },
    { before: 'Que horas são', after: '', mark: '?', hint: 'Leia a frase como uma pergunta.', explanation: 'O ponto de interrogação encerra uma pergunta.' },
    { before: 'Lucas chegou cedo', after: '', mark: '.', hint: 'A frase informa algo e terminou.', explanation: 'O ponto final encerra uma afirmação.' },
    { before: 'Depois da aula', after: ' vamos à biblioteca.', mark: ',', hint: 'A primeira parte diz quando a ação vai acontecer.', explanation: 'A vírgula separa a expressão inicial “Depois da aula” do restante da frase.' },
    { before: 'Há suco', after: ' água e leite na jarra.', mark: ',', hint: 'Separe os primeiros itens da lista.', explanation: 'A vírgula separa itens de uma lista; antes do último item usamos “e”.' },
    { before: 'Quem trouxe o caderno', after: '', mark: '?', hint: 'A frase faz uma pergunta.', explanation: 'O ponto de interrogação aparece no fim de uma pergunta.' },
  ],
  hard: [
    { before: 'Quando o recreio terminou', after: ' a turma voltou para a sala.', mark: ',', hint: 'A primeira parte explica quando a ação aconteceu.', explanation: 'A vírgula separa a expressão inicial “Quando o recreio terminou” do restante da frase.' },
    { before: 'Apesar da chuva', after: ' o passeio continuou.', mark: ',', hint: 'A primeira parte apresenta uma ideia que contrasta com a segunda.', explanation: 'A vírgula separa a expressão “Apesar da chuva” da ideia principal.' },
    { before: 'A biblioteca fecha às cinco', after: '', mark: '.', hint: 'A frase informa algo e terminou.', explanation: 'O ponto final encerra uma afirmação.' },
    { before: 'Você trouxe o livro', after: '', mark: '?', hint: 'Leia a frase como uma pergunta.', explanation: 'O ponto de interrogação encerra uma pergunta.' },
    { before: 'Se chover amanhã', after: ' ficaremos em casa.', mark: ',', hint: 'A primeira parte apresenta uma condição.', explanation: 'A vírgula separa a condição inicial “Se chover amanhã” da ideia principal.' },
    { before: 'Antes de dormir', after: ' arrumei a mochila.', mark: ',', hint: 'A primeira parte diz quando a ação aconteceu.', explanation: 'A vírgula separa a expressão inicial “Antes de dormir” do restante da frase.' },
    { before: 'Você ouviu o trovão', after: '', mark: '?', hint: 'Leia a frase como uma pergunta.', explanation: 'O ponto de interrogação encerra uma pergunta.' },
    { before: 'A biblioteca fecha às cinco', after: '', mark: '.', hint: 'A frase informa algo e terminou.', explanation: 'O ponto final encerra uma afirmação.' },
    { before: 'No final da apresentação', after: ' os alunos agradeceram.', mark: ',', hint: 'A primeira parte diz quando a ação aconteceu.', explanation: 'A vírgula separa a expressão inicial “No final da apresentação” do restante da frase.' },
    { before: 'Que livro você escolheu', after: '', mark: '?', hint: 'A frase faz uma pergunta.', explanation: 'O ponto de interrogação aparece no fim de uma pergunta.' },
  ],
}

function completedSentence(task: Task) { return `${task.before}${task.mark}${task.after}` }

export default function PunctuationGame() {
  const [level, setLevel] = useGameState<Difficulty>(() => getRecommendedDifficulty('punctuation'))
  const [round, setRound] = useGameState(0)
  const [chosen, setChosen] = useGameState<string | null>(null)
  const [message, setMessage] = useGameState('')
  const taskList = tasks[level]
  const taskIndex = round % taskList.length
  const task = taskList[taskIndex]
  const options = level === 'easy' ? [',', '.'] : [',', '.', '?']
  const correct = chosen === task.mark

  function choose(mark: string) {
    if (correct) return
    const isCorrect = mark === task.mark
    recordAnswer('punctuation', `Complete a frase: ${task.before} ___${task.after}`, mark, task.mark, isCorrect, task.explanation)
    setChosen(mark)
    if (isCorrect) {
      setMessage(`${task.explanation} ${completedSentence(task)}`)
      addStars('punctuation', 1)
      playCorrect()
    } else {
      setMessage(task.hint)
      playIncorrect()
    }
  }

  function nextTask() {
    setRound((value) => value + 1)
    setChosen(null)
    setMessage('')
  }

  return <div className="container"><div className="game punctuation-game">
    <h2>Pontuação Express ✍️</h2>
    <p>Leia a frase e escolha o sinal que está faltando.</p>
    <div className="row difficulty-picker"><label htmlFor="punctuation-level">Nível:</label><select id="punctuation-level" value={level} onChange={(event) => { setLevel(event.target.value as Difficulty); setRound(0); setChosen(null); setMessage('') }}><option value="easy">Começando · vírgula e ponto final</option><option value="medium">Praticando · perguntas e listas</option><option value="hard">Desafio · frases mais longas</option></select></div>
    <div className="punctuation-progress">Desafio {taskIndex + 1} de {taskList.length}</div>
    <div className="content-phase-track" role="progressbar" aria-label="Progresso dos desafios" aria-valuemin={0} aria-valuemax={taskList.length} aria-valuenow={taskIndex + (correct ? 1 : 0)}><span style={{ width: `${((taskIndex + (correct ? 1 : 0)) / taskList.length) * 100}%` }} /></div>
    <div className="punctuation-sentence" aria-label={`${task.before} ${chosen || 'lacuna'} ${task.after}`}>
      <span>{task.before}</span><span className={`punctuation-gap${chosen ? (correct ? ' correct' : ' incorrect') : ''}`}>{chosen || '___'}</span><span>{task.after}</span>
    </div>
    <p className="punctuation-hint">{chosen && !correct ? `💡 ${task.hint}` : `Escolha entre vírgula, ponto final${level === 'easy' ? '.' : ' e ponto de interrogação.'}`}</p>
    <div className="punctuation-options" role="group" aria-label="Sinais de pontuação">
      {options.map((mark) => <button type="button" key={mark} disabled={correct} className={chosen === mark ? (correct ? 'accent' : 'danger') : ''} onClick={() => choose(mark)} aria-label={mark === ',' ? 'Vírgula' : mark === '.' ? 'Ponto final' : 'Ponto de interrogação'}>{mark}</button>)}
    </div>
    <p className="game-message punctuation-feedback" aria-live="polite">{chosen ? message : ''}</p>
    {correct && <button type="button" className="accent punctuation-next-button" onClick={nextTask}>Próxima frase →</button>}
  </div></div>
}
