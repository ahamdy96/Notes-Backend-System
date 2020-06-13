import { jwtVerifiy } from 'validation'
import { userModel } from '../models/index.js'
import { jwtKey } from '../utils/index.js'

const passport = jwtVerifiy(jwtKey, userModel)

export { passport }

