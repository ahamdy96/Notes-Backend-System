import expressValidator from 'express-validator'
import mongoose from 'mongoose'

const { body, query } = expressValidator

// a function to validate notes parameters 
const validateNote = (route) => {
    switch (route) {
        case 'retrieve':
            return [
                // ensure id exists and is not false like "", 0, false or null
                query('id', 'no note Id found!').exists({ checkFalsy: true })
                    // stop running validations if any of the previous ones have failed
                    .bail()
                    // ensure id is a valid mongoose object id
                    .custom(value => {
                        if (!mongoose.Types.ObjectId.isValid(value))
                            throw new Error('id is not in the correct format!')
                        else
                            return true
                    })
            ]
            break
        case 'create':
            return [
                // ensure title exists and is not false like "", 0, false or null
                body('title', 'no note title found!').exists({ checkFalsy: true }),
                // ensure body exists and is not false like "", 0, false or null
                body('body', 'no note body found!').exists({ checkFalsy: true })
            ]
            break
        case 'update':
            return [
                // ensure id exists and is not false like "", 0, false or null
                body('id', 'no note Id found!').exists({ checkFalsy: true })
                    // stop running validations if any of the previous ones have failed
                    .bail()
                    // ensure id is a valid mongoose object id
                    .custom(value => {
                        if (!mongoose.Types.ObjectId.isValid(value))
                            throw new Error('id is not in the correct format!')
                        else
                            return true

                    })
                ,
                // ensure title exists and is not false like "", 0, false or null
                body('title', 'no note title found').exists({ checkNull: true }),
                // ensure body exists and is not false like "", 0, false or null
                body('body', 'no note Id found!').exists({ checkNull: true })
            ]
            break
        case 'delete':
            return [
                // ensure id exists and is not false like "", 0, false or null
                query('id', 'no note Id found!').exists({ checkFalsy: true, checkNull: true })
                    // stop running validations if any of the previous ones have failed
                    .bail()
                    // ensure id is a valid mongoose object id
                    .custom(value => {
                        if (!mongoose.Types.ObjectId.isValid(value))
                            throw new Error('id is not in the correct format!')
                        else
                            return true

                    })
            ]
            break
        default:
            console.log(`validation for ${method} is unavailable`)
            break
    }
}

export { validateNote }