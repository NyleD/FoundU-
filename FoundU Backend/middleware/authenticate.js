import User from './../models/user'

const authenticate = async (req, res, next) => {
    const token = req.header('auth')

    try {
        const user = await User.findByToken(token)
        if (!user) throw new Error('user is not authenticated')
        req.user = user
        req.token = token
        next()
    } catch(e) {
        res.status(401).send({ error: e.message })
    }
}

export default authenticate