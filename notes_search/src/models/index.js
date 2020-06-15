import mongoose from 'mongoose'

import { noteModel } from './modelNote.js'
import { dbString } from '../utils/environment.js'


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

export { noteModel }