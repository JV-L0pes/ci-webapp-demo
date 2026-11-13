export type Produto = {
  id: string
  nome: string
  categoria: string
  precoCentavos: number
}

const BASE_URL = import.meta.env.VITE_API_URL ?? ''

export async function carregarProdutos(signal?: AbortSignal): Promise<Produto[]> {
  const resposta = await fetch(`${BASE_URL}/api/items`, { signal })

  if (!resposta.ok) {
    throw new Error(`Falha ao carregar produtos (HTTP ${resposta.status})`)
  }

  const corpo = (await resposta.json()) as { items: Produto[] }
  return corpo.items
}
