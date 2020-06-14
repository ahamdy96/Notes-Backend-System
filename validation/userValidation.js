import expressValidator from 'express-validator'


const { body } = expressValidator;

const validateUser = () => {
    return [
        body('username')
            .custom((value, { req }) => {
                if (!req.body.phone && !req.body.username && !req.body.email) {
                    throw new Error('missing username')
                }
                else {
                    return true;
                }
            })
            .bail()
            .if((value, { req, path, location }) => {
                return (req.body.username === '' || req.body.username)
            })
            .isLength({ min: 4, max: 32 })
            .withMessage('username must be 4 characters minimum'),
        body('phone')
            .custom((value, { req }) => {
                if (!req.body.phone && !req.body.username && !req.body.email) {
                    throw new Error('missing phone')
                }
                else {
                    return true;
                }
            })
            .bail()
            .if((value, { req, path, location }) => {
                return (req.body.phone === '' || req.body.phone )
            })
            .matches('^(010|011|012|015)\\d{8}$')
            .withMessage('phone number must contains 11 digits beginning with 010, 011, 012 or 015'),
        body('email')
            .custom((value, { req }) => {
                if (!req.body.phone && !req.body.username && !req.body.email) {
                    throw new Error('missing email')
                }
                else {
                    return true;
                }
            })
            .bail()
            .if((value, { req, path, location }) => {
                return (req.body.email === '' || req.body.email )
            })
            .isEmail()
            .withMessage('invalid email'),
        body('password', 'no password found')
            .exists({ checkNull: true, checkNull: true })
            .bail()
            .isLength({ min: 8, max: 32 })
            .withMessage('password must be 8 characters minimum')
    ]
}

export { validateUser }
