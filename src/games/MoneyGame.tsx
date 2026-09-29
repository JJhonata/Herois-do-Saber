import { useGameState } from '../lib/gameSession'
import { addStars, getRecommendedDifficulty, type Difficulty } from '../lib/progress'
import { playCorrect, playIncorrect } from '../lib/sfx'

const items = [
  { name: 'Lápis', emoji: '✏️', price: 3 }, { name: 'Caderno', emoji: '📒', price: 12 },
  { name: 'Borracha', emoji: '🧽', price: 4 }, { name: 'Livro', emoji: '📘', price: 18 },
  { name: 'Suco', emoji: '🧃', price: 6 }, { name: 'Régua', emoji: '📏', price: 5 },
  { name: 'Canetinha', emoji: '🖍️', price: 8 }, { name: 'Mochila', emoji: '🎒', price: 35 },
  { name: 'Estojo', emoji: '👝', price: 20 }, { name: 'Garrafinha', emoji: '🥤', price: 15 },
  { name: 'Quebra-cabeça', emoji: '🧩', price: 25 }, { name: 'Bola', emoji: '⚽', price: 30 },
]

export default function MoneyGame() {
  const [level, setLevel] = useGameState<Difficulty>(() => getRecommendedDifficulty('money'))
  const [index, setIndex] = useGameState(0)
  const [answer, setAnswer] = useGameState('')
  const [message, setMessage] = useGameState('')
  const [resolved, setResolved] = useGameState(false)
  const deck = items.filter(({ price }) => level === 'easy' ? price <= 10 : level === 'medium' ? price <= 25 : true)
  const item = deck[index % deck.length]
  const payments = level === 'easy' ? [5] : level === 'medium' ? [5, 10] : [5, 10, 20]
  const paid = item.price + payments[index % payments.length]
  const change = paid - item.price

  function check() {
    if (resolved) return
    if (Number(answer) === change && answer.trim() !== '') {
      setResolved(true)
      addStars('money', 2)
      playCorrect()
      setMessage('Troco correto! 💰')
      setTimeout(() => { setIndex((value) => value + 1); setAnswer(''); setMessage(''); setResolved(false) }, 700)
    } else {
      playIncorrect()
      setMessage(`Dica: faça R$ ${paid} - R$ ${item.price}.`)
    }
  }

  return <div className="container"><div className="game">
    <h2>Mercadinho do Saber 🛒💵</h2><p>Calcule quanto deve voltar de troco.</p>
    <div className="row difficulty-picker"><label htmlFor="money-level">Nível:</label><select id="money-level" value={level} onChange={event => { setLevel(event.target.value as Difficulty); setIndex(0); setAnswer(''); setMessage(''); setResolved(false) }}><option value="easy">Começando · preços menores</option><option value="medium">Praticando · preços médios</option><option value="hard">Desafio · valores variados</option></select></div>
    <div className="shop-item"><span aria-hidden="true">{item.emoji}</span><strong>{item.name}</strong><b>Preço: R$ {item.price},00</b><small>Você pagou com R$ {paid},00</small></div>
    <div className="row" style={{ justifyContent: 'center' }}>
      <label className="visually-hidden" htmlFor="change-answer">Troco em reais</label>
      <input id="change-answer" inputMode="numeric" value={answer} onChange={(event) => setAnswer(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && check()} placeholder="Troco em reais" disabled={resolved} />
      <button className="accent" onClick={check} disabled={resolved}>Conferir</button>
    </div>
    <p className="game-message" aria-live="polite">{message}</p>
  </div></div>
}
