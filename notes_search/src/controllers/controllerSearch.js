import { noteModel } from '../models/index.js'
import { validationResult, validateSearch } from 'validation'


// a function to check the results of request parameters validation  
const checkValidation = async (req) => {
    return new Promise((resolve, reject) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            reject(errors.array())
        }

        resolve(true)
    })
}

// a function to extract the parameters from request
const extractParameters = (req) => {

    const { id, author, title, body } = req.query

    const params = {
        _id: id,
        author: author,
        title: title,
        body: body
    }

    // delete any undefined fields
    Object.keys(params).forEach((field) => {
        if (params[field] === undefined)
            delete params[field]
    })

    // return the extracted parameters
    return params
}


// a middleware for note search
const searchNotes = async (req, res, next) => {
    try {

        // check request parameters validation results
        await checkValidation(req)

        // extract parameters from request
        const params = extractParameters(req)

        if (Object.keys(params).length !== 0) {

            // if parameters aren't empty find notes that meats the parameters
            const docs = await noteModel.find(params).exec()

            // send back the found notes
            res.json({ 'notes': docs })
        } else {

            // else send back empty notes 
            res.json({ 'notes': [] })
        }

    } catch (error) {

        console.log(error)

        // return error if any is caught
        if (error instanceof Array)
            // if the error is an array send it all back
            res.status(422).send({ 'message': error })
        else
            // else send the error message
            res.status(401).send({ 'message': error.message })
    }
}

const searchController = { searchNotes, validateSearch }

export { searchController }

