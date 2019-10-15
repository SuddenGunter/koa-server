require('dotenv').config()
const server = require('./server')
const logger = require('pino')()
const gracefulShutdown = require('http-graceful-shutdown')

const port = process.env.PORT || 3000
server.listen(port, () => logger.info(`API server started on :${port}`))

// this enables the graceful shutdown with advanced options
gracefulShutdown(server,
  {
    signals: 'SIGINT SIGTERM',
    timeout: 10000,
    development: false,
    finally: () => {
      console.log('Server shutted down')
    }
  }
)
