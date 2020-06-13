import express from 'express'

import { verificationController } from '../controllers/index.js'


const verificationRouter = express.Router();

verificationRouter.get('/',
    verificationController.validateVerificationToken(),
    verificationController.verifyToken)

export { verificationRouter }