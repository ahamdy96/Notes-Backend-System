import mongoose from 'mongoose'

import { userModel } from './modelUser.js'
import { fbUserModel } from './modelFBUser.js'
import { verificationTokenModel } from './modelVerificationToken.js'
import { dbString } from '../utils/index.js'


// configure mongoose options
mongoose.set('useUnifiedTopology', true)
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)

// connect to database
mongoose.connect(dbString, { useNewUrlParser: true })

const db = mongoose.connection

db.once('open', () => {
    console.log('Connected to database!')
})

db.on('error', (error) => {
    console.log('[X] ERROR conecting to DB:', error)
    process.exit(-1)
})

export { userModel, fbUserModel, verificationTokenModel }