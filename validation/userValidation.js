import expressValidator from 'express-validator'


const { body } = expressValidator;

const validateUser = () => {
    return [
        body('username', 'no username found!').exists({ checkFalsy: true, checkNull: true })
            .bail()
            .isLength({ min: 4, max: 32 })
            .withMessage('username must be 4 characters minimum'),
        body('phone', 'no phone found!').exists({ checkFalsy: true, checkNull: true })
            .bail()
            .matches('^(010|011|012|015)\\d{8}$')
            .withMessage('phone number must contains 11 digits beginning with 010, 011, 012 or 015'),
        body('email', 'no email found!').exists({ checkFalsy: true, checkNull: true })
            .bail()
            .isEmail()
            .withMessage('invalid email'),
        body('password', 'no password found').exists({ checkNull: true, checkNull: true })
            .bail()
            .isLength({ min: 8, max: 32 })
            .withMessage('password must be 8 characters minimum')
    ]
}

export { validateUser }