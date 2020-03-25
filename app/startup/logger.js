const morgan = require('morgan')
const debug = require('debug')('app:http')

module.exports = (app) => {
    app.use(
        morgan('dev', {
            stream: { write: (msg) => debug(msg.replace('\n', ''))}
        })
    )
}