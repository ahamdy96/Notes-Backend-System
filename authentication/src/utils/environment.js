import pkg from 'dotenv'

const { config } = pkg
config();

const emailAddress = process.env.email_address
const key = process.env.secret
const port = process.env.port
const dbString = process.env.db_string;
const sendgridApiKey = process.env.sendgrid_api_key

export { emailAddress, key, port, dbString, sendgridApiKey }