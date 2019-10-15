const Router = require('koa-router')

const router = new Router()

router.get('/ping', (ctx, next) => {
  ctx.ok({ response: 'pong' })
})

module.exports = {
  routes: router.routes(),
  allowedMethods: router.allowedMethods()
}
