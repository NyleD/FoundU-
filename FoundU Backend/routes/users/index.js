import express from 'express'
const users = express.Router()

// required models
import User from './../../models/user'

// required middleware
import authenticate from './../../middleware/authenticate'

import { containsForbiddenChars } from './../../utils'

// my account route
users.get('/me', authenticate, async (req, res) => { 
    return res.send(req.user)
})

// registration route
users.post('/signup', async (req, res) => {
    const { username, email, password, name } = req.body
    
    if (!username || !email || !password) {
        return res.status(400).send({ 
            error: 'not all credentials are given. Expects `username`, `email`, and `password`'
        })
    }
    if (containsForbiddenChars(username)) {
        return res.status(400).send({
            error: '`username` contains invalid characters'
        })
    }
    if (containsForbiddenChars(name)) {
        return res.status(400).send({
            error: '`name` contains invalid characters'
        })
    }

    try {
        const exists = await User.find({
            $or: [{ username }, { email }] 
        })
        if (exists && exists.length) {
            return res.status(400).send({
                error: '`username` or `email` already taken'
            })
        }
        const user = new User({ 
            created_at: Date.now(),
            username, 
            email, 
            password, 
            name,
        })

        await user.save()
        const token = await user.generateAuthToken()

        return res.header('auth', token).send(user)
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})

// login route
users.post('/login', async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(400).send({ 
            error: 'not all credentials are given'
        })
    }
    
    try {
        const user = await User.findByCredentials(username, password)
        const token = await user.generateAuthToken()

        return res.header('auth', token).send(user)
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})

// logout route
users.delete('/logout', authenticate, async (req, res) => {
    try {
        await req.user.removeToken(req.token)
        return res.send({ message: 'successfully logged out'})
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})

// query `numRecords` of users on page `pageNum`
users.get('/', async (req, res) => {
    const { numRecords = 50, pageNum = 0 } = req.query

    if (pageNum < 0) {
        return res.status(400).send({ 
            error: 'invalid `pageNum`' 
        })
    }
    if (numRecords < 0) {
        return res.status(400).send({ 
            error: 'invalid `numRecords`'
        })
    }

    try {
        const users = await User.find()
            .skip(parseInt(pageNum, 10))
            .limit(parseInt(numRecords, 10))
        return res.send(users)
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})

// build on to the base users api
import friends from './friends'
import search from './search'
users.use('/friends', friends)
users.use('/search', search)

export default users