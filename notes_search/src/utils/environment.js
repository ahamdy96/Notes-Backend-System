import pkg from 'dotenv'

const { config } = pkg;
config();

const dbString = process.env.db_string
const port = process.env.port

export { dbString, port }