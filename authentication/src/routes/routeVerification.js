import express from 'express'

import { verificationController } from '../controllers/index.js'


const verificationRouter = express.Router()

verificationRouter
    .get('/',
        // validate request parameters
        verificationController.validateVerificationToken(),
        // use verifyToken middleware
        verificationController.verifyToken)
    .get('/facebook',
        // use facebookCallback middleware
        verificationController.facebookCallback)


export { verificationRouter }