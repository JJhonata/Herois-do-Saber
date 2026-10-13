import { Link } from 'react-router-dom'

export default function NotFound() {
  return <div className="container not-found-page">
    <section className="not-found-panel" aria-labelledby="not-found-title">
      <span className="not-found-icon" aria-hidden="true">🧭</span>
      <span className="eyebrow">CAMINHO NÃO ENCONTRADO</span>
      <h1 id="not-found-title">Essa aventura não existe</h1>
      <p>A página que você tentou abrir não está disponível. Volte para a central de jogos e escolha outro desafio.</p>
      <Link to="/" className="accent play-button">Voltar aos jogos</Link>
    </section>
  </div>
}