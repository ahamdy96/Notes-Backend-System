import express from 'express'

import { userController } from '../controllers/index.js'


const userRouter = express.Router()

userRouter
    .post('/register',
        // validate request parameters
        userController.validateUser(),
        // use registerUser middleware
        userController.registerUser)
    .post('/login',
        // validate request parameters
        userController.validateUser(),
        // use loginUser middleware
        userController.loginUser)
    .get('/facebook',
        // use facebookAuth middleware
        userController.facebookAuth)


export { userRouter }