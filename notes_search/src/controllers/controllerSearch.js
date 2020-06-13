import { noteModel } from '../models/index.js'
import { validationResult, validateSearch } from 'validation'

const checkValidation = async (req) => {
    return new Promise((resolve, reject) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            reject(errors.array());
        }

        resolve(true)
    })
}

const searchNotes = async (req, res, next) => {
    try {
        await checkValidation(req);

        const { id, author, title, body } = req.query;
        const params = {
            _id: id,
            author: author,
            title: title,
            body: body
        }

        const conditions = {}

        Object.keys(params).forEach((field) => {
            if (params[field] !== undefined)
                conditions[field] = params[field]
        })

        if (Object.keys(conditions).length !== 0) {
            const docs = await noteModel.find(conditions).exec();
            res.json({ 'docs': docs })
        } else {
            res.json({ docs: [] })
        }

    } catch (error) {
        console.log(error)
        if (error instanceof Array)
            res.status(422).send({ 'message': error })
        else
            res.status(401).send({ 'message': error.message })
    }
}

const searchController = { searchNotes, validateSearch }

export { searchController }

