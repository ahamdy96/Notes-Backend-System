import jwt from 'jsonwebtoken'
import { key } from '../utils/environment.js'

const generateJWT = (payload) => {
    return jwt.sign(payload, key, { expiresIn: '1d' })
}

export { generateJWT }