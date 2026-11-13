import { describe, expect, it } from 'vitest'

import { descontoPercentual, resumirCarrinho, subtotalCentavos } from '../../src/lib/pricing.ts'

const teclado = { id: 'p3', precoCentavos: 34_900, quantidade: 1 }
const monitor = { id: 'p4', precoCentavos: 189_900, quantidade: 1 }

describe('subtotalCentavos', () => {
  it('retorna zero para carrinho vazio', () => {
    expect(subtotalCentavos([])).toBe(0)
  })

  it('multiplica preco pela quantidade e soma os itens', () => {
    expect(subtotalCentavos([{ ...teclado, quantidade: 2 }, monitor])).toBe(69_800 + 189_900)
  })
})

describe('descontoPercentual', () => {
  it('nao aplica desconto abaixo da primeira faixa', () => {
    expect(descontoPercentual(19_999)).toBe(0)
  })

  it('aplica 5% a partir de R$ 200,00', () => {
    expect(descontoPercentual(20_000)).toBe(5)
    expect(descontoPercentual(49_999)).toBe(5)
  })

  it('aplica 10% a partir de R$ 500,00', () => {
    expect(descontoPercentual(50_000)).toBe(10)
  })
})

describe('resumirCarrinho', () => {
  it('mantem o subtotal sem desconto quando nao atinge a faixa minima', () => {
    expect(resumirCarrinho([{ id: 'p1', precoCentavos: 9_900, quantidade: 2 }])).toEqual({
      subtotalCentavos: 19_800,
      descontoPercentual: 0,
      totalCentavos: 19_800,
    })
  })

  it('calcula o total com desconto de 10%', () => {
    expect(resumirCarrinho([monitor])).toEqual({
      subtotalCentavos: 189_900,
      descontoPercentual: 10,
      totalCentavos: 170_910,
    })
  })

  it('arredonda o total para baixo (nunca cobra a mais)', () => {
    expect(resumirCarrinho([{ id: 'x', precoCentavos: 20_001, quantidade: 3 }])).toEqual({
      subtotalCentavos: 60_003,
      descontoPercentual: 10,
      totalCentavos: 54_002,
    })
  })
})
