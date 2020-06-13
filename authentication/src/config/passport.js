import passport from 'passport'
import passportCustom from 'passport-custom'
import bcrypt from 'bcryptjs';
import crypto from 'crypto'
import sendgrid from '@sendgrid/mail'

import { userModel, verificationTokenModel } from '../models/index.js'
import { sendgridApiKey, emailAddress } from '../utils/index.js'


const customStrategy = passportCustom.Strategy;

passport
    .use('register',
        new customStrategy(async (req, done) => {
            try {

                const params = extractParameters(req)

                const query = []

                Object.keys(params).forEach((field) => {
                    if (params[field]) {
                        query.push({ [field]: params[field] })
                    }
                })

                const doc = await userModel.findOne({ $or: query }).lean().exec();

                if (doc) {
                    Object.keys(doc).forEach((field) => {
                        if (doc[field] === params[field]) {
                            return done(null, false, { message: `${field} is taken` })
                        }
                    })
                }

                let user = new userModel(params)

                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(user.password, salt)
                user.password = hash;

                await user.save();

                if (user.email)
                    await verifyEmail(user)

                user = user.toObject();
                delete user.password

                return done(null, user)

            } catch (error) {
                return done(error)
            }
        }
        ))
    .use('login',
        new customStrategy(async (req, done) => {
            try {

                const params = extractParameters(req)

                const query = {}

                Object.keys(params).forEach((field) => {
                    if (field !== 'password')
                        query[field] = params[field]
                })

                const doc = await userModel.findOne(query).lean().exec();

                if (!doc)
                    return done(null, false, { message: 'user not found' })

                const isMatched = await bcrypt.compare(params.password, doc.password)

                if (isMatched) {
                    delete doc.password
                    return done(null, doc)
                } else {
                    return done(null, false, { message: 'wrong password' })
                }

            } catch (error) {
                return done(error)
            }
        }
        ))


const verifyEmail = async (user) => {
    try {
        const random = crypto.randomBytes(32).toString('hex')
        const token = verificationTokenModel({
            userId: user._id,
            token: random
        })

        sendgrid.setApiKey(sendgridApiKey);
        const msg = {
            to: user.username,
            from: emailAddress,
            subject: 'Verify your account!',
            text: `Greetings,\n\nThis is an email verification test, please enter the link below to verify your email\nhttp://localhost:4000/authentication/verify?token=${random}\n\nRegards,\nAhmed Hamdy`
        };

        sendgrid.send(msg);

        await token.save()
    } catch (error) {
        return Promise.reject(error)
    }
}

const extractParameters = (req) => {
    const { username, email, phone, password } = req.body

    const params = {
        username: username,
        email: email,
        phone: phone,
        password: password
    }

    Object.keys(params).forEach((field) => {
        if (params[field] === undefined)
            delete params[field]
    })

    return params;
}


export { passport }