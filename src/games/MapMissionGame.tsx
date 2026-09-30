import { useMemo, useState } from 'react'
import { useGameState } from '../lib/gameSession'
import { shuffledCycleIndex, shuffle } from '../lib/questionFlow'
import { addStars, getRecommendedDifficulty, type Difficulty } from '../lib/progress'
import { playCorrect, playIncorrect } from '../lib/sfx'
import { recordAnswer } from '../lib/review'

type Place = { name: string; emoji: string; x: number; y: number }
type Direction = 'Norte' | 'Sul' | 'Leste' | 'Oeste' | 'Nordeste' | 'Noroeste' | 'Sudeste' | 'Sudoeste'

const directions: Direction[] = ['Norte', 'Sul', 'Leste', 'Oeste', 'Nordeste', 'Noroeste', 'Sudeste', 'Sudoeste']
const places: Place[] = [
  { name: 'Praça', emoji: '🌳', x: 2, y: 0 },
  { name: 'Lago', emoji: '🛶', x: 4, y: 0 },
  { name: 'Padaria', emoji: '🥐', x: 0, y: 0 },
  { name: 'Biblioteca', emoji: '📚', x: 0, y: 2 },
  { name: 'Escola', emoji: '🏫', x: 2, y: 2 },
  { name: 'Posto de saúde', emoji: '🏥', x: 4, y: 2 },
  { name: 'Abrigo de animais', emoji: '🐾', x: 0, y: 4 },
  { name: 'Campo', emoji: '⚽', x: 2, y: 4 },
  { name: 'Museu', emoji: '🏛️', x: 4, y: 4 },
]

function getDirection(place: Place): Direction {
  const horizontal = place.x - 2
  const vertical = 2 - place.y
  if (!horizontal) return vertical > 0 ? 'Norte' : 'Sul'
  if (!vertical) return horizontal > 0 ? 'Leste' : 'Oeste'
  if (vertical > 0) return horizontal > 0 ? 'Nordeste' : 'Noroeste'
  return horizontal > 0 ? 'Sudeste' : 'Sudoeste'
}

export default function MapMissionGame() {
  const [level, setLevel] = useGameState<Difficulty>(() => getRecommendedDifficulty('map'))
  const [round, setRound] = useGameState(0)
  const [picked, setPicked] = useGameState<Direction | null>(null)
  const [message, setMessage] = useGameState('')
  const [wrongAnswer, setWrongAnswer] = useState(false)
  const availableDirections = level === 'easy' ? directions.slice(0, 2) : level === 'medium' ? directions.slice(0, 4) : directions
  const targets = places.filter((place) => place.name !== 'Escola' && availableDirections.includes(getDirection(place)))
  const target = targets[shuffledCycleIndex(targets.length, round, `map:${level}`)]
  const expected = getDirection(target)
  const options = useMemo(() => shuffle(availableDirections), [round, level])

  function choose(direction: Direction) {
    if (picked) return
    const correct = direction === expected
    recordAnswer('map', `Partindo da escola, em que direção fica ${target.name}?`, direction, expected, correct, `${target.name} está ${expected.toLowerCase()} da escola. No mapa, norte fica para cima e leste fica à direita.`)
    if (correct) {
      setPicked(direction)
      setWrongAnswer(false)
      setMessage(`Isso! ${target.name} fica a ${expected.toLowerCase()} da escola. 🧭`)
      addStars('map', 1)
      playCorrect()
    } else {
      setWrongAnswer(true)
      playIncorrect()
      setMessage('Use a rosa dos ventos: norte fica para cima e leste fica à direita.')
    }
  }

  function nextMission() {
    setRound((value) => value + 1)
    setPicked(null)
    setWrongAnswer(false)
    setMessage('')
  }

  return <div className="container"><div className="game map-game">
    <h2>Missão no Mapa 🧭</h2>
    <p>Parta da escola azul e encontre o destino amarelo.</p>
    <div className="row difficulty-picker"><label htmlFor="map-level">Nível:</label><select id="map-level" value={level} onChange={(event) => { setLevel(event.target.value as Difficulty); setRound(0); setPicked(null); setWrongAnswer(false); setMessage('') }}><option value="easy">Começando · norte e sul</option><option value="medium">Praticando · pontos cardeais</option><option value="hard">Desafio · também use as diagonais</option></select></div>
    <div className="map-mission-prompt"><span aria-hidden="true">🗺️</span><div><strong>Encontre: {target.name} {target.emoji}</strong><p>Olhando da escola azul, em que direção fica o destino?</p></div></div>
    <div className="map-layout">
      <div className="town-map" role="img" aria-label="Mapa da cidade em grade. A escola fica no centro; norte está acima e leste à direita.">
        {Array.from({ length: 25 }, (_, index) => {
          const x = index % 5
          const y = Math.floor(index / 5)
          const place = places.find((item) => item.x === x && item.y === y)
          return <div className={`town-cell${place?.name === 'Escola' ? ' school-cell' : ''}${place?.name === target.name ? ' target-cell' : ''}`} key={index}>
            {place && <><span aria-hidden="true">{place.emoji}</span><small>{place.name}</small></>}
          </div>
        })}
      </div>
      <div className="compass" role="img" aria-label="Rosa dos ventos: norte para cima, sul para baixo, leste à direita e oeste à esquerda"><span className="compass-n">N</span><span className="compass-e">L</span><span className="compass-s">S</span><span className="compass-w">O</span><span className="compass-center">✦</span></div>
    </div>
    <p className="map-key">N = Norte · S = Sul · L = Leste · O = Oeste{level === 'hard' && <><br />NE, NO, SE e SO indicam as diagonais.</>}</p>
    <div className={`choice-grid map-directions${level === 'hard' ? ' hard-map' : ''}`} aria-label="Escolha a direção">
      {options.map((option) => <button type="button" key={option} disabled={Boolean(picked)} className={picked === option ? 'accent' : ''} onClick={() => choose(option)}>{option}</button>)}
    </div>
    <p className="game-message" aria-live="polite">{picked ? message : wrongAnswer ? message : ''}</p>
    {picked && <button type="button" className="accent map-next-button" onClick={nextMission}>Próximo destino →</button>}
  </div></div>
}
