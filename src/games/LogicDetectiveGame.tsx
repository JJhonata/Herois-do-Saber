import { useMemo } from 'react'
import { useGameState } from '../lib/gameSession'
import { shuffledCycleIndex, shuffle } from '../lib/questionFlow'
import { addStars, getRecommendedDifficulty, type Difficulty } from '../lib/progress'
import { playCorrect, playIncorrect } from '../lib/sfx'
import { shootConfetti } from '../lib/confetti'
import { recordAnswer } from '../lib/review'

type Puzzle = { title: string; emoji: string; clues: string[]; question: string; options: string[]; answer: string; explanation: string }
const puzzles: Record<Difficulty, Puzzle[]> = {
  easy: [
    { title: 'A pista da porta', emoji: '🚪', clues: ['Há duas portas: uma azul e uma amarela.', 'Mia não escolheu a porta azul.'], question: 'Qual porta Mia escolheu?', options: ['Azul', 'Amarela'], answer: 'Amarela', explanation: 'Mia não escolheu a azul. Como existem só duas portas, ela escolheu a amarela.' },
    { title: 'O livro perdido', emoji: '📚', clues: ['Há um livro verde e um livro roxo.', 'Caio não escolheu o livro roxo.'], question: 'Qual livro Caio escolheu?', options: ['Verde', 'Roxo'], answer: 'Verde', explanation: 'Caio não ficou com o livro roxo. Então, entre os dois, escolheu o verde.' },
    { title: 'A mochila de Nina', emoji: '🎒', clues: ['Há uma mochila vermelha e uma azul.', 'Nina não pegou a mochila vermelha.'], question: 'Qual mochila Nina pegou?', options: ['Vermelha', 'Azul'], answer: 'Azul', explanation: 'Nina não pegou a vermelha. Como só há duas mochilas, ela pegou a azul.' },
    { title: 'O lanche de Leo', emoji: '🍎', clues: ['Leo escolheu uma maçã ou uma banana.', 'Ele não escolheu a banana.'], question: 'Qual fruta Leo escolheu?', options: ['Maçã', 'Banana'], answer: 'Maçã', explanation: 'Leo não escolheu a banana, então escolheu a maçã.' },
    { title: 'A bola de Beto', emoji: '⚽', clues: ['A bola pode ser verde ou laranja.', 'Beto escolheu a bola que não é verde.'], question: 'Qual bola Beto escolheu?', options: ['Verde', 'Laranja'], answer: 'Laranja', explanation: 'A pista elimina a bola verde. Beto escolheu a laranja.' },
    { title: 'O animal de Joana', emoji: '🐾', clues: ['Joana viu um gato e um coelho.', 'Ela não escolheu o gato.'], question: 'Qual animal Joana escolheu?', options: ['Gato', 'Coelho'], answer: 'Coelho', explanation: 'Joana não escolheu o gato. Entre as duas opções, escolheu o coelho.' },
    { title: 'A caixa de Ravi', emoji: '📦', clues: ['Uma caixa é pequena e a outra é grande.', 'Ravi não ficou com a caixa pequena.'], question: 'Qual caixa Ravi escolheu?', options: ['Pequena', 'Grande'], answer: 'Grande', explanation: 'Ravi não ficou com a caixa pequena, então escolheu a grande.' },
    { title: 'O caminho de Lila', emoji: '🛤️', clues: ['Há um caminho pela ponte e outro pelo túnel.', 'Lila não passou pelo túnel.'], question: 'Por onde Lila passou?', options: ['Ponte', 'Túnel'], answer: 'Ponte', explanation: 'Lila não passou pelo túnel. O outro caminho é a ponte.' },
    { title: 'A pipa de Davi', emoji: '🪁', clues: ['A pipa de Davi é roxa ou amarela.', 'Ela não é amarela.'], question: 'Qual é a cor da pipa?', options: ['Roxa', 'Amarela'], answer: 'Roxa', explanation: 'A pipa não é amarela, então é roxa.' },
    { title: 'O copo de Isa', emoji: '🥛', clues: ['Há um copo com água e outro com suco.', 'Isa não pegou o copo com água.'], question: 'O que Isa pegou?', options: ['Água', 'Suco'], answer: 'Suco', explanation: 'Isa não pegou água. Portanto, pegou suco.' },
  ],
  medium: [
    { title: 'As caixas coloridas', emoji: '📦', clues: ['Bia ficou com a caixa verde.', 'Lia não escolheu a caixa azul.', 'Cada criança ficou com uma cor diferente.'], question: 'Quem ficou com a caixa azul?', options: ['Bia', 'Enzo', 'Lia'], answer: 'Enzo', explanation: 'Bia ficou com a verde. Lia não ficou com a azul, então ficou com a vermelha. Enzo ficou com a azul.' },
    { title: 'As cartas de animais', emoji: '🐾', clues: ['Téo escolheu a carta do cachorro.', 'Mara não escolheu a carta do gato.', 'Cada pessoa escolheu um animal diferente.'], question: 'Quem escolheu a carta do gato?', options: ['Téo', 'Mara', 'Ivo'], answer: 'Ivo', explanation: 'Téo escolheu o cachorro. Mara não escolheu o gato, então ficou com o papagaio. Ivo ficou com o gato.' },
    { title: 'Os sucos da turma', emoji: '🧃', clues: ['Nina escolheu suco de laranja.', 'Caio não escolheu água.', 'Cada criança escolheu uma bebida diferente: suco, água ou leite.'], question: 'Quem escolheu água?', options: ['Nina', 'Caio', 'Bia'], answer: 'Bia', explanation: 'Nina escolheu suco. Caio não escolheu água, então ficou com leite. Bia ficou com água.' },
    { title: 'O material escolar', emoji: '✏️', clues: ['Rafa escolheu o livro.', 'Bia não escolheu o lápis.', 'Cada pessoa escolheu um item diferente: livro, lápis ou régua.'], question: 'Quem escolheu o lápis?', options: ['Rafa', 'Bia', 'Luca'], answer: 'Luca', explanation: 'Rafa escolheu o livro. Bia não ficou com o lápis, então pegou a régua. Luca ficou com o lápis.' },
    { title: 'Os adesivos', emoji: '🌟', clues: ['Hana escolheu a estrela.', 'Yuri não escolheu a lua.', 'Cada criança escolheu um desenho diferente: estrela, lua ou sol.'], question: 'Quem escolheu a lua?', options: ['Hana', 'Yuri', 'Ivo'], answer: 'Ivo', explanation: 'Hana ficou com a estrela. Yuri não escolheu a lua, então escolheu o sol. Ivo ficou com a lua.' },
    { title: 'As bandeiras', emoji: '🚩', clues: ['Alice pegou a bandeira vermelha.', 'Bruno não pegou a amarela.', 'Cada pessoa pegou uma cor diferente: vermelha, amarela ou azul.'], question: 'Qual bandeira Carla pegou?', options: ['Vermelha', 'Amarela', 'Azul'], answer: 'Amarela', explanation: 'Alice pegou a vermelha. Bruno não ficou com a amarela, então pegou a azul. Carla ficou com a amarela.' },
    { title: 'As formas da mesa', emoji: '🔺', clues: ['Milo escolheu o triângulo.', 'Luna não escolheu o círculo.', 'Cada criança escolheu uma forma diferente: círculo, quadrado ou triângulo.'], question: 'Qual forma Luna escolheu?', options: ['Círculo', 'Quadrado', 'Triângulo'], answer: 'Quadrado', explanation: 'Milo ficou com o triângulo. Luna não escolheu o círculo, então ficou com o quadrado.' },
    { title: 'As plantas do jardim', emoji: '🪴', clues: ['Dora regou a samambaia.', 'Rui não regou a roseira.', 'Cada pessoa cuidou de uma planta diferente: samambaia, roseira ou cacto.'], question: 'Quem cuidou do cacto?', options: ['Dora', 'Rui', 'Léo'], answer: 'Rui', explanation: 'Dora cuidou da samambaia. Rui não ficou com a roseira, então cuidou do cacto. Léo regou a roseira.' },
    { title: 'As cores de tinta', emoji: '🎨', clues: ['Pedro usou tinta azul.', 'Lia não usou tinta verde.', 'Cada artista usou uma cor diferente: azul, verde ou vermelha.'], question: 'Quem usou tinta verde?', options: ['Pedro', 'Lia', 'Noa'], answer: 'Noa', explanation: 'Pedro usou azul. Lia não usou verde, então usou vermelho. Noa usou verde.' },
    { title: 'Os instrumentos', emoji: '🎵', clues: ['Beto toca tambor.', 'Maya não toca flauta.', 'Cada criança toca um instrumento diferente: tambor, flauta ou pandeiro.'], question: 'Quem toca flauta?', options: ['Beto', 'Maya', 'Davi'], answer: 'Davi', explanation: 'Beto toca tambor. Maya não toca flauta, então toca pandeiro. Davi toca flauta.' },
  ],
  hard: [
    { title: 'O código do cofre', emoji: '🔐', clues: ['O código usa 2, 4 e 6, uma vez cada.', 'O 6 está na terceira posição.', 'O 2 aparece antes do 4.'], question: 'Qual é o código correto?', options: ['624', '426', '246', '264'], answer: '246', explanation: 'O 6 fecha o código. Como o 2 vem antes do 4, os dois primeiros algarismos são 2 e 4: 246.' },
    { title: 'As cadeiras da equipe', emoji: '🪑', clues: ['Caio senta na cadeira 1.', 'Duda senta na cadeira 4.', 'Ana senta antes de Beto.'], question: 'Quem senta na cadeira 2?', options: ['Ana', 'Beto', 'Caio', 'Duda'], answer: 'Ana', explanation: 'Caio ocupa a cadeira 1 e Duda a 4. Sobram 2 e 3 para Ana e Beto. Como Ana senta antes de Beto, Ana fica na cadeira 2.' },
    { title: 'O código de três números', emoji: '🔢', clues: ['O código usa 1, 3 e 5, uma vez cada.', 'O 5 está na última posição.', 'O 1 aparece antes do 3.'], question: 'Qual é o código correto?', options: ['153', '315', '135', '531'], answer: '135', explanation: 'O 5 fecha o código. Como o 1 precisa vir antes do 3, a ordem é 1, 3 e 5.' },
    { title: 'A corrida da escola', emoji: '🏃', clues: ['Mia chegou em primeiro lugar.', 'Noah chegou em quarto lugar.', 'Ayla chegou antes de Theo.'], question: 'Quem ficou em segundo lugar?', options: ['Mia', 'Ayla', 'Theo', 'Noah'], answer: 'Ayla', explanation: 'Mia e Noah já ocupam o primeiro e o quarto lugares. Ayla e Theo ficam no segundo e terceiro; como Ayla chegou antes, ficou em segundo.' },
    { title: 'O segundo código', emoji: '🔐', clues: ['O código usa 3, 6 e 8, uma vez cada.', 'O 3 está na primeira posição.', 'O 8 vem imediatamente depois do 6.'], question: 'Qual é o código correto?', options: ['368', '386', '638', '836'], answer: '368', explanation: 'O 3 abre o código. Os algarismos restantes ficam na ordem 6 e 8, pois o 8 vem logo depois do 6.' },
    { title: 'Os lugares no ônibus', emoji: '🚌', clues: ['Juca senta no lugar 1.', 'Lia senta no lugar 4.', 'Beto senta antes de Ana.'], question: 'Quem senta no lugar 2?', options: ['Juca', 'Beto', 'Ana', 'Lia'], answer: 'Beto', explanation: 'Juca e Lia ocupam as pontas. Beto e Ana ficam nos lugares 2 e 3; como Beto senta antes de Ana, ele fica no lugar 2.' },
    { title: 'O código secreto', emoji: '🗝️', clues: ['O código usa 1, 4 e 7, uma vez cada.', 'O 7 está na posição do meio.', 'O 1 aparece antes do 4.'], question: 'Qual é o código correto?', options: ['174', '714', '471', '147'], answer: '174', explanation: 'O 7 fica no meio. Para o 1 aparecer antes do 4, a ordem é 1, 7 e 4.' },
    { title: 'As cartas na fila', emoji: '🃏', clues: ['As cartas azul, vermelha, verde e amarela ocupam as posições 1 a 4.', 'A carta azul está na posição 2.', 'A vermelha não está em primeiro e a verde vem logo depois da vermelha.'], question: 'Qual carta está na primeira posição?', options: ['Azul', 'Vermelha', 'Verde', 'Amarela'], answer: 'Amarela', explanation: 'Azul está em segundo. Vermelha e verde precisam ficar juntas, nessa ordem; só podem ocupar terceiro e quarto. A amarela fica em primeiro.' },
    { title: 'O código do explorador', emoji: '🧭', clues: ['O código usa 2, 5 e 9, uma vez cada.', 'O 9 está na última posição.', 'O 5 aparece antes do 2.'], question: 'Qual é o código correto?', options: ['259', '529', '295', '925'], answer: '529', explanation: 'O 9 fecha o código. Como o 5 vem antes do 2, os dois primeiros algarismos são 5 e 2.' },
    { title: 'O passeio da turma', emoji: '🗺️', clues: ['A biblioteca é a primeira parada.', 'O parque é a quarta parada.', 'A praça vem antes da escola.'], question: 'Qual é a terceira parada?', options: ['Biblioteca', 'Praça', 'Escola', 'Parque'], answer: 'Escola', explanation: 'Biblioteca e parque ocupam a primeira e a quarta posições. Praça e escola ficam no meio; como a praça vem antes da escola, a escola fica em terceiro.' },
  ],
}

export default function LogicDetectiveGame() {
  const [level, setLevel] = useGameState<Difficulty>(() => getRecommendedDifficulty('logic'))
  const [round, setRound] = useGameState(0)
  const [picked, setPicked] = useGameState<string | null>(null)
  const [message, setMessage] = useGameState('')
  const puzzleList = puzzles[level]
  const puzzleIndex = shuffledCycleIndex(puzzleList.length, round, `logic:${level}`)
  const puzzle = puzzleList[puzzleIndex]
  const options = useMemo(() => shuffle(puzzle.options), [level, round])
  const correct = picked === puzzle.answer

  function choose(answer: string) {
    if (correct) return
    const isCorrect = answer === puzzle.answer
    recordAnswer('logic', puzzle.question, answer, puzzle.answer, isCorrect, puzzle.explanation)
    setPicked(answer)
    if (isCorrect) {
      setMessage(puzzle.explanation)
      addStars('logic', 1)
      playCorrect()
      shootConfetti()
    } else {
      setMessage('Ainda não. Releia as pistas e elimine uma possibilidade de cada vez.')
      playIncorrect()
    }
  }

  function nextPuzzle() {
    setRound((value) => value + 1)
    setPicked(null)
    setMessage('')
  }

  return <div className="container"><div className="game logic-game">
    <h2>Detetives da Lógica 🕵️</h2>
    <p>Use as pistas para descobrir a resposta. Você pode tentar de novo.</p>
    <div className="row difficulty-picker"><label htmlFor="logic-level">Nível:</label><select id="logic-level" value={level} onChange={(event) => { setLevel(event.target.value as Difficulty); setRound(0); setPicked(null); setMessage('') }}><option value="easy">Começando · 2 possibilidades</option><option value="medium">Praticando · 3 pistas</option><option value="hard">Desafio · combinações e ordem</option></select></div>
    <section className="logic-case-heading"><span aria-hidden="true">{puzzle.emoji}</span><div><strong>{puzzle.title}</strong><small>Desafio {puzzleIndex + 1} de {puzzleList.length}</small></div></section>
    <div className="content-phase-track" role="progressbar" aria-label="Progresso dos desafios" aria-valuemin={0} aria-valuemax={puzzleList.length} aria-valuenow={puzzleIndex + (correct ? 1 : 0)}><span style={{ width: `${((puzzleIndex + (correct ? 1 : 0)) / puzzleList.length) * 100}%` }} /></div>
    <h3 className="logic-clues-title">Leia as pistas</h3>
    <ol className="logic-clues">{puzzle.clues.map((clue) => <li key={clue}>{clue}</li>)}</ol>
    <h3 className="logic-question">{puzzle.question}</h3>
    <div className="choice-grid logic-options" aria-label="Escolha sua resposta">
      {options.map((option) => <button type="button" key={option} disabled={correct} className={picked === option ? (correct ? 'accent' : 'danger') : ''} onClick={() => choose(option)}>{option}</button>)}
    </div>
    <p className={`game-message logic-feedback${picked && !correct ? ' retry' : ''}`} aria-live="polite">{picked ? message : ''}</p>
    {correct && <button type="button" className="accent logic-next-button" onClick={nextPuzzle}>Próximo mistério →</button>}
  </div></div>
}
