import expressValidator from 'express-validator'


const { query } = expressValidator;

const validateVerificationToken = () => {
    return [
        query('token', 'no token found!').exists({ checkFalsy: false, checkNull: false })
            .bail()
            .isLength({ min: 64, max: 64 })
            .withMessage('invalid token')
    ]
}

export { validateVerificationToken }