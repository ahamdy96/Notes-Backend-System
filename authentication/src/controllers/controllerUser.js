import { passport, generateJWT } from '../config/index.js'
import { validateUser } from 'validation'
import { validationResult } from 'validation'


// a function to check the results of request parameters validation  
const checkValidation = async (req) => {
    return new Promise((resolve, reject) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            reject(errors.array())
        }

        resolve(true)
    })

}

// a function to authentication user using passport depending on the required method
const authenticate = async (req, res, next, method) => {
    return new Promise((resolve, reject) => {
        passport.authenticate(method, { session: false, scope: 'email' }, (err, doc, info) => {
            if (err) {
                reject(err)
            } if (info) {
                reject(info)
            } else {
                resolve(doc)
            }
        })(req, res, next)
    })
}


// a middleware for user registration
const registerUser = async (req, res, next) => {
    try {

        // check request parameters validation results
        await checkValidation(req)

        // authenticate user's registration
        const user = await authenticate(req, res, next, 'register')

        // generate jwt for user
        const token = generateJWT({ user })

        // send back the token and the user profile
        res.json({
            token: token,
            user: user
        })

    } catch (error) {

        console.log(error)

        // return error if any is caught
        if (error instanceof Array)
            // if the error is an array send it all back
            res.status(422).send({ 'message': error })
        else
            // else send the error message
            res.status(401).send({ 'message': error.message })
    }
}

// a middleware for user login
const loginUser = async (req, res, next) => {
    try {

        // check request parameters validation results
        await checkValidation(req)

        // authenticate user's login
        const user = await authenticate(req, res, next, 'login')

        // generate jwt for user
        const token = generateJWT(user)

        // send back the token and the user profile
        res.json({
            token: token,
            user: user
        })
    } catch (error) {

        console.log(error)

        // return error if any is caught
        if (error instanceof Array)
            // if the error is an array send it all back
            res.status(422).send({ 'message': error })
        else
            // else send the error message
            res.status(401).send({ 'message': error.message })
    }
}

// a middleware for user authentication via facebook
const facebookAuth = async (req, res, next) => {
    try {

        // authenticate user via facebook
        await authenticate(req, res, next, 'facebook')

    } catch (error) {

        console.log(error)

        // return error if any is caught
        if (error instanceof Array)
            // if the error is an array send it all back
            res.status(422).send({ 'message': error })
        else
            // else send the error message
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