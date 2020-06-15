import express from 'express'
import bodyParser from 'body-parser'

import { passport } from './config/index.js'
import { userRouter, verificationRouter } from './routes/index.js'
import { port } from './utils/index.js'


// create express application 
const app = express()

// configure express
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(passport.initialize())

// set express routes
app.use('/', userRouter)
app.use('/verify', verificationRouter)

// start server
app.listen(port, () => {
    console.log(`authentication server started and is listening to port ${port}`)
})