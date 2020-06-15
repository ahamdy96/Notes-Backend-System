import expressValidator from 'express-validator'


const { query } = expressValidator

const validateVerificationToken = () => {
    return [
        // ensure token exists and is not false like "", 0, false or null
        query('token', 'no token found!').exists({ checkFalsy: false })
            // stop running validations if any of the previous ones have failed
            .bail()
            // token must be 64 characters
            .isLength({ min: 64, max: 64 })
            // send back a message if the previous validation fails
            .withMessage('invalid token')
    ]
}

export { validateVerificationToken }