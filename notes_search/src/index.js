import express from 'express'
import bodyParser from 'body-parser'

import { searchRouter } from './routes/index.js'
import { port } from './utils/environment.js'


// create express application 
const app = express()

// configure express
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// set express routes
app.use('/notes', searchRouter)

// start server
app.listen(port, () => {
    console.log(`notessearch server started and is listening to port ${port}`)
})