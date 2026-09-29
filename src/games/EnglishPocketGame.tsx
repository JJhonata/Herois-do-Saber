import { useMemo, useState } from 'react'
import { useGameState } from '../lib/gameSession'
import { addStars, getRecommendedDifficulty, type Difficulty } from '../lib/progress'
import { playCorrect, playIncorrect } from '../lib/sfx'
import { recordAnswer } from '../lib/review'

type Word = { word: string; portuguese: string; emoji: string }
const words: Record<Difficulty, Word[]> = {
  easy: [
    { word: 'cat', portuguese: 'gato', emoji: '🐱' }, { word: 'dog', portuguese: 'cachorro', emoji: '🐶' },
    { word: 'sun', portuguese: 'sol', emoji: '☀️' }, { word: 'fish', portuguese: 'peixe', emoji: '🐟' },
    { word: 'book', portuguese: 'livro', emoji: '📘' }, { word: 'bird', portuguese: 'pássaro', emoji: '🐦' },
    { word: 'mom', portuguese: 'mãe', emoji: '👩' }, { word: 'car', portuguese: 'carro', emoji: '🚗' },
    { word: 'red', portuguese: 'vermelho', emoji: '🟥' }, { word: 'star', portuguese: 'estrela', emoji: '⭐' },
  ],
  medium: [
    { word: 'apple', portuguese: 'maçã', emoji: '🍎' }, { word: 'house', portuguese: 'casa', emoji: '🏠' },
    { word: 'water', portuguese: 'água', emoji: '💧' }, { word: 'school', portuguese: 'escola', emoji: '🏫' },
    { word: 'banana', portuguese: 'banana', emoji: '🍌' }, { word: 'tree', portuguese: 'árvore', emoji: '🌳' },
    { word: 'shoe', portuguese: 'sapato', emoji: '👟' }, { word: 'flower', portuguese: 'flor', emoji: '🌷' },
    { word: 'bread', portuguese: 'pão', emoji: '🍞' }, { word: 'train', portuguese: 'trem', emoji: '🚆' },
  ],
  hard: [
    { word: 'window', portuguese: 'janela', emoji: '🪟' }, { word: 'chair', portuguese: 'cadeira', emoji: '🪑' },
    { word: 'green', portuguese: 'verde', emoji: '🟢' }, { word: 'clock', portuguese: 'relógio', emoji: '⏰' },
    { word: 'bread', portuguese: 'pão', emoji: '🍞' }, { word: 'cloud', portuguese: 'nuvem', emoji: '☁️' },
    { word: 'key', portuguese: 'chave', emoji: '🔑' }, { word: 'train', portuguese: 'trem', emoji: '🚆' },
    { word: 'mountain', portuguese: 'montanha', emoji: '⛰️' }, { word: 'moon', portuguese: 'lua', emoji: '🌙' },
  ],
}

function speak(word: string) {
  if (!('speechSynthesis' in window)) return false
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(word)
  utterance.lang = 'en-US'
  utterance.rate = 0.78
  window.speechSynthesis.speak(utterance)
  return true
}

function shuffle<T>(items: T[]) { return [...items].sort(() => Math.random() - 0.5) }

export default function EnglishPocketGame() {
  const [level, setLevel] = useGameState<Difficulty>(() => getRecommendedDifficulty('english'))
  const [round, setRound] = useGameState(0)
  const [picked, setPicked] = useGameState<string | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [voiceMessage, setVoiceMessage] = useState('')
  const wordList = words[level]
  const wordIndex = round % wordList.length
  const word = wordList[wordIndex]
  const optionCount = level === 'easy' ? 2 : level === 'medium' ? 3 : 4
  const options = useMemo(() => shuffle([word, ...shuffle(wordList.filter((item) => item.word !== word.word)).slice(0, optionCount - 1)]), [round, level])
  const correct = picked === word.word

  function listen() {
    setVoiceMessage(speak(word.word) ? 'Ouvindo a palavra em inglês.' : 'Este navegador não oferece leitura em voz alta.')
  }

  function choose(option: Word) {
    if (correct) return
    const isCorrect = option.word === word.word
    recordAnswer('english', 'Ouça a palavra em inglês e escolha a figura correspondente.', option.portuguese, word.portuguese, isCorrect, `“${word.word}” significa “${word.portuguese}”.`)
    setPicked(option.word)
    setShowHint(false)
    if (isCorrect) {
      setFeedback('')
      addStars('english', 1)
      playCorrect()
    } else {
      setFeedback('Não é essa figura. Ouça novamente ou use a dica em português.')
      playIncorrect()
    }
  }

  function nextWord() {
    setRound((value) => value + 1)
    setPicked(null)
    setShowHint(false)
    setFeedback('')
    setVoiceMessage('')
  }

  return <div className="container"><div className="game english-game">
    <h2>Inglês de Bolso 🇬🇧</h2>
    <p>Ouça a palavra em inglês e toque na figura correspondente.</p>
    <div className="row difficulty-picker"><label htmlFor="english-level">Nível:</label><select id="english-level" value={level} onChange={(event) => { setLevel(event.target.value as Difficulty); setRound(0); setPicked(null); setShowHint(false); setFeedback(''); setVoiceMessage('') }}><option value="easy">Começando · palavras conhecidas</option><option value="medium">Praticando · objetos e natureza</option><option value="hard">Desafio · novas palavras</option></select></div>
    <div className="english-prompt"><span aria-hidden="true">🎧</span><div><strong>Desafio {wordIndex + 1} de {wordList.length}</strong><p>Toque no botão para ouvir com calma.</p></div></div>
    <div className="content-phase-track" role="progressbar" aria-label="Progresso dos desafios" aria-valuemin={0} aria-valuemax={wordList.length} aria-valuenow={wordIndex + (correct ? 1 : 0)}><span style={{ width: `${((wordIndex + (correct ? 1 : 0)) / wordList.length) * 100}%` }} /></div>
    <button type="button" className="english-listen-button" onClick={listen}>🔊 Ouvir palavra</button>
    <button type="button" className="english-hint-toggle" aria-expanded={showHint} onClick={() => setShowHint((visible) => !visible)}>{showHint ? 'Esconder dica' : 'Ver dica em português'}</button>
    {showHint && <p className="english-hint">A palavra significa: <strong>{word.portuguese}</strong></p>}
    <div className="english-picture-grid" role="group" aria-label="Escolha a figura correspondente à palavra ouvida">
      {options.map((option) => <button type="button" key={option.word} aria-label={option.portuguese} disabled={correct} className={picked === option.word ? (correct ? 'correct' : 'incorrect') : ''} onClick={() => choose(option)}><span aria-hidden="true">{option.emoji}</span></button>)}
    </div>
    <p className={`game-message english-feedback${picked && !correct ? ' retry' : ''}`} aria-live="polite">{correct ? <><strong>{word.word}</strong> significa <strong>{word.portuguese}</strong>. 🌟</> : picked ? feedback : ''}</p>
    {correct && <div className="english-success-actions"><button type="button" className="secondary" onClick={listen}>🔊 Ouvir de novo</button><button type="button" className="accent" onClick={nextWord}>Próxima palavra →</button></div>}
    <span className="visually-hidden" role="status">{voiceMessage}</span>
  </div></div>
}
