import http from 'http'
import { env, port, ip, mongo } from './config'
import app from './app'
import mongoose from './services/mongoose'

const server = http.createServer(app)
mongoose.connect(mongo.uri)
mongoose.Promise = Promise

setImmediate(() => {
  server.listen(port, ip, () => {
    console.log('Express server listening on http://%s:%d, in %s mode', ip, port, env)
  })
})
