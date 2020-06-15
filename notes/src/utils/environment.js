import pkg from 'dotenv'

const { config } = pkg
config()

// load evironment variables
const jwtKey = process.env.secret
const dbString = process.env.db_string
const port = process.env.port

export { port, dbString, jwtKey }