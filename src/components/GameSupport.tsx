import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { gameCatalog, gameHints, gameLearnings } from '../lib/gameCatalog'
import { getRecommendedDifficulty } from '../lib/progress'
import { clearGameSession } from '../lib/gameSession'
import { clearGameReview, getGameReview, getGameReviewCount, getGameRoundReview, type AnswerReview } from '../lib/review'

const difficultyLabels = { easy: 'Começando', medium: 'Praticando', hard: 'Desafio' }

function readChallengeAloud() {
  if (!('speechSynthesis' in window)) return false
  const game = document.querySelector('.game')
  if (!game) return false

  const selectors = [
    '.game h2', '.game > p:not(.game-message)', '.game h3', '.reading-text',
    '.math-battle', '.digital-clock', '.state-card', '.animal-card',
    '.sentence-target', '.number-sequence', '.syllable-word',
    '.fraction-order', '.fraction-count', '.map-mission-prompt', '.map-key',
    '.nature-question', '.nature-cycle-heading', '.nature-sequence-summary',
    '.punctuation-sentence', '.english-prompt', '.english-hint', '.logic-case-heading', '.logic-clues', '.logic-question',
    '.choice-grid button:not(:disabled)',
  ]
  const parts = selectors.flatMap((selector) => Array.from(game.querySelectorAll(selector)))
    .map((element) => element.textContent?.replace(/\s+/g, ' ').trim() || '')
    .filter(Boolean)
  const text = [...new Set(parts)].join('. ')
  if (!text) return false

  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'pt-BR'
  utterance.rate = 0.88
  window.speechSynthesis.speak(utterance)
  return true
}

export default function GameSupport({ path }: { path: string }) {
  const [showHint, setShowHint] = useState(false)
  const [showLearning, setShowLearning] = useState(false)
  const [missedAnswer, setMissedAnswer] = useState(false)
  const [review, setReview] = useState<AnswerReview[]>([])
  const [reviewCount, setReviewCount] = useState(0)
  const [roundNumber, setRoundNumber] = useState(0)
  const [roundReview, setRoundReview] = useState<AnswerReview[]>([])
  const [showReview, setShowReview] = useState(false)
  const [voiceMessage, setVoiceMessage] = useState('')
  const navigate = useNavigate()
  const game = gameCatalog.find(({ path: gamePath }) => gamePath === path)
  useEffect(() => {
    const message = document.querySelector('.game-message')
    if (!message) return
    const update = () => setMissedAnswer(/tente|ops|errad|incorret|observe|pense|releia|escolha outra/i.test(message.textContent || ''))
    const observer = new MutationObserver(update)
    observer.observe(message, { childList: true, characterData: true, subtree: true })
    update()
    return () => observer.disconnect()
  }, [path])
  useEffect(() => {
    if (!game) return
    let seenCount = getGameReviewCount(game.id)
    const refresh = (event?: Event) => {
      const changedGame = (event as CustomEvent<{ game?: string }> | undefined)?.detail?.game
      if (changedGame && changedGame !== game.id) return
      const total = getGameReviewCount(game.id)
      setReview(getGameReview(game.id))
      setReviewCount(total)
      const completeRounds = Math.floor(total / 5)
      if (completeRounds > Math.floor(seenCount / 5)) {
        setRoundNumber(completeRounds)
        setRoundReview(getGameRoundReview(game.id, completeRounds))
        setShowReview(true)
      } else if (completeRounds > 0 && roundNumber === 0) {
        setRoundNumber(completeRounds)
        setRoundReview(getGameRoundReview(game.id, completeRounds))
      }
      seenCount = total
    }
    refresh()
    window.addEventListener('review:update', refresh)
    return () => window.removeEventListener('review:update', refresh)
  }, [game?.id])
  if (!game) return null

  const difficulty = difficultyLabels[getRecommendedDifficulty(game.id)]
  return <section className="game-support" aria-label="Ajuda para esta atividade">
    <div className="game-support-actions">
      <span className="recommended-level"><span aria-hidden="true">🧭</span> Nível sugerido: <strong>{difficulty}</strong></span>
      <div className="game-support-buttons">
        <button type="button" className="support-button hint-button" aria-expanded={showHint} onClick={() => setShowHint((visible) => !visible)}>
          💡 {showHint ? 'Fechar dica' : 'Preciso de uma dica'}
        </button>
        <button type="button" className="support-button voice-button" onClick={() => setVoiceMessage(readChallengeAloud() ? 'Lendo a atividade em voz alta.' : 'A leitura em voz alta não está disponível neste navegador.')}> 
          🔊 Ouvir atividade
        </button>
        <button type="button" className="support-button reset-game-button" onClick={() => { if (window.confirm('Recomeçar esta atividade do início? Suas estrelas conquistadas serão mantidas.')) { clearGameSession(game.id); clearGameReview(game.id); navigate(game.path, { replace: true }); window.location.reload() } }}>
          ↺ Recomeçar
        </button>
      </div>
    </div>
    {showHint && <p className="game-hint">{gameHints[game.id]}</p>}
    {reviewCount > 0 && <section className="round-review" aria-label="Resumo desta atividade">
      {roundNumber > 0 ? <>
        <div className="round-review-heading"><strong>📊 Resumo da rodada {roundNumber}</strong><span>{roundReview.filter(({ correct }) => correct).length}/{roundReview.length} acertos</span></div>
        <p>{roundReview.filter(({ correct }) => !correct).length} resposta(s) para revisar · rodada concluída a cada 5 tentativas</p>
      </> : <div className="round-review-heading"><strong>📊 Rodada em andamento</strong><span>{reviewCount}/5 tentativas</span></div>}
      <button type="button" className="learning-feedback-toggle" aria-expanded={showReview} onClick={() => setShowReview((visible) => !visible)}>
        {showReview ? 'Fechar revisão' : `Rever erros (${review.filter(({ correct }) => !correct).length})`}
      </button>
      {showReview && <ol className="mistake-review">{review.filter(({ correct }) => !correct).slice().reverse().map((item) => <li key={item.id}>
        <strong>{item.question}</strong><span>Sua resposta: {item.answer || '—'}</span><span>Resposta esperada: {item.expected}</span><small>{item.explanation}</small>
      </li>)}</ol>}
    </section>}
    <div className="learning-feedback">
      <button type="button" className="learning-feedback-toggle" aria-expanded={showLearning} onClick={() => setShowLearning((visible) => !visible)}>
        📘 {showLearning ? 'Fechar aprendizado' : 'O que estou aprendendo?'}
      </button>
      {showLearning && <p>{gameLearnings[game.id]}</p>}
      {missedAnswer && <p className="gentle-feedback" role="status">Tudo bem errar enquanto aprende. {gameLearnings[game.id]}</p>}
    </div>
    {voiceMessage && <span className="visually-hidden" role="status">{voiceMessage}</span>}
  </section>
}
