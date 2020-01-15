import express from 'express'
const search = express.Router()

// required models
import User from './../../models/user'

import { containsForbiddenChars } from './../../utils'

search.get('/name', async (req, res) => {
    const { q } = req.query
    if (!q || !q.replace(/(^ )|( $)/g, '').length) {
        return res.status(400).send({
            error: 'no `q` provided'
        })
    }
    if (containsForbiddenChars(q)) {
        return res.status(400).send({
            error: 'contains invalid characters in the query'
        })
    }

    const expression = `^(${q.replace(/ /g, '|')}|${q})`

    try {
        const users = await User.find({
            name: { $regex: new RegExp(expression, 'i') }
        })
        return res.send(users)
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})

search.get('/username', async (req, res) => {
    const { q } = req.query

    if (!q) {
        return res.status(400).send({
            error: 'no `q` provided'
        })
    }

    try {
        const user = await User.findOne({ username: q })
        if (!user) {
            return res.status(404).send({
                error: 'user not found'
            })
        }
        return res.send(user)
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})

export default search