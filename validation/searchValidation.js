import expressValidator from 'express-validator'
import mongoose from 'mongoose';


const { query } = expressValidator;

const validateSearch = () => {
    return [
        query('id').optional({ checkFalsy: false, nullable: false }).custom(value => {
            if (!mongoose.Types.ObjectId.isValid(value))
                return Promise.reject('id is not in the correct format!')
            else
                return Promise.resolve();
        }),
        query('author').optional({ checkFalsy: false, nullable: false }).custom(value => {
            if (!mongoose.Types.ObjectId.isValid(value))
                return Promise.reject('author id is not in the correct format!')
            else
                return Promise.resolve();
        }),
        query('title', 'title shoud be a string value').optional({ checkFalsy: true }).isString(),
        query('body', 'title shoud be a string value').optional({ checkFalsy: true }).isString()
    ]
}


export { validateSearch }