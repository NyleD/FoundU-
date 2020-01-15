import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import mongoose, { transactionWrapper } from './../db/mongoose'
import { validateEmail } from './../utils'

const { ObjectId } = mongoose.Schema.Types
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    username: {
        type: String,
        required: [ true, 'username is required' ],
        minlength: 3,
        unique: true,
        trim: true
    },
    email :{
        type: String,
        required: [ true, 'user email is required' ],
        unique: true,
        trim: true,
        validate: {
            validator: validateEmail,
            message: props => `${props.value} is not a valid email`
        }
    },
    created_at: {
        type: Date,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    friends: [{ 
        id: {
            type: ObjectId,
            became_friends_at: Date
        }
    }],
    pendingFriends: [{
        id: {
            type: ObjectId,
            recieved_at: Date
        }
    }],
    sentFriends: [{ 
        id: {
            type: ObjectId,
            sent_at: Date
        }
    }],
    tokens: [{
        access: {
            type: String,
            required: true
        },
        created_at: {
            type: Date,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
})

// modification: do not return the hashed password, or tokens
UserSchema.methods.toJSON = function() {
    const user = this
    const {
        _id,
        username,
        email,
        name,
        friends,
        sentFriends,
        pendingFriends
    } = user.toObject()

    return {
        id: _id,
        username,
        email,
        name,
        friends,
        sentFriends,
        pendingFriends
    }
}

// adds a generation token for the user
UserSchema.methods.generateAuthToken = async function() {
    const user = this
    const access = 'auth'

    const token = jwt.sign({
        _id: user._id.toHexString(),
        access
    }, process.env.JWT_SECRET)

    await user.updateOne({
        $push: { tokens: { access, token, created_at: Date.now() } }
    })
    return token
}

// deletes an authentication token from the user
UserSchema.methods.removeToken = async function(token) {
    const user = this

    if (!token) {
        throw new Error('authentication token is not provided')
    }

    return await user.updateOne({ 
        $pull : { 
            tokens: { 
                token 
            } 
        } 
    })
}

UserSchema.methods.receiveFriendRequest = async function(friendId) {
    const user = this

    if (!friendId) {
        throw new Error('no friendId is provided')
    }
    if (user.friends.find(({ id }) => id.equals(friendId))) {
        throw new Error('user is already a friend')
    }
    if (user.pendingFriends.find(({ id }) => id.equals(friendId))) {
        throw new Error('user is already in `pending`')
    }
    if (user.sentFriends.find(({ id }) => id.equals(friendId))) {
        throw new Error('user is already in `sent`')
    }

    return await user.updateOne({
        $push: { 
            pendingFriends: { 
                id: friendId,
                recieved_at: Date.now()
            }
        }
    })
}

UserSchema.methods.sendFriendRequest = async function(friendId) {
    const user = this

    if (!friendId) {
        throw new Error('no friendId is provided')
    }
    if (user.friends.find(({ id }) => id.equals(friendId))) {
        throw new Error('user is already a friend')
    }
    if (user.pendingFriends.find(({ id }) => id.equals(friendId))) {
        throw new Error('user is already in `pending`')
    }
    if (user.sentFriends.find(({ id }) => id.equals(friendId))) {
        throw new Error('user is already in `sent`')
    }

    return await user.updateOne({
        $push: { 
            sentFriends: { 
                id: friendId,
                sent_at: Date.now()
            } 
        }
    })
}

UserSchema.methods.markSentAsAccepted = async function(friendId) {
    const user = this

    if (!friendId) {
        throw new Error('no friendId is provided')
    }
    if (user.friends.find(({ id }) => id.equals(friendId))) {
        throw new Error('user is already a friend')
    }
    if (!user.sentFriends.find(({ id }) => id.equals(friendId))) {
        throw new Error('user is not in `sent`')
    }
    
    return await user.updateOne({
        $push: { 
            friends: { 
                id: friendId,
                became_friends_at: Date.now()
            }
        },
        $pull: { 
            sentFriends: { 
                id: friendId
            }
        }
    })
}

UserSchema.methods.markPendingAsAccepted = async function(friendId) {
    const user = this

    if (!friendId) {
        throw new Error('no friendId is provided')
    }
    if (user.friends.find(({ id }) => id.equals(friendId))) {
        throw new Error('user is already a friend')
    }
    if (!user.pendingFriends.find(({ id }) => id.equals(friendId))) {
        throw new Error('user is not in `pending`')
    }

    return await user.updateOne({
        $push: { 
            friends: { 
                id: friendId,
                became_friends_at: Date.now()
            } 
        },
        $pull: { 
            pendingFriends: { 
                id: friendId 
            }
        }
    })
}

UserSchema.methods.deleteFriend = async function(friendId) {
    const user = this

    if (!friendId) {
        throw new Error('no friendId is provided')
    }

    return await user.updateOne({
        $pull: { 
            friends: { id: friendId },
            sentFriends: { id: friendId },
            pendingFriends: { id: friendId }
        }
    })
}

UserSchema.statics.handleFriendRequest = async (sender, reciever) => {
    return await transactionWrapper(async (sender, reciever) => {
        await sender.sendFriendRequest(reciever.id)
        await reciever.receiveFriendRequest(sender.id)
    }, sender, reciever)
}

UserSchema.statics.handleFriendAccept = async (sender, reciever) => {
    return await transactionWrapper(async (sender, reciever) => {
        await sender.markPendingAsAccepted(reciever.id)
        await reciever.markSentAsAccepted(sender.id)
    }, sender, reciever)
}

UserSchema.statics.handleFriendDeletion = async (sender, reciever) => {
    await transactionWrapper(async (sender, reciever) => {
        await sender.deleteFriend(reciever.id)
        await reciever.deleteFriend(sender.id)
    }, sender, reciever)
}

// finds a user by authentication token
UserSchema.statics.findByToken = async function(token) {
	const User = this

    if (!token) {
        throw new Error('authentication token is not provided')
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    return await User.findOne({
        '_id': decoded._id,
        'tokens.token' : token,
        'tokens.access': 'auth'
    })
}

// finds a user by username and password
UserSchema.statics.findByCredentials = async function(username, password) {
    const User = this

    const user = await User.findOne({ username })
    if (!user) throw new Error('User not found')
    const result = await bcrypt.compare(password, user.password)

    if (!result) {
        throw new Error('credentials do not match')
    }

    return user
}

// hashes a password before saving the entry
UserSchema.pre('save', async function(next) {
    const user = this

    try {
        if (user.isModified('password')) {
            const salt = await bcrypt.genSalt(10)
            const passwordHash = await bcrypt.hash(user.password, salt)
            user.password = passwordHash
        }
        if (user.isModified('username')) {
            user.username = user.username.toLowerCase()
        }

        next()
    } catch (e) {
        next(e)
    }
})

const User = mongoose.model('User', UserSchema)
export default User