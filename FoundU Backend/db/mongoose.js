import mongoose from 'mongoose'

mongoose.Promise = global.Promise
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true
})

export const transactionWrapper = async (callback, ...args) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        await callback(...args)
        await session.commitTransaction()
        session.endSession()
    } catch (e) {
        await session.abortTransaction()
        session.endSession()
        throw e
    }
}

export default mongoose