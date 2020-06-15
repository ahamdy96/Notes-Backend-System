import pkg from 'dotenv'

const { config } = pkg
config()

// load evironment variables
const emailAddress = process.env.email_address
const key = process.env.secret
const port = process.env.port
const dbString = process.env.db_string
const sendgridApiKey = process.env.sendgrid_api_key
const clientID = process.env.client_id
const clientSecret = process.env.client_secret
const facebookCallbackURL = process.env.facebook_callback_url
const emailVerificationCallback = process.env.email_verification_callback

export {
    emailAddress,
    key,
    port,
    dbString,
    sendgridApiKey,
    clientID,
    clientSecret,
    facebookCallbackURL,
    emailVerificationCallback
}