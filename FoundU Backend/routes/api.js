import express from 'express'
import users from './users'

const api = express.Router()
api.use('/users', users)

export default api