'use strict'

const Koa = require('koa');
const gracefulShutdown = require('http-graceful-shutdown');
const bodyParser = require('koa-bodyparser');
const json = require('koa-json')
const pino = require('koa-pino-logger')
const helmet = require("koa-helmet");
const respond = require('koa-respond');
const uuid = require('uuid')
const app = new Koa();

app.use(pino())
app.silent = true
app.use(helmet());
app.use(respond());
app.use(json({ pretty: app.env == "development" }))
app.use(bodyParser());

app.use(async (ctx, next) => {
  ctx.set('X-Request-ID', uuid.v4())
  await next();
});

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});


app.use((ctx) => {
  ctx.body = { foo: 'bar' }
})


var server = app.listen(3002);

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