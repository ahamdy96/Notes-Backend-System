import passport from 'passport'
import passportCustom from 'passport-custom'
import passportFacebook from "passport-facebook"
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import sendgrid from '@sendgrid/mail'

import { userModel, fbUserModel, verificationTokenModel } from '../models/index.js'
import {
    sendgridApiKey,
    emailAddress,
    clientID,
    clientSecret,
    facebookCallbackURL,
    emailVerificationCallback
} from '../utils/index.js'


const customStrategy = passportCustom.Strategy
const facebookStrategy = passportFacebook.Strategy


// configure passport to use different strategies for authentication
passport
    .use('register',

        // configure passport to use custom strategy with register
        new customStrategy(async (req, done) => {
            try {

                // extract parameters from request
                const params = extractParameters(req)

                const query = []

                // build query array to find if any parameter already exists
                Object.keys(params).forEach((field) => {
                    query.push({ [field]: params[field] })
                })

                // query database for any user using any of the parameters
                const doc = await userModel.findOne({ $or: query }).lean().exec()

                // if a user exists return which field is taken
                if (doc) {
                    Object.keys(doc).forEach((field) => {
                        if (doc[field] === params[field]) {
                            return done(null, false, { message: `${field} is taken` })
                        }
                    })
                }

                // create new user
                let user = new userModel(params)

                // hash user password
                const salt = await bcrypt.genSalt(10)
                const hash = await bcrypt.hash(user.password, salt)
                user.password = hash

                // save user to database
                await user.save()

                // if user provided an email, verify it
                if (user.email)
                    await verifyEmail(user)

                // convert user to plain object and remove the password field
                user = user.toObject()
                delete user.password

                // return user
                return done(null, user)

            } catch (error) {

                // return error if any is caught
                return done(error)
            }
        }
        ))
    .use('login',

        // configure passport to use custom strategy with login
        new customStrategy(async (req, done) => {
            try {

                // extract parameters from request
                const params = extractParameters(req)

                const query = {}

                // build query object to find if there is a user that match the parameters
                Object.keys(params).forEach((field) => {

                    // exclude the password field
                    if (field !== 'password')
                        query[field] = params[field]
                })

                // query database for a user that match the parameters
                const doc = await userModel.findOne(query).lean().exec()

                // if a user didn't exist return no user is found
                if (!doc)
                    return done(null, false, { message: 'user not found' })

                // check if password is correct
                const isMatched = await bcrypt.compare(params.password, doc.password)

                if (isMatched) {

                    // if password is correct delete the password field and return user
                    delete doc.password
                    return done(null, doc)

                } else {

                    // if password is wrong return wrong password 
                    return done(null, false, { message: 'wrong password' })
                }

            } catch (error) {

                // return error if any is caught
                return done(error)
            }
        })
    ).use('facebook',

        // configure passport to use facebook strategy with facebook 
        new facebookStrategy({
            clientID: clientID,
            clientSecret: clientSecret,
            callbackURL: facebookCallbackURL,
            profileFields: ['id', 'emails']
        }, async (accessToken, refreshToken, profile, done) => {
            try {

                // extract profile fields and create a user 
                const { id, emails } = profile
                const user = {
                    fbId: id,
                    email: emails[0].value,
                    accessToken: accessToken
                }

                // add user to database or update it if it exists already
                const fbUser = await fbUserModel.findOneAndUpdate({ fbId: id }, user, {
                    upsert: true,
                    new: true
                }).lean().exec()

                // delete facebook id from user
                delete fbUser.fbId

                // return user
                done(null, fbUser)

            } catch (error) {

                // return error if any is caught
                done(error)
            }
        }))

// a function to extract the parameters from request
const extractParameters = (req) => {

    const { username, email, phone, password } = req.body

    const params = {
        username: username,
        email: email,
        phone: phone,
        password: password
    }

    // delete any undefined fields
    Object.keys(params).forEach((field) => {
        if (params[field] === undefined)
            delete params[field]
    })

    // return the extracted parameters
    return params
}

// a function used to verify any user's email
const verifyEmail = async (user) => {
    try {

        // using sendgrid third party service to deliver the verification email
        // here we set the api key 
        sendgrid.setApiKey(sendgridApiKey)

        // generate random token to use when the user verify his email
        const random = crypto.randomBytes(32).toString('hex')
        const token = verificationTokenModel({
            userId: user._id,
            token: random
        })

        // build up the email message
        const message = {
            to: user.email,
            from: emailAddress,
            subject: 'Verify your account!',
            text: `Greetings,\n\n\
            This is an email verification test, please enter the link below to verify your email\n\
            ${emailVerificationCallback}/authentication/verify?token=${random}\n\n\
            Regards,\n\
            Ahmed Hamdy`
        }

        // send the verification email
        await sendgrid.send(message)

        // save the random token
        await token.save()

    } catch (error) {

        // return error if any is caught
        return Promise.reject(error)
    }
}


export { passport }