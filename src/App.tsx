import { useEffect, useMemo, useState } from 'react'

import { carregarProdutos, type Produto } from './api.ts'
import { formatarBRL, rotuloCategoria } from './lib/format.ts'
import { resumirCarrinho, type ItemCarrinho } from './lib/pricing.ts'

type Status = 'carregando' | 'pronto' | 'erro'

export default function App() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [status, setStatus] = useState<Status>('carregando')
  const [categoria, setCategoria] = useState('todas')
  const [carrinho, setCarrinho] = useState<Record<string, number>>({})

  useEffect(() => {
    const controller = new AbortController()

    carregarProdutos(controller.signal)
      .then((itens) => {
        setProdutos(itens)
        setStatus('pronto')
      })
      .catch((erro: unknown) => {
        if (erro instanceof Error && erro.name === 'AbortError') return
        setStatus('erro')
      })

    return () => controller.abort()
  }, [])

  const categorias = useMemo(
    () => ['todas', ...new Set(produtos.map((p) => p.categoria))],
    [produtos],
  )

  const visiveis = useMemo(
    () => (categoria === 'todas' ? produtos : produtos.filter((p) => p.categoria === categoria)),
    [produtos, categoria],
  )

  const itens: ItemCarrinho[] = useMemo(
    () =>
      Object.entries(carrinho)
        .map(([id, quantidade]) => {
          const produto = produtos.find((p) => p.id === id)
          return produto ? { id, precoCentavos: produto.precoCentavos, quantidade } : null
        })
        .filter((item): item is ItemCarrinho => item !== null),
    [carrinho, produtos],
  )

  const resumo = resumirCarrinho(itens)
  const totalDeItens = itens.reduce((acc, item) => acc + item.quantidade, 0)

  function adicionar(id: string) {
    setCarrinho((atual) => ({ ...atual, [id]: (atual[id] ?? 0) + 1 }))
  }

  return (
    <main>
      <header>
        <h1>Catálogo</h1>
        <p>Demonstração de aplicação web usada no pipeline de CI.</p>
      </header>

      <nav aria-label="Filtrar por categoria">
        {categorias.map((c) => (
          <button key={c} aria-pressed={c === categoria} onClick={() => setCategoria(c)}>
            {c === 'todas' ? 'Todas' : rotuloCategoria(c)}
          </button>
        ))}
      </nav>

      {status === 'carregando' && <p role="status">Carregando produtos…</p>}
      {status === 'erro' && <p role="alert">Não foi possível carregar o catálogo.</p>}

      {status === 'pronto' && (
        <ul className="produtos">
          {visiveis.map((produto) => (
            <li key={produto.id} className="produto">
              <div>
                <strong>{produto.nome}</strong>
                <span className="categoria">{rotuloCategoria(produto.categoria)}</span>
              </div>
              <span className="preco">{formatarBRL(produto.precoCentavos)}</span>
              <button onClick={() => adicionar(produto.id)}>Adicionar {produto.nome}</button>
            </li>
          ))}
        </ul>
      )}

      <section aria-label="Carrinho" className="carrinho">
        <h2>Carrinho ({totalDeItens})</h2>
        <dl>
          <dt>Subtotal</dt>
          <dd>{formatarBRL(resumo.subtotalCentavos)}</dd>
          <dt>Desconto</dt>
          <dd>{resumo.descontoPercentual}%</dd>
          <dt>Total</dt>
          <dd data-testid="total">{formatarBRL(resumo.totalCentavos)}</dd>
        </dl>
        <button disabled={totalDeItens === 0} onClick={() => setCarrinho({})}>
          Limpar carrinho
        </button>
      </section>
    </main>
  )
}
