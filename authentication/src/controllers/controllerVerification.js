import { validateVerificationToken } from 'validation'
import { verificationTokenModel, userModel } from '../models/index.js'
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

const verificationController = { verifyToken, validateVerificationToken }

export { verificationController }
