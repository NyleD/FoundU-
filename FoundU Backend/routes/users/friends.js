import express from 'express'
const friends = express.Router()

// required models
import User from './../../models/user'
import authenticate from './../../middleware/authenticate'

friends.post('/request', authenticate, async (req, res) => {
    const { username } = req.body

    if (!username) {
        return res.status(400).send({
            error: '`username` is not provided'
        })
    }

    try {
        const friend = await User.findOne({ username })
        if (!friend) {
            return res.status(404).send({ 
                error: '`username` does not correspond to a user'
            })
        }
        if (friend.id === req.user.id) {
            return res.status(400).send({
                error: 'can`t mark self as friend'
            })
        }

        await User.handleFriendRequest(req.user, friend)
        return res.send({ success: true })
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})

friends.post('/accept', authenticate, async (req, res) => {
    const { username } = req.body

    if (!username) {
        return res.status(400).send({
            error: '`username` is not provided'
        })
    }

    try {
        const friend = await User.findOne({ username })
        if (!friend) {
            return res.status(404).send({
                error: '`username` does not correspond to a user'
            })
        }
        if (friend.id === req.user.id) {
            return res.status(400).send({
                error: 'can`t mark self as friend'
            })
        }

        await User.handleFriendAccept(req.user, friend)
        return res.send({ success: true })
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})

friends.delete('/', authenticate, async (req, res) => {
    const { username } = req.body

    if (!username) {
        return res.status(400).send({
            error: '`username` is not provided'
        })
    }

    try {
        const friend = await User.findOne({ username })
        if (!friend) {
            return res.status(404).send({
                error: '`username` does not correspond to a user'
            })
        }
        if (friend.id === req.user.id) {
            return res.status(400).send({
                error: 'can`t mark self as friend'
            })
        }

        await User.handleFriendDeletion(req.user, friend)
        return res.send({ success: true })
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})

export default friends