# ci-webapp-demo

Aplicacao web minima (React + Vite + TypeScript) usada para demonstrar, de ponta a ponta, um
pipeline de Integracao Continua com GitHub Actions: formatacao, analise estatica, tipagem, build,
testes unitarios/integracao e construcao da imagem Docker.

## O pipeline

O workflow fica em [`.github/workflows/ci.yml`](.github/workflows/ci.yml) e roda em todo Pull
Request para `main` (e em push na `main`). As etapas estao distribuidas em quatro jobs:

| #   | Job                              | O que valida                              | Depende de |
| --- | -------------------------------- | ----------------------------------------- | ---------- |
| 1   | Analise estatica e formatacao    | Prettier, ESLint e `tsc`                  | -          |
| 2   | Build                            | bundle de producao (`dist/`)              | 1          |
| 3   | Testes unitarios e de integracao | Vitest, com cobertura minima de 80%       | 1          |
| 4   | Imagem Docker                    | build da imagem + smoke test do container | 2 e 3      |

Jobs 2 e 3 rodam em paralelo porque ambos so dependem do job 1; o job 4 espera os dois.

## Rodando localmente

```bash
npm ci
npm run format:check   # formatacao
npm run lint           # analise estatica
npm run typecheck      # tipos
npm run build          # bundle em dist/
npm run test:unit      # testes unitarios
npm run test:integration
npm run test:coverage  # cobertura + threshold de 80%
npm start              # serve dist/ + /api em http://localhost:3000
```

## Imagem Docker

```bash
docker build -t ci-webapp-demo:local .
docker run --rm -p 3000:3000 ci-webapp-demo:local
curl http://localhost:3000/api/health
```

A imagem e multi-stage: a etapa de build instala todas as dependencias e gera o bundle; a etapa
final leva apenas dependencias de producao, `dist/` e o servidor Express, rodando com o usuario
`node` (nao-root).
