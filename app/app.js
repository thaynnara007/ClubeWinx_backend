const express = require('express')
const httpDebug = require('debug')('app:http')

const app = express()

require('./startup/db')
require('./startup/cors')(app)
require('./startup/logger')(app)
require('./startup/parser')(app)

const port = process.env.PORT || 3000

app.listen(port, httpDebug('Listen on port %o', port))
