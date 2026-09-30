import { Suspense, useEffect, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import { gameCatalog } from './lib/gameCatalog'
import { getStars } from './lib/progress'
import { setLastPlayedGame } from './lib/progress'
import GameSupport from './components/GameSupport'
import GameErrorBoundary from './components/GameErrorBoundary'
import { GameSession } from './lib/gameSession'

function GamePhase({ path }: { path: string }) {
  const [, setTick] = useState(0)
  const game = gameCatalog.find(({ path: gamePath }) => gamePath === path)
  useEffect(() => {
    const update = () => setTick((tick) => tick + 1)
    window.addEventListener('progress:update', update)
    return () => window.removeEventListener('progress:update', update)
  }, [])
  if (!game) return null
  const stars = getStars(game.id)
  const phase = Math.min(10, Math.floor(stars / 5) + 1)
  const completed = stars >= 50
  const inPhase = completed ? 5 : stars % 5
  return <div className="global-phase"><strong>Fase {phase} de 10</strong><div className="phase-track"><span style={{ width: `${Math.min(100, (inPhase / 5) * 100)}%` }} /></div><small>{completed ? 'Todas as fases concluídas 🌟' : `${5 - inPhase} estrela(s) para ${phase === 10 ? 'concluir' : 'a próxima fase'}`}</small></div>
}

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const activeGame = gameCatalog.find(({ path }) => path === location.pathname)

  useEffect(() => {
    if (activeGame) setLastPlayedGame(activeGame.id)
  }, [activeGame])

  return (
    <>
      <Navbar />
      <a className="skip-link" href="#main-content">Pular para o conteúdo</a>
      {location.pathname !== '/' && <>
        <button className="global-back-button" onClick={() => navigate('/')}>← Voltar aos jogos</button>
        <GamePhase path={location.pathname} />
        <GameSupport path={location.pathname} />
      </>}
      <main id="main-content" className={`route-transition${activeGame ? ' game-route' : ''}`} data-game-area={activeGame?.area} key={location.pathname} tabIndex={-1}>
        <GameErrorBoundary key={location.pathname}>
          <Suspense fallback={<div className="container game-loading" role="status"><span className="loading-spinner" aria-hidden="true" />Carregando atividade…</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              {gameCatalog.map(({ id, path, component: Game }) => <Route key={id} path={path} element={<GameSession gameId={id}><Game /></GameSession>} />)}
              <Route path="*" element={<Home />} />
            </Routes>
          </Suspense>
        </GameErrorBoundary>
      </main>
    </>
  )
}
