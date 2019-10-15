'use strict'

const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const json = require('koa-json')
const pino = require('koa-pino-logger')
const helmet = require('koa-helmet')
const respond = require('koa-respond')
const uuid = require('uuid')
const router = require('./routes')
const app = new Koa()

app.use(pino())
app.silent = true
app.use(helmet())
app.use(respond())
app.use(json({ pretty: app.env === 'development' }))
app.use(bodyParser())

app.use(async (ctx, next) => {
  var requestId = uuid.v4()
  ctx.set('X-Request-ID', requestId)
  ctx.log = ctx.log.child({ requestId: requestId })
  await next()
})

app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms}ms`)
})

app
  .use(router.routes)
  .use(router.allowedMethods)

module.exports = app
