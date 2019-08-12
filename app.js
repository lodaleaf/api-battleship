import { apiRoot } from './config'

import express from './services/express'
import routes from './routes'

const app = express(apiRoot, routes)

export default app
