// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home'

describe('Home', () => {
  afterEach(() => {
    cleanup()
  })

  beforeEach(() => {
    localStorage.clear()
  })

  function renderHome() {
    return render(<MemoryRouter><Home /></MemoryRouter>)
  }

  it('filtra jogos pela busca e permite limpar o termo', () => {
    const { container } = renderHome()
    const search = screen.getByLabelText('Encontrar uma aventura')

    fireEvent.change(search, { target: { value: 'matemática' } })
    expect(container.querySelectorAll('.card').length).toBe(6)
    expect(Array.from(container.querySelectorAll('.card h3')).map((heading) => heading.textContent)).toContain('Matemática')

    fireEvent.click(screen.getByRole('button', { name: 'Limpar busca' }))
    expect(container.querySelectorAll('.card').length).toBe(26)
  })

  it('exibe uma mensagem quando nenhum jogo corresponde', () => {
    const { container } = renderHome()
    fireEvent.change(screen.getByLabelText('Encontrar uma aventura'), { target: { value: 'aventura inexistente' } })

    expect(screen.getByRole('status').textContent).toContain('Nenhuma aventura encontrada')
    expect(container.querySelectorAll('.card')).toHaveLength(0)

    fireEvent.click(screen.getByRole('button', { name: 'Mostrar todos' }))
    expect(container.querySelectorAll('.card')).toHaveLength(26)
  })
})
