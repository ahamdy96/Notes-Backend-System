import { validateVerificationToken, validationResult } from 'validation'
import { verificationTokenModel, userModel } from '../models/index.js'
import { passport, generateJWT } from '../config/index.js'


const checkValidation = async (req) => {
    return new Promise((resolve, reject) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            reject(errors.array());
        }

        resolve(true)
    })

}


const verifyToken = async (req, res, next) => {
    try {
        await checkValidation(req)

        const token = req.query.token
        const verificationToken = await verificationTokenModel.findOne({ token: token }).exec()

        if (!verificationToken) res.status(422).send({ message: 'token not valid' })

        const user = await userModel.findById(verificationToken.userId).exec()

        if (!user) res.status(422).send({ message: 'unknown user' })

        await userModel.findByIdAndUpdate(verificationToken.userId, { isVerified: true }).exec()

        await verificationTokenModel.findOneAndDelete({ token: token }).exec()

        res.send({ message: 'email verified' })

    } catch (error) {
        console.log(error)
        res.status(422).send({ 'message': 'Unsuccessful' })
    }
}

const authenticate = async (req, res, next, method) => {
    return new Promise((resolve, reject) => {
        passport.authenticate(method, { session: false }, (err, doc, info) => {
            if (err) {
                reject(err)
            } if (info && info.message) {
                reject(info)
            } else {
                resolve(doc);
            }
        })(req, res, next)
    })
}

const facebookCallback = async (req, res, next) => {
    try {
        const facebookUser = await authenticate(req, res, next, 'facebook');

        const token = generateJWT(facebookUser)

        res.json({
            token: token,
            user: facebookUser
        })

    } catch (error) {
        console.log(error)
        res.status(422).send({ 'message': 'Unsuccessful' })
    }
}

const verificationController = { verifyToken, validateVerificationToken, facebookCallback }

export { verificationController }
