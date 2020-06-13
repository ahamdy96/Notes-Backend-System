import expressValidator from 'express-validator'

import { validateNote } from './noteValidation.js'
import { validateUser } from './userValidation.js'
import { jwtVerifiy } from './passportJWT.js'
import { validateSearch } from './searchValidation.js'
import { validateVerificationToken } from './verificationTokenValidation.js'


const { validationResult } = expressValidator;

export {
    validateUser,
    validateNote,
    validateSearch,
    validateVerificationToken,
    validationResult,
    jwtVerifiy
}