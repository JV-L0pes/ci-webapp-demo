export type ItemCarrinho = {
  id: string
  precoCentavos: number
  quantidade: number
}

export type ResumoCarrinho = {
  subtotalCentavos: number
  descontoPercentual: number
  totalCentavos: number
}

/** Faixas de desconto por valor do subtotal (em centavos). */
const FAIXAS_DE_DESCONTO = [
  { minimoCentavos: 50_000, percentual: 10 },
  { minimoCentavos: 20_000, percentual: 5 },
] as const

export function subtotalCentavos(itens: ItemCarrinho[]): number {
  return itens.reduce((acc, item) => acc + item.precoCentavos * item.quantidade, 0)
}

export function descontoPercentual(subtotal: number): number {
  const faixa = FAIXAS_DE_DESCONTO.find((f) => subtotal >= f.minimoCentavos)
  return faixa?.percentual ?? 0
}

export function resumirCarrinho(itens: ItemCarrinho[]): ResumoCarrinho {
  const subtotal = subtotalCentavos(itens)
  const desconto = descontoPercentual(subtotal)
  // Arredonda para baixo para nunca cobrar a mais do cliente.
  const total = Math.floor((subtotal * (100 - desconto)) / 100)

  return { subtotalCentavos: subtotal, descontoPercentual: desconto, totalCentavos: total }
}
