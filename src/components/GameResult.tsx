import { Link } from 'react-router-dom'

type Props = {
  score: number
  total: number
  reviewCount?: number
  onRestart: () => void
}

export default function GameResult({ score, total, reviewCount = 0, onRestart }: Props) {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0
  const message = percentage >= 80 ? 'Excelente trabalho! Você está pronto para o próximo desafio.' : percentage >= 50 ? 'Bom esforço! Reveja os erros e tente melhorar sua marca.' : 'Cada tentativa ajuda a aprender. Vamos praticar mais uma vez.'

  return <section className="game-result" role="status" aria-live="polite" aria-labelledby="game-result-title">
    <span className="game-result-icon" aria-hidden="true">{percentage >= 80 ? '🏆' : '🌱'}</span>
    <span className="eyebrow">ATIVIDADE CONCLUÍDA</span>
    <h3 id="game-result-title">Você acertou {score} de {total}</h3>
    <strong className="game-result-score">{percentage}% de aproveitamento</strong>
    <p>{message}</p>
    <div className="game-result-actions">
      <button type="button" className="accent" autoFocus onClick={onRestart}>Jogar novamente</button>
      {reviewCount > 0 && <Link to="#game-support" className="game-result-review">Revisar erros ({reviewCount})</Link>}
    </div>
  </section>
}
