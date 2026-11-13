const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function formatarBRL(centavos: number): string {
  return brl.format(centavos / 100)
}

export function rotuloCategoria(categoria: string): string {
  return categoria.charAt(0).toUpperCase() + categoria.slice(1)
}
