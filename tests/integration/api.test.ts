import request from 'supertest'
import { describe, expect, it } from 'vitest'

import { catalogo, criarApp } from '../../server/app.ts'

const app = criarApp()

describe('API de catalogo (integracao HTTP)', () => {
  it('responde o health check com status ok', async () => {
    const resposta = await request(app).get('/api/health')

    expect(resposta.status).toBe(200)
    expect(resposta.body).toEqual({ status: 'ok', itens: catalogo.length })
  })

  it('devolve o catalogo com o contrato consumido pela SPA', async () => {
    const resposta = await request(app).get('/api/items').expect('content-type', /json/)

    expect(resposta.status).toBe(200)
    expect(resposta.body.items).toHaveLength(catalogo.length)

    for (const produto of resposta.body.items as typeof catalogo) {
      expect(typeof produto.id).toBe('string')
      expect(typeof produto.nome).toBe('string')
      expect(Number.isInteger(produto.precoCentavos)).toBe(true)
      expect(produto.precoCentavos).toBeGreaterThan(0)
    }
  })

  it('nao repete ids no catalogo', async () => {
    const resposta = await request(app).get('/api/items')
    const ids = (resposta.body.items as typeof catalogo).map((p) => p.id)

    expect(new Set(ids).size).toBe(ids.length)
  })

  it('responde 404 para rota inexistente', async () => {
    await request(app).get('/api/inexistente').expect(404)
  })
})
