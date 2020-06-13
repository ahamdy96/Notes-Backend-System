import expressValidator from 'express-validator'
import mongoose from 'mongoose';

const { body, query } = expressValidator;


const validateNote = (route) => {
    switch (route) {
        case 'retrieve':
            return [
                query('id', 'no note Id found!').exists({ checkFalsy: true, checkNull: true })
                    .bail()
                    .custom(value => {
                        if (!mongoose.Types.ObjectId.isValid(value))
                            return Promise.reject('id is not in the correct format!')
                        else
                            return Promise.resolve();
                    })
            ]
            break;
        case 'create':
            return [
                body('title', 'no note title found!').exists({ checkNull: true }),
                body('body', 'no note body found!').exists({ checkNull: true })
            ]
            break;
        case 'update':
            return [
                body('id', 'no note Id found!').exists({ checkFalsy: true, checkNull: true })
                    .bail()
                    .custom(value => {
                        if (!mongoose.Types.ObjectId.isValid(value))
                            return Promise.reject('id is not in the correct format!')
                        else
                            return Promise.resolve();

                    })
                ,
                body('title', 'no note title found').exists({ checkNull: true }),
                body('body', 'no note Id found!').exists({ checkNull: true })
            ]
            break;
        case 'delete':
            return [
                query('id', 'no note Id found!').exists({ checkFalsy: true, checkNull: true })
                    .bail()
                    .custom(value => {
                        if (!mongoose.Types.ObjectId.isValid(value))
                            return Promise.reject('id is not in the correct format!')
                        else
                            return Promise.resolve();

                    })
            ]
            break;
        default:
            console.log(`validation for ${method} is unavailable`)
            break;
    }
}

export { validateNote }