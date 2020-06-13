import express from 'express'

import { userController } from '../controllers/index.js'


const userRouter = express.Router();

userRouter
    .post('/register/normal',
        userController.validateUser('register_username'),
        userController.registerUserNormal)
    .post('/login/normal',
        userController.validateUser('login_username'),
        userController.loginUserNormal)
    .post('/register/phone',
        userController.validateUser('register_phone'),
        userController.registerUserPhone)
    .post('/login/phone',
        userController.validateUser('login_phone'),
        userController.loginUserPhone)
    .post('/register/email',
        userController.validateUser('register_email'),
        userController.registerUserEmail)
    .post('/login/email',
        userController.validateUser('login_email'),
        userController.loginUserEmail)

export { userRouter }