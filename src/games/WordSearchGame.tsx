import { useEffect, useRef } from 'react'
import { useGameState } from '../lib/gameSession'
import { addStars, getRecommendedDifficulty, type Difficulty } from '../lib/progress'
import { playCorrect, playIncorrect } from '../lib/sfx'
import { recordAnswer } from '../lib/review'

const WORDS = ['ESCOLA', 'LIVRO', 'AMIGO', 'CASA', 'GATO', 'BOLA', 'FLOR', 'SOL']
const DESKTOP_GRID_SIZE = 12
const MOBILE_GRID_SIZE = 8
const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1],
] as const

type Puzzle = { grid: string[][]; words: string[] }

function getGridSize() {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 700px)').matches
    ? MOBILE_GRID_SIZE
    : DESKTOP_GRID_SIZE
}

function shuffle<T>(items: T[]) {
  const shuffled = [...items]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function makePuzzle(gridSize: number, difficulty: Difficulty): Puzzle {
  const grid: (string | null)[][] = Array.from({ length: gridSize }, () => Array(gridSize).fill(null))
  const wordCount = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : WORDS.length
  const words = shuffle(WORDS).slice(0, wordCount)

  for (const word of words) {
    let placed = false
    for (let attempt = 0; attempt < 1000 && !placed; attempt++) {
      const [rowStep, colStep] = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)]
      const startRow = Math.floor(Math.random() * gridSize)
      const startCol = Math.floor(Math.random() * gridSize)
      const path = [...word].map((letter, offset) => ({
        letter,
        row: startRow + rowStep * offset,
        col: startCol + colStep * offset,
      }))
      const fits = path.every(({ letter, row, col }) => row >= 0 && row < gridSize && col >= 0 && col < gridSize && (grid[row][col] === null || grid[row][col] === letter))
      if (!fits) continue
      path.forEach(({ letter, row, col }) => { grid[row][col] = letter })
      placed = true
    }
  }

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  return {
    grid: grid.map((row) => row.map((letter) => letter ?? letters[Math.floor(Math.random() * letters.length)])),
    words,
  }
}

export default function WordSearchGame() {
  const [difficulty, setDifficulty] = useGameState<Difficulty>(() => getRecommendedDifficulty('wordsearch'))
  const [gridSize, setGridSize] = useGameState(getGridSize)
  const [puzzle, setPuzzle] = useGameState(() => makePuzzle(getGridSize(), getRecommendedDifficulty('wordsearch')))
  const [foundWords, setFoundWords] = useGameState<string[]>([])
  const [foundCells, setFoundCells] = useGameState<number[]>([])
  const [targetIndex, setTargetIndex] = useGameState(0)
  const [selection, setSelection] = useGameState<number[]>([])
  const [message, setMessage] = useGameState('')
  const pointerSelecting = useRef(false)
  const lastPointerAt = useRef(0)
  const initialized = useRef(false)
  const target = puzzle.words[targetIndex]
  const complete = foundWords.length === puzzle.words.length

  useEffect(() => {
    const media = window.matchMedia('(max-width: 700px)')
    const updateGridSize = () => setGridSize(media.matches ? MOBILE_GRID_SIZE : DESKTOP_GRID_SIZE)
    media.addEventListener('change', updateGridSize)
    return () => media.removeEventListener('change', updateGridSize)
  }, [])

  useEffect(() => {
    if (!initialized.current) { initialized.current = true; return }
    setPuzzle(makePuzzle(gridSize, difficulty))
    setFoundWords([])
    setFoundCells([])
    setTargetIndex(0)
    setSelection([])
    setMessage('')
  }, [gridSize, difficulty])

  function clearSelection() {
    setSelection([])
    setMessage('Seleção limpa. Comece pela primeira ou última letra da palavra.')
  }

  function chooseCell(index: number) {
    if (complete || foundCells.includes(index) || !target) return

    const size = puzzle.grid.length
    const row = Math.floor(index / size)
    const col = index % size
    const letter = puzzle.grid[row][col]
    const lastIndex = selection[selection.length - 1]
    let nextSelection: number[]

    if (selection.includes(index)) {
      if (selection[selection.length - 2] === index) {
        nextSelection = selection.slice(0, -1)
        setSelection(nextSelection)
        setMessage(nextSelection.map((cell) => puzzle.grid[Math.floor(cell / size)][cell % size]).join(''))
      }
      return
    }

    if (selection.length === 0) {
      if (letter !== target[0] && letter !== target[target.length - 1]) {
        setMessage(`Comece por ${target[0]} ou pela última letra, ${target[target.length - 1]}.`)
        return
      }
      nextSelection = [index]
    } else {
      const lastRow = Math.floor(lastIndex / size)
      const lastCol = lastIndex % size
      const adjacent = Math.abs(row - lastRow) <= 1 && Math.abs(col - lastCol) <= 1
      if (!adjacent) {
        setMessage('Escolha uma letra vizinha à última que marcou.')
        return
      }
      nextSelection = [...selection, index]
    }

    const sequence = nextSelection.map((cell) => puzzle.grid[Math.floor(cell / size)][cell % size]).join('')
    const reversedTarget = [...target].reverse().join('')
    const matchesPrefix = target.startsWith(sequence) || reversedTarget.startsWith(sequence)
    if (!matchesPrefix) {
      recordAnswer('wordsearch', `Encontre a palavra ${target}`, sequence, target, false, 'Selecione as letras vizinhas na ordem da palavra. Ela pode estar escrita nos dois sentidos.')
      setSelection([])
      playIncorrect()
      setMessage('Essa sequência não forma a palavra. Tente começar de novo.')
      return
    }

    setSelection(nextSelection)
    setMessage(`Letras selecionadas: ${sequence}`)
    if (sequence === target || sequence === reversedTarget) {
      recordAnswer('wordsearch', `Encontre a palavra ${target}`, sequence, target, true, 'A palavra estava escondida em uma linha diagonal, vertical ou horizontal.')
      setFoundWords((words) => [...words, target])
      setFoundCells((cells) => [...cells, ...nextSelection])
      setSelection([])
      setTargetIndex((value) => value + 1)
      setMessage(`Encontrou ${target}! Muito bem! 🔎`)
      addStars('wordsearch', 1)
      playCorrect()
    }
  }

  function restart() {
    setPuzzle(makePuzzle(gridSize, difficulty))
    setFoundWords([])
    setFoundCells([])
    setTargetIndex(0)
    setSelection([])
    setMessage('Nova grade embaralhada. Boa caça!')
  }

  return <div className="container"><div className="game">
    <h2>Caça-Palavras 🔎🔤</h2>
    <p>{complete ? 'Você encontrou todas as palavras!' : <>Encontre <strong>{target}</strong>. Toque nas letras em sequência ou arraste o dedo pela palavra.</>}</p>
    <div className="row difficulty-picker"><label htmlFor="wordsearch-level">Nível:</label><select id="wordsearch-level" value={difficulty} onChange={event => setDifficulty(event.target.value as Difficulty)}><option value="easy">Começando · 4 palavras</option><option value="medium">Praticando · 6 palavras</option><option value="hard">Desafio · 8 palavras</option></select></div>
    <div className={`word-search-grid${gridSize === MOBILE_GRID_SIZE ? ' mobile-grid' : ''}`} role="group" aria-label="Grade do caça-palavras" onPointerUp={() => { pointerSelecting.current = false }} onPointerCancel={() => { pointerSelecting.current = false }}>
      {puzzle.grid.flat().map((letter, index) => {
        const row = Math.floor(index / gridSize)
        const col = index % gridSize
        const found = foundCells.includes(index)
        const selected = selection.includes(index)
        return <button type="button" key={index} className={`word-cell${found ? ' found' : selected ? ' selected' : ''}`} disabled={found || complete} aria-pressed={selected || found} aria-label={`Linha ${row + 1}, coluna ${col + 1}, letra ${letter}${found ? ', palavra encontrada' : ''}`} onPointerDown={(event) => { event.preventDefault(); pointerSelecting.current = true; lastPointerAt.current = Date.now(); chooseCell(index) }} onPointerEnter={() => { if (pointerSelecting.current) { lastPointerAt.current = Date.now(); chooseCell(index) } }} onClick={(event) => { if (event.detail === 0 || Date.now() - lastPointerAt.current > 500) chooseCell(index) }}>{letter}</button>
      })}
    </div>
    <div className="row" style={{ justifyContent: 'center' }}>
      <button type="button" className="secondary" onClick={clearSelection} disabled={selection.length === 0 || complete}>Limpar seleção</button>
      <button type="button" className="secondary" onClick={restart}>Nova grade</button>
    </div>
    <p className="game-message" aria-live="polite">Encontradas: {foundWords.join(', ') || 'nenhuma'}<br />{complete ? 'Parabéns, você achou todas! 🏆' : message}</p>
  </div></div>
}
