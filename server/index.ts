import path from 'node:path'

import express from 'express'

import { criarApp } from './app.ts'

const app = criarApp()
const dist = path.resolve('dist')

app.use(express.static(dist))
app.use((_req, res) => {
  res.sendFile(path.join(dist, 'index.html'))
})

const porta = Number(process.env.PORT ?? 3000)

app.listen(porta, () => {
  console.log(`Servidor ouvindo em http://localhost:${porta}`)
})
