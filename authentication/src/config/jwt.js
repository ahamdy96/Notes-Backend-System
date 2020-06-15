import jwt from 'jsonwebtoken'
import { key } from '../utils/environment.js'

// generate signed jwt token that expires in 1 day
const generateJWT = (payload) => {
    return jwt.sign(payload, key, { expiresIn: '1d' })
}

export { generateJWT }