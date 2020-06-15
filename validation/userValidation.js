import expressValidator from 'express-validator'


const { body } = expressValidator

const validateUser = () => {
    return [
        body('username')
            // username is mandatory only if no phone or email was provided
            .custom((value, { req }) => {
                if (!req.body.phone && !req.body.username && !req.body.email) {
                    throw new Error('missing username')
                }
                else {
                    return true
                }
            })
            // stop running validations if any of the previous ones have failed
            .bail()
            // continue running validations if username exists 
            .if((value, { req, path, location }) => {
                return (req.body.username === '' || req.body.username)
            })
            // username must be 4 characters minimum and 32 maximum
            .isLength({ min: 4, max: 32 })
            // send back a message if the previous validation fails
            .withMessage('username must be 4 characters minimum and 32 maximum'),
        body('phone')
            // phone is mandatory only if no username or email was provided
            .custom((value, { req }) => {
                if (!req.body.phone && !req.body.username && !req.body.email) {
                    throw new Error('missing phone')
                }
                else {
                    return true
                }
            })
            // stop running validations if any of the previous ones have failed
            .bail()
            // continue running validations if phone exists 
            .if((value, { req, path, location }) => {
                return (req.body.phone === '' || req.body.phone)
            })
            // phone number must contains 11 digits beginning with 010, 011, 012 or 015
            .matches('^(010|011|012|015)\\d{8}$')
            // send back a message if the previous validation fails
            .withMessage('phone number must contains 11 digits beginning with 010, 011, 012 or 015'),
        body('email')
            // email is mandatory only if no username or phone was provided
            .custom((value, { req }) => {
                if (!req.body.phone && !req.body.username && !req.body.email) {
                    throw new Error('missing email')
                }
                else {
                    return true
                }
            })
            // stop running validations if any of the previous ones have failed
            .bail()
            // continue running validations if email exists 
            .if((value, { req, path, location }) => {
                return (req.body.email === '' || req.body.email)
            })
            // email must in valid format
            .isEmail()
            // send back a message if the previous validation fails
            .withMessage('invalid email'),
        body('password', 'no password found')
            // ensure password exists and is not false like "", 0, false or null
            .exists({ checkFalsy: true })
            // stop running validations if any of the previous ones have failed
            .bail()
            // password must be 8 characters minimum and 32 maximum
            .isLength({ min: 8, max: 32 })
            // send back a message if the previous validation fails
            .withMessage('password must be 8 characters minimum and 32 maximum')
    ]
}

export { validateUser }
