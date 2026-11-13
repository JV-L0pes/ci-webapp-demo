import { describe, expect, it } from 'vitest'

import { formatarBRL, rotuloCategoria } from '../../src/lib/format.ts'

// O Intl usa espaco nao separavel (U+00A0) entre moeda e valor; normalizamos
// para nao deixar o teste refem da versao do ICU.
const normalizar = (texto: string) => texto.replace(/\u00a0/g, ' ')

describe('formatarBRL', () => {
  it('formata centavos como moeda brasileira', () => {
    expect(normalizar(formatarBRL(1_990))).toBe('R$ 19,90')
    expect(normalizar(formatarBRL(0))).toBe('R$ 0,00')
    expect(normalizar(formatarBRL(123_456))).toBe('R$ 1.234,56')
  })
})

describe('rotuloCategoria', () => {
  it('capitaliza o primeiro caractere', () => {
    expect(rotuloCategoria('eletronicos')).toBe('Eletronicos')
    expect(rotuloCategoria('')).toBe('')
  })
})
