import { jwtVerifiy } from 'validation'
import { userModel, fbUserModel } from '../models/index.js'
import { jwtKey } from '../utils/index.js'

// verify jwt token
const passport = jwtVerifiy(jwtKey, userModel, fbUserModel)

export { passport }

