import pkg from 'dotenv'

const { config } = pkg
config()

// load evironment variables
const dbString = process.env.db_string
const port = process.env.port

export { dbString, port }