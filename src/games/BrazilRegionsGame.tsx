import { useMemo } from 'react'
import { useGameState } from '../lib/gameSession'
import { shuffledCycleIndex, shuffle } from '../lib/questionFlow'
import { addStars, getRecommendedDifficulty, type Difficulty } from '../lib/progress'
import { playCorrect, playIncorrect } from '../lib/sfx'
import { recordAnswer } from '../lib/review'
import GameHeader from '../components/GameHeader'

const qs=[['Ceará','Nordeste'],['Amazonas','Norte'],['São Paulo','Sudeste'],['Paraná','Sul'],['Goiás','Centro-Oeste'],['Bahia','Nordeste'],['Pará','Norte'],['Minas Gerais','Sudeste'],['Acre','Norte'],['Rondônia','Norte'],['Maranhão','Nordeste'],['Pernambuco','Nordeste'],['Mato Grosso','Centro-Oeste'],['Mato Grosso do Sul','Centro-Oeste'],['Espírito Santo','Sudeste'],['Rio de Janeiro','Sudeste'],['Santa Catarina','Sul'],['Rio Grande do Sul','Sul'],['Tocantins','Norte'],['Alagoas','Nordeste'],['Amapá','Norte'],['Roraima','Norte'],['Sergipe','Nordeste'],['Paraíba','Nordeste'],['Piauí','Nordeste'],['Rio Grande do Norte','Nordeste'],['Distrito Federal','Centro-Oeste']]
const REGIONS=['Norte','Nordeste','Centro-Oeste','Sudeste','Sul']
export default function BrazilRegionsGame() {
	const [level, setLevel] = useGameState<Difficulty>(() => getRecommendedDifficulty('regions'), 'level')
	const [index, setIndex] = useGameState(0, 'index')
	const [score, setScore] = useGameState(0, 'score')
	const [message, setMessage] = useGameState('', 'message')
	const [resolved, setResolved] = useGameState(false, 'resolved')
	const deck = level === 'easy' ? qs.slice(0, 6) : level === 'medium' ? qs.slice(5, 13) : qs.slice(12)
	const question = deck[shuffledCycleIndex(deck.length, index, `regions:${level}`)]
	const options = useMemo(() => shuffle(REGIONS), [index])

	function choose(region: string) {
		if (resolved) return
		const correct = region === question[1]
		recordAnswer('regions', `Em qual região fica ${question[0]}?`, region, question[1], correct, 'Os estados e o Distrito Federal estão distribuídos pelas cinco regiões do Brasil.')
		if (correct) {
			setResolved(true)
			setScore((value) => value + 1)
			addStars('regions', 1)
			playCorrect()
			setMessage('Muito bem! 🇧🇷')
			setTimeout(() => { setIndex((value) => value + 1); setMessage(''); setResolved(false) }, 600)
		} else {
			playIncorrect()
			setMessage('Tente lembrar em qual parte do mapa essa unidade federativa fica.')
		}
	}

	return <div className="container"><div className="game">
		<GameHeader title="Regiões do Brasil 🇧🇷🗺️" description="Em qual região brasileira fica a unidade federativa abaixo?" />
		<div className="row difficulty-picker"><label htmlFor="regions-level">Nível:</label><select id="regions-level" value={level} disabled={resolved} onChange={(event) => { setLevel(event.target.value as Difficulty); setIndex(0); setScore(0); setResolved(false); setMessage('') }}><option value="easy">Começando · estados conhecidos</option><option value="medium">Praticando · explore o mapa</option><option value="hard">Desafio · todos os estados e o DF</option></select></div>
		<div className="state-card">📍 {question[0]}</div>
		<div className="choice-grid">{options.map((option) => <button key={option} disabled={resolved} onClick={() => choose(option)}>{option}</button>)}</div>
		<p className="game-message" aria-live="polite">Acertos: {score} · {message}</p>
	</div></div>
}
