import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Props = { children: ReactNode }
type State = { hasError: boolean }

export default class GameErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Falha ao abrir atividade:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="container game-load-error" role="alert" aria-live="assertive">
          <span aria-hidden="true">🛠️</span>
          <h1>Esta atividade não carregou</h1>
          <p>Ocorreu um problema ao abrir o jogo. Tente novamente ou escolha outra atividade.</p>
          <div className="game-load-actions">
            <button onClick={() => window.location.reload()}>Tentar novamente</button>
            <Link className="game-load-home" to="/">Voltar aos jogos</Link>
          </div>
        </section>
      )
    }

    return this.props.children
  }
}
