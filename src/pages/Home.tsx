import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { gameAreas, gameCatalog } from '../lib/gameCatalog'
import { getLastPlayedGame, getLearningProgress, getStars, getSuggestedGame } from '../lib/progress'
import { hasLearningProfileResponse, setPreferredDifficulty, skipLearningProfile } from '../lib/learnerProfile'
import type { Difficulty } from '../lib/progress'
import { hasGameSession } from '../lib/gameSession'

const areaIcons: Record<string, string> = {
  Todos: '🌟', Português: '📖', Matemática: '🔢', Ciências: '🔬', Geografia: '🗺️',
  Raciocínio: '🧠', Tecnologia: '💻', Criatividade: '🎨',
}

export default function Home() {
  const [, setTick] = useState(0)
  const [area, setArea] = useState('Todos')
  const [profileAnswered, setProfileAnswered] = useState(hasLearningProfileResponse)
  useEffect(() => {
    const update = () => setTick((tick) => tick + 1)
    window.addEventListener('progress:update', update)
    return () => window.removeEventListener('progress:update', update)
  }, [])

  const shown = area === 'Todos' ? gameCatalog : gameCatalog.filter((game) => game.area === area)
  const total = gameCatalog.reduce((sum, game) => sum + getStars(game.id), 0)
  const areas = ['Todos', ...gameAreas]
  const lastGameId = getLastPlayedGame()
  const lastGame = gameCatalog.find(({ id }) => id === lastGameId)
  const suggestedGame = getSuggestedGame(lastGameId || undefined)
  const learning = getLearningProgress()

  return <div className="container">
    {!profileAnswered && <section className="profile-setup" aria-labelledby="profile-title">
      <div><span className="eyebrow">VAMOS COMEÇAR</span><h2 id="profile-title">Qual ritmo combina com você?</h2><p>Isso ajusta a sugestão inicial dos jogos. Você pode trocar o nível dentro de cada atividade.</p></div>
      <div className="profile-options" role="group" aria-label="Escolha seu ritmo de aprendizagem">
        {([{ value: 'easy', label: 'Estou começando', detail: 'Quero praticar o básico' }, { value: 'medium', label: 'Já estou praticando', detail: 'Pode aumentar um pouco' }, { value: 'hard', label: 'Quero um desafio', detail: 'Pode trazer questões difíceis' }] as const).map((option) => <button key={option.value} type="button" className="profile-option" onClick={() => { setPreferredDifficulty(option.value as Difficulty); setProfileAnswered(true) }}><strong>{option.label}</strong><span>{option.detail}</span></button>)}
      </div>
      <button type="button" className="profile-skip" onClick={() => { skipLearningProfile(); setProfileAnswered(true) }}>Pular por enquanto</button>
    </section>}
    <section className="hero" aria-labelledby="home-title">
      <div>
        <h1 id="home-title">Heróis do Saber</h1>
        <p>Aprenda brincando! Escolha uma matéria, complete desafios e ganhe estrelas ✨</p>
        <div className="hero-stars">⭐ {total} estrelas conquistadas</div>
      </div>
      <img src="/logo.webp" alt="" className="hero-logo" />
    </section>

    <section className="journey-cards" aria-label="Sua jornada de aprendizagem">
      {lastGame && <article className="journey-card resume-card">
        <span aria-hidden="true">⏯️</span>
        <div><strong>Jogo recente</strong><p>Abra {lastGame.title} novamente.</p></div>
        <Link to={lastGame.path} className="journey-link">{hasGameSession(lastGame.id) ? 'Continuar jogo' : 'Abrir jogo'}</Link>
      </article>}
      <article className="journey-card suggestion-card">
        <span aria-hidden="true">✨</span>
        <div><strong>{lastGame ? 'Próximo desafio sugerido' : 'Sua próxima aventura'}</strong><p>Experimente {suggestedGame.title} e avance na trilha.</p></div>
        <Link to={suggestedGame.path} className="journey-link">Explorar</Link>
      </article>
    </section>

    <section className="missions-panel" aria-labelledby="missions-title">
      <div className="missions-heading">
        <div><span className="eyebrow">SUAS CONQUISTAS</span><h2 id="missions-title">Missões e medalhas</h2></div>
        <span className="mission-total">⭐ {learning.totalStars} estrelas</span>
      </div>
      <p className="missions-intro">Cada desafio completo ajuda você a avançar. As medalhas aparecem conforme explora e aprende.</p>
      <div className="mission-grid">
        {learning.milestones.map((mission) => <article className={`mission-card${mission.complete ? ' complete' : ''}`} key={mission.id}>
          <div className="mission-title"><span aria-hidden="true">{mission.icon}</span><strong>{mission.title}</strong><span className="mission-state">{mission.complete ? 'Concluída' : `${mission.current}/${mission.target}`}</span></div>
          <div className="mission-track" role="progressbar" aria-label={mission.title} aria-valuemin={0} aria-valuemax={mission.target} aria-valuenow={mission.current}><span style={{ width: `${(mission.current / mission.target) * 100}%` }} /></div>
        </article>)}
      </div>
      <div className="achievement-strip" aria-label="Medalhas conquistadas">
        {learning.milestones.filter(({ complete }) => complete).map((achievement) => <span className="achievement-badge" key={achievement.id} title={achievement.title}>{achievement.icon} {achievement.title}</span>)}
        {!learning.milestones.some(({ complete }) => complete) && <span className="achievement-empty">Sua primeira medalha está a uma estrela de distância. ✨</span>}
      </div>
      <div className="learning-dashboard" aria-label="Progresso por matéria">
        <h3>Seu progresso por matéria</h3>
        <div className="subject-progress-grid">{learning.bySubject.map((subject) => <article className="subject-progress-card" key={subject.area}>
          <div><strong>{areaIcons[subject.area] || '📘'} {subject.area}</strong><span>{subject.stars} ⭐</span></div>
          <p>{subject.played} de {subject.games} jogos explorados</p>
          <div className="mission-track" role="progressbar" aria-label={`${subject.area}: jogos explorados`} aria-valuemin={0} aria-valuemax={subject.games} aria-valuenow={subject.played}><span style={{ width: `${(subject.played / subject.games) * 100}%` }} /></div>
        </article>)}</div>
      </div>
    </section>

    <div className="subject-tabs" role="group" aria-label="Filtrar jogos por matéria">
      {areas.map((name) => <button key={name} type="button" className={area === name ? 'subject-tab active' : 'subject-tab'} aria-pressed={area === name} onClick={() => setArea(name)}>
        {areaIcons[name]} {name}
      </button>)}
    </div>

    <section aria-labelledby="games-title">
      <div className="section-heading"><div><span className="eyebrow">ÁREA DE APRENDIZAGEM</span><h2 id="games-title">{area === 'Todos' ? 'Todos os jogos' : area}</h2></div><span>{shown.length} {shown.length === 1 ? 'jogo' : 'jogos'}</span></div>
      <div className="grid">{shown.map((game) => <article className={`card ${game.cls}`} key={game.id}>
        <div className="card-top"><div className="game-emoji" aria-hidden="true">{game.emoji}</div><div className="badge">{game.tag}</div></div>
        <span className="subject-label">{game.area}</span>
        <h3>{game.title}</h3>
        <p>{game.desc}</p>
        <div className="star-line">⭐ {getStars(game.id)} estrelas</div>
        <Link to={game.path} className="accent play-button">Jogar agora</Link>
      </article>)}</div>
    </section>
  </div>
}
