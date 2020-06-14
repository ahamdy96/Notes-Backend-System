import { passport, generateJWT } from '../config/index.js'
import { validateUser } from 'validation'
import { validationResult } from 'validation'

const checkValidation = async (req) => {
    return new Promise((resolve, reject) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            reject(errors.array());
        }

        resolve(true)
    })

}

const authenticate = async (req, res, next, method) => {
    return new Promise((resolve, reject) => {
        passport.authenticate(method, { session: false }, (err, doc, info) => {
            if (err) {
                reject(err)
            } if (info) {
                reject(info)
            } else {
                resolve(doc);
            }
        })(req, res, next)
    })
}

const registerUser = async (req, res, next) => {
    try {
        await checkValidation(req);

        const user = await authenticate(req, res, next, 'register')
        const token = generateJWT({ user })

        res.json({
            token: token,
            user: user
        })
    } catch (error) {
        console.log(error)
        if (error instanceof Array)
            res.status(422).send({ 'message': error })
        else
            res.status(401).send({ 'message': error.message })
    }
}

const loginUser = async (req, res, next) => {
    try {
        await checkValidation(req);

        const user = await authenticate(req, res, next, 'login')
        const token = generateJWT(user)

        res.json({
            token: token,
            user: user
        })
    } catch (error) {
        console.log(error)
        if (error instanceof Array)
            res.status(422).send({ 'message': error })
        else
            res.status(401).send({ 'message': error.message })
    }
}

const facebookAuth = async (req, res, next) => {
    try {

        await authenticate(req, res, next, 'facebook')
    
    } catch (error) {
        console.log(error)
        if (error instanceof Array)
            res.status(422).send({ 'message': error })
        else
            res.status(401).send({ 'message': error.message })
    }
}

const userController = {
    registerUser,
    loginUser,
    facebookAuth,
    validateUser
}

export { userController }