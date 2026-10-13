import type { ReactNode } from 'react'

type Props = {
  title: string
  description: string
  eyebrow?: string
  tools?: ReactNode
}

export default function GameHeader({ title, description, eyebrow = 'ATIVIDADE', tools }: Props) {
  return <header className="game-header">
    <div className="game-header-copy">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
    {tools && <div className="game-header-tools">{tools}</div>}
  </header>
}
