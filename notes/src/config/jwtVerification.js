import { jwtVerifiy } from 'validation'
import { userModel, fbUserModel } from '../models/index.js'
import { jwtKey } from '../utils/index.js'

const passport = jwtVerifiy(jwtKey, userModel, fbUserModel)

export { passport }

