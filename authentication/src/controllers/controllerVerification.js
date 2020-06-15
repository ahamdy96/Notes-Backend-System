import { validateVerificationToken, validationResult } from 'validation'
import { verificationTokenModel, userModel } from '../models/index.js'
import { passport, generateJWT } from '../config/index.js'


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
        passport.authenticate(method, { session: false }, (err, doc, info) => {
            if (err) {
                reject(err)
            } if (info && info.message) {
                reject(info)
            } else {
                resolve(doc)
            }
        })(req, res, next)
    })
}


// a middleware to handle the token embedded in url 
// that was sent to user email to verify his email address
const verifyToken = async (req, res, next) => {
    try {

        // check request parameters validation results
        await checkValidation(req)

        const token = req.query.token

        // find the token in database
        const verificationToken = await verificationTokenModel.findOne({ token: token }).exec()

        // if token not found send back invalid token
        if (!verificationToken)
            res.status(422).send({ message: 'token not valid' })

        // find the user associated with the token
        const user = await userModel.findById(verificationToken.userId).exec()

        // if no user is found send back unknown user 
        if (!user)
            res.status(422).send({ message: 'unknown user' })

        // mark user as verified
        await userModel.findByIdAndUpdate(verificationToken.userId, { isVerified: true }).exec()

        // delete token from database as it's one time use
        await verificationTokenModel.findOneAndDelete({ token: token }).exec()

        // send back email is verified
        res.send({ message: 'email verified' })

    } catch (error) {

        console.log(error)

        // return unsuccessful message if any is caught
        res.status(422).send({ 'message': 'Unsuccessful' })
    }
}

// a middleware for user registration
const facebookCallback = async (req, res, next) => {
    try {

        // authenticate user's facebook account
        const facebookUser = await authenticate(req, res, next, 'facebook')

        // generate jwt for user
        const token = generateJWT(facebookUser)

        // send back the token and the user profile
        res.json({
            token: token,
            user: facebookUser
        })

    } catch (error) {

        console.log(error)

        // return unsuccessful message if any is caught
        res.status(422).send({ 'message': 'Unsuccessful' })
    }
}

const verificationController = { verifyToken, validateVerificationToken, facebookCallback }

export { verificationController }
