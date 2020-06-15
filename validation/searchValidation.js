import expressValidator from 'express-validator'
import mongoose from 'mongoose'


const { query } = expressValidator

const validateSearch = () => {
    return [
        // optional id but if it exists it is not false like "", 0, false or null
        query('id').optional({ checkFalsy: false })
            // ensure id is a valid mongoose object id
            .custom(value => {
                if (!mongoose.Types.ObjectId.isValid(value))
                    throw new Error('id is not in the correct format!')
                else
                    return true
            }),
        // optional author id but if it exists it is not false like "", 0, false or null
        query('author').optional({ checkFalsy: false }).
            // ensure author id is a valid mongoose object id
            custom(value => {
                if (!mongoose.Types.ObjectId.isValid(value))
                    throw new Error('author id is not in the correct format!')
                else
                    return true
            }),
        // optional title but if it exists it is not false like "", 0, false or null
        query('title', 'title shoud be a string value').optional({ checkFalsy: true }).isString(),
        // optional body but if it exists it is not false like "", 0, false or null
        query('body', 'title shoud be a string value').optional({ checkFalsy: true }).isString()
    ]
}


export { validateSearch }