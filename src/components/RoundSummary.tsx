type Props = {
  roundNumber: number
  correct: number
  total: number
}

export default function RoundSummary({ roundNumber, correct, total }: Props) {
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0
  const message = percentage >= 80 ? 'Excelente trabalho! Continue avançando.' : percentage >= 50 ? 'Bom esforço! Reveja os erros e tente novamente.' : 'Cada tentativa ensina algo novo. Vamos praticar mais uma vez.'

  return <div className="round-summary" role="status" aria-live="polite">
    <div className="round-summary-heading">
      <span className="round-summary-icon" aria-hidden="true">{percentage >= 80 ? '🏅' : '🌱'}</span>
      <div><strong>Rodada {roundNumber} concluída</strong><span>{correct}/{total} acertos · {percentage}%</span></div>
    </div>
    <p>{message}</p>
  </div>
}
