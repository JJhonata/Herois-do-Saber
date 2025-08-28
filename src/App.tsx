import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
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

export default function App() {
  const location = useLocation()
  return (
    <>
      <Navbar />
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
        <Route path="*" element={<Home />} />
      </Routes>
      </div>
    </>
  )
}


