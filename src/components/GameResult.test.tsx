// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import GameResult from './GameResult'

describe('GameResult', () => {
  it('mostra o desempenho e oferece reinício e revisão', () => {
    let restarted = false
    render(<MemoryRouter><GameResult score={8} total={10} reviewCount={3} onRestart={() => { restarted = true }} /></MemoryRouter>)

    expect(screen.getByRole('heading', { name: 'Você acertou 8 de 10' })).toBeTruthy()
    expect(screen.getByText('80% de aproveitamento')).toBeTruthy()
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Jogar novamente' }))
    expect(screen.getByRole('link', { name: 'Revisar erros (3)' }).getAttribute('href')).toBe('/#game-support')

    fireEvent.click(screen.getByRole('button', { name: 'Jogar novamente' }))
    expect(restarted).toBe(true)
  })
})
