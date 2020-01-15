// config the environment
const config = require('./config.json')
const envConfig = config
Object.keys(envConfig).forEach(key => process.env[key] = envConfig[key])