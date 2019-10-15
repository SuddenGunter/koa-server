'use strict'

const Koa = require('koa');
const gracefulShutdown = require('http-graceful-shutdown');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const json = require('koa-json')
const pino = require('koa-pino-logger')

app.use(pino())
app.silent = true
app.use(logger({
  transporter: (str, args) => {
      var m = Object.getOwnPropertyNames(pino)
  }
}))

app.use(json({ pretty: app.env == "development" }))
app.use(bodyParser());

// app.use((ctx) => {
//   ctx.log.info('something else')
// })

// logger

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// response

app.use((ctx) => {
  ctx.body = { foo: 'bar' }
})


server = app.listen(3000);


// this enables the graceful shutdown with advanced options
gracefulShutdown(server,
	{
		signals: 'SIGINT SIGTERM',
		timeout: 10000,
		development: false,
		finally: function() {
			console.log('Server shutted down')
		}
	}
);