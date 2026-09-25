import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getStars, type GameId } from './lib/progress'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import MathGame from './games/MathGame'
import MemoryGame from './games/MemoryGame'
import QuizGame from './games/QuizGame'
import SecurityGame from './games/SecurityGame'
import DitadoMaluco from './games/DitadoMaluco'
import WordScramble from './games/WordScramble'
import TypingSpeed from './games/TypingSpeed'
import PaintGame from './games/PaintGame'
import SyllableGame from './games/SyllableGame'
import SequenceGame from './games/SequenceGame'
import ScienceTrueFalse from './games/ScienceTrueFalse'
import CategoryGame from './games/CategoryGame'
import SentenceBuilder from './games/SentenceBuilder'
import TimesTableGame from './games/TimesTableGame'
import ClockGame from './games/ClockGame'
import MoneyGame from './games/MoneyGame'
import WordSearchGame from './games/WordSearchGame'
import BrazilRegionsGame from './games/BrazilRegionsGame'
import HabitatGame from './games/HabitatGame'
import ReadingGame from './games/ReadingGame'


const routeGameIds: Record<string, GameId> = {
  '/math':'math','/memory':'memory','/quiz':'quiz','/security':'security','/ditado':'ditado','/scramble':'scramble','/typing':'typing','/paint':'paint','/syllable':'syllable','/sequence':'sequence','/science':'science','/category':'category','/sentence':'sentence','/times':'times','/clock':'clock','/money':'money','/wordsearch':'wordsearch','/regions':'regions','/habitat':'habitat','/reading':'reading'
}

function GamePhase({ path }: { path: string }) {
  const [, setTick] = useState(0)
  const id = routeGameIds[path]
  useEffect(() => {
    const update = () => setTick((t: number) => t + 1)
    window.addEventListener('progress:update', update)
    return () => window.removeEventListener('progress:update', update)
  }, [])
  if (!id) return null
  const stars = getStars(id)
  const phase = Math.min(10, Math.floor(stars / 5) + 1)
  const completed = stars >= 50
  const inPhase = completed ? 5 : stars % 5
  return <div className="global-phase"><strong>Fase {phase} de 10</strong><div className="phase-track"><span style={{width:`${Math.min(100,(inPhase/5)*100)}%`}} /></div><small>{completed ? 'Todas as fases concluídas 🌟' : phase === 10 ? `${5-inPhase} estrela(s) para concluir` : `${5-inPhase} estrela(s) para a próxima fase`}</small></div>
}

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  return (
    <>
      <Navbar />
      {location.pathname !== '/' && (<>
        <button className="global-back-button" onClick={() => navigate('/')}>← Voltar aos jogos</button>
        <GamePhase path={location.pathname} />
      </>)}
      <div className="route-transition" key={location.pathname}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/math" element={<MathGame />} />
        <Route path="/memory" element={<MemoryGame />} />
        <Route path="/quiz" element={<QuizGame />} />
        <Route path="/security" element={<SecurityGame />} />
        <Route path="/ditado" element={<DitadoMaluco />} />
        <Route path="/scramble" element={<WordScramble />} />
        <Route path="/typing" element={<TypingSpeed />} />
        <Route path="/paint" element={<PaintGame />} />
        <Route path="/syllable" element={<SyllableGame />} />
        <Route path="/sequence" element={<SequenceGame />} />
        <Route path="/science" element={<ScienceTrueFalse />} />
        <Route path="/category" element={<CategoryGame />} />
        <Route path="/sentence" element={<SentenceBuilder />} />
        <Route path="/times" element={<TimesTableGame />} />
        <Route path="/clock" element={<ClockGame />} />
        <Route path="/money" element={<MoneyGame />} />
        <Route path="/wordsearch" element={<WordSearchGame />} />
        <Route path="/regions" element={<BrazilRegionsGame />} />
        <Route path="/habitat" element={<HabitatGame />} />
        <Route path="/reading" element={<ReadingGame />} />
        <Route path="*" element={<Home />} />
      </Routes>
      </div>
    </>
  )
}