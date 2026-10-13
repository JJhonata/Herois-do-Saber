import { useMemo } from 'react'
import { useGameState } from '../lib/gameSession'
import { shuffledCycleIndex, shuffle } from '../lib/questionFlow'
import { addStars, getRecommendedDifficulty, type Difficulty } from '../lib/progress'
import { playCorrect, playIncorrect } from '../lib/sfx'
import { recordAnswer } from '../lib/review'
import GameHeader from '../components/GameHeader'

const animals=[['🐟','Peixe','Água'],['🐒','Macaco','Floresta'],['🐪','Camelo','Deserto'],['🐧','Pinguim','Região gelada'],['🦁','Leão','Savana'],['🐸','Sapo','Áreas úmidas'],['🐬','Golfinho','Água'],['🦥','Bicho-preguiça','Floresta'],['🦎','Lagarto','Deserto'],['🐻‍❄️','Urso-polar','Região gelada'],['🦓','Zebra','Savana'],['🦆','Pato','Áreas úmidas'],['🦊','Raposa','Floresta'],['🐊','Jacaré','Áreas úmidas'],['🦦','Lontra','Água'],['🐨','Coala','Floresta'],['🐫','Dromedário','Deserto'],['🦩','Flamingo','Áreas úmidas'],['🐘','Elefante','Savana'],['🦌','Cervo','Floresta']]
const habitats=['Água','Floresta','Deserto','Região gelada','Savana','Áreas úmidas']
export default function HabitatGame() {
	const [level, setLevel] = useGameState<Difficulty>(() => getRecommendedDifficulty('habitat'), 'level')
	const [index, setIndex] = useGameState(0, 'index')
	const [message, setMessage] = useGameState('', 'message')
	const [resolved, setResolved] = useGameState(false, 'resolved')
	const animal = animals[shuffledCycleIndex(animals.length, index, `habitat:${level}`)]
	const optionCount = level === 'easy' ? 2 : level === 'medium' ? 4 : habitats.length
	const options = useMemo(() => shuffle([animal[2], ...shuffle(habitats.filter((habitat) => habitat !== animal[2])).slice(0, optionCount - 1)]), [index, level])

	function choose(habitat: string) {
		if (resolved) return
		const correct = habitat === animal[2]
		recordAnswer('habitat', `Onde vive o(a) ${animal[1]}?`, habitat, animal[2], correct, 'O habitat oferece ao animal condições para encontrar alimento, abrigo e sobreviver.')
		if (correct) {
			setResolved(true)
			addStars('habitat', 1)
			playCorrect()
			setMessage('Habitat correto! 🌿')
			setTimeout(() => { setIndex((value) => value + 1); setMessage(''); setResolved(false) }, 650)
		} else {
			playIncorrect()
			setMessage('Pense no clima e no lugar onde esse animal vive.')
		}
	}

	return <div className="container"><div className="game">
		<GameHeader title="Onde Eu Vivo? 🐾🌍" description="Relacione cada animal ao seu habitat." />
		<div className="row difficulty-picker"><label htmlFor="habitat-level">Nível:</label><select id="habitat-level" value={level} disabled={resolved} onChange={(event) => { setLevel(event.target.value as Difficulty); setIndex(0); setMessage(''); setResolved(false) }}><option value="easy">Começando · 2 opções</option><option value="medium">Praticando · 4 opções</option><option value="hard">Desafio · 6 opções</option></select></div>
		<div className="animal-card"><span>{animal[0]}</span><strong>{animal[1]}</strong></div>
		<div className="choice-grid">{options.map((option) => <button key={option} disabled={resolved} onClick={() => choose(option)}>{option}</button>)}</div>
		<p className="game-message" aria-live="polite">{message}</p>
	</div></div>
}
