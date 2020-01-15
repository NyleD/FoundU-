import express from 'express'
import bodyParser from 'body-parser'

// config the express server
const app = express()

const nonProcessPort = 
    (process.argv[2] === '--port' && process.argv[3]) ? 
    process.argv[3] : 3000
const port = process.env.PORT || nonProcessPort

if (!process.env.NODE_ENV) {
    const config = require('./config.json')
    Object.keys(config).forEach(
        key => process.env[key] = config[key]
    )
}

app.use(bodyParser.json())

const api = require('../routes/api').default
app.use('/api', api)
app.listen(port, () => 
    console.log(`app listening on port ${port}`)
)

export default app