import passport from 'passport'
import passportLocal from 'passport-local'
import bcrypt from 'bcryptjs';
import crypto from 'crypto'
import sendgrid from '@sendgrid/mail'

import { userModel, verificationTokenModel } from '../models/index.js'
import { sendgridApiKey, emailAddress } from '../utils/index.js'


const localStrategy = passportLocal.Strategy;

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

const transformUser = (doc, method) => {
    switch (method) {
        case 'phone':
            doc.phone = doc.username
            delete doc.username
            break;
        case 'email':
            doc.email = doc.username
            delete doc.username
            break;
    }
    delete doc.password
}


const registerVerify = async (username, password, done, method) => {
    try {
        const doc = await userModel.findOne({ username: username }, { __v: 0 }).exec();
        if (doc) return done(null, false, { message: 'user already exists, login instead' })

        const user = new userModel({
            username: username,
            password: password
        })

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt)
        user.password = hash;

        await user.save();
        const createdUser = await userModel.findOne({ username: username }, { __v: 0 })
            .lean()
            .exec();


        if (method === 'email')
            await verifyEmail(user)

        transformUser(createdUser, method);

        return done(null, createdUser)

    } catch (error) {
        return done(error)
    }
}

const loginVerify = async (username, password, done, method) => {
    try {
        const doc = await userModel.findOne({ username: username }, { __v: 0 })
            .lean()
            .exec();

        if (!doc) return done(null, false, { message: 'user not found' })

        const isMatched = await bcrypt.compare(password, doc.password)

        transformUser(doc, method);

        if (isMatched) {
            return done(null, doc)
        } else {
            return done(null, false, { message: 'wrong password' })
        }

    } catch (error) {
        return done(error)
    }
}


passport
    .use('register_username',
        new localStrategy(
            (username, password, done) => registerVerify(username, password, done, 'username')))
    .use('login_username',
        new localStrategy(
            (username, password, done) => loginVerify(username, password, done, 'username')))
    .use('register_phone',
        new localStrategy(
            { usernameField: 'phone' },
            (username, password, done) => registerVerify(username, password, done, 'phone')))
    .use('login_phone',
        new localStrategy(
            { usernameField: 'phone' },
            (username, password, done) => loginVerify(username, password, done, 'phone')))
    .use('register_email',
        new localStrategy(
            { usernameField: 'email' },
            (username, password, done) => registerVerify(username, password, done, 'email')))
    .use('login_email',
        new localStrategy(
            { usernameField: 'email' },
            (username, password, done) => loginVerify(username, password, done, 'email')))

export { passport }