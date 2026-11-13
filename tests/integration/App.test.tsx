// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import App from '../../src/App.tsx'
import type { Produto } from '../../src/api.ts'

const produtos: Produto[] = [
  { id: 'p1', nome: 'Clean Code', categoria: 'livros', precoCentavos: 9_900 },
  { id: 'p3', nome: 'Teclado mecanico', categoria: 'eletronicos', precoCentavos: 34_900 },
  { id: 'p4', nome: 'Monitor 27', categoria: 'eletronicos', precoCentavos: 189_900 },
]

function mockRespostaOk(itens: Produto[]) {
  vi.stubGlobal(
    'fetch',
    vi.fn(() => Promise.resolve(new Response(JSON.stringify({ items: itens }), { status: 200 }))),
  )
}

function textoDoTotal() {
  return screen.getByTestId('total').textContent?.replace(/\u00a0/g, ' ')
}

beforeEach(() => {
  mockRespostaOk(produtos)
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('App (integracao UI + camada de dados)', () => {
  it('carrega o catalogo da API e exibe os produtos', async () => {
    render(<App />)

    expect(screen.getByRole('status').textContent).toContain('Carregando produtos')

    expect(await screen.findByText('Clean Code')).toBeDefined()
    expect(screen.getByText('Monitor 27')).toBeDefined()
    expect(screen.getByText('R$ 99,00')).toBeDefined()
  })

  it('filtra por categoria', async () => {
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Clean Code')

    await user.click(screen.getByRole('button', { name: 'Eletronicos' }))

    expect(screen.getByRole('button', { name: 'Eletronicos' }).getAttribute('aria-pressed')).toBe(
      'true',
    )
    expect(screen.queryByText('Clean Code')).toBeNull()
    expect(screen.getByText('Monitor 27')).toBeDefined()
  })

  it('soma itens no carrinho e aplica a faixa de desconto', async () => {
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Monitor 27')

    expect(textoDoTotal()).toBe('R$ 0,00')

    await user.click(screen.getByRole('button', { name: 'Adicionar Monitor 27' }))
    expect(screen.getByRole('heading', { name: 'Carrinho (1)' })).toBeDefined()
    expect(textoDoTotal()).toBe('R$ 1.709,10')

    await user.click(screen.getByRole('button', { name: 'Adicionar Teclado mecanico' }))
    expect(screen.getByRole('heading', { name: 'Carrinho (2)' })).toBeDefined()
    expect(textoDoTotal()).toBe('R$ 2.023,20')
  })

  it('limpa o carrinho e desabilita o botao quando vazio', async () => {
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Clean Code')

    const limpar = screen.getByRole('button', { name: 'Limpar carrinho' })
    expect((limpar as HTMLButtonElement).disabled).toBe(true)

    await user.click(screen.getByRole('button', { name: 'Adicionar Clean Code' }))
    expect((limpar as HTMLButtonElement).disabled).toBe(false)

    await user.click(limpar)
    expect(textoDoTotal()).toBe('R$ 0,00')
    expect(screen.getByRole('heading', { name: 'Carrinho (0)' })).toBeDefined()
  })

  it('mostra alerta quando a API falha', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new Error('rede indisponivel'))),
    )

    render(<App />)

    expect((await screen.findByRole('alert')).textContent).toContain(
      'Não foi possível carregar o catálogo',
    )
  })
})
