import express from 'express'

import { userController } from '../controllers/index.js'


const userRouter = express.Router();

userRouter
    .post('/register',
        userController.validateUser(),
        userController.registerUser)
    .post('/login',
        userController.validateUser(),
        userController.loginUser)

export { userRouter }