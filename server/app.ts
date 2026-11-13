import express from 'express'

import type { Produto } from '../src/api.ts'

export const catalogo: Produto[] = [
  { id: 'p1', nome: 'Clean Code', categoria: 'livros', precoCentavos: 9_900 },
  { id: 'p2', nome: 'The Pragmatic Programmer', categoria: 'livros', precoCentavos: 12_500 },
  { id: 'p3', nome: 'Teclado mecânico', categoria: 'eletronicos', precoCentavos: 34_900 },
  { id: 'p4', nome: 'Monitor 27"', categoria: 'eletronicos', precoCentavos: 189_900 },
  { id: 'p5', nome: 'Caneca térmica', categoria: 'casa', precoCentavos: 4_500 },
]

export function criarApp() {
  const app = express()

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', itens: catalogo.length })
  })

  app.get('/api/items', (_req, res) => {
    res.json({ items: catalogo })
  })

  return app
}
