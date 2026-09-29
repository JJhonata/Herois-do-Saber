import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { gameCatalog, gameHints, gameLearnings } from '../lib/gameCatalog'
import { getRecommendedDifficulty } from '../lib/progress'
import { clearGameSession } from '../lib/gameSession'

const difficultyLabels = { easy: 'Começando', medium: 'Praticando', hard: 'Desafio' }

function readChallengeAloud() {
  if (!('speechSynthesis' in window)) return false
  const game = document.querySelector('.game')
  if (!game) return false

  const selectors = [
    '.game h2', '.game > p:not(.game-message)', '.game h3', '.reading-text',
    '.math-battle', '.digital-clock', '.state-card', '.animal-card',
    '.sentence-target', '.number-sequence', '.syllable-word',
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
        <button type="button" className="support-button reset-game-button" onClick={() => { if (window.confirm('Recomeçar esta atividade do início? Suas estrelas conquistadas serão mantidas.')) { clearGameSession(game.id); navigate(game.path, { replace: true }); window.location.reload() } }}>
          ↺ Recomeçar
        </button>
      </div>
    </div>
    {showHint && <p className="game-hint">{gameHints[game.id]}</p>}
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
