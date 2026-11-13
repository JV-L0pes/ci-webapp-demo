// Le o relatorio json-summary do Vitest e publica uma tabela no resumo do job.
import { appendFileSync, readFileSync } from 'node:fs'

const resumo = JSON.parse(readFileSync('coverage/coverage-summary.json', 'utf8')).total
const linha = (rotulo, chave) => `| ${rotulo} | ${resumo[chave].pct}% |`
const arquivo = process.env.GITHUB_STEP_SUMMARY

const tabela = [
  '### Cobertura de testes',
  '',
  '| Metrica | Cobertura |',
  '| --- | --- |',
  linha('Linhas', 'lines'),
  linha('Statements', 'statements'),
  linha('Funcoes', 'functions'),
  linha('Branches', 'branches'),
  '',
].join('\n')

if (arquivo) {
  appendFileSync(arquivo, tabela)
} else {
  console.log(tabela)
}
