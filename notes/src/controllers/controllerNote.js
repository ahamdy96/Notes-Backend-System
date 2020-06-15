import { noteModel } from '../models/index.js'
import { validationResult, validateNote } from 'validation'
import { passport } from '../config/index.js'


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

// a function to check the results of request parameters validation  
const authenticate = async (req, res, next) => {
    return new Promise((resolve, reject) => {
        passport.authenticate('jwt', { session: false }, (err, doc, info) => {
            if (err) {
                reject(err)
            }
            if (info) {
                reject(info)
            } else {
                resolve(doc)
            }
        })(req, res, next)
    })
}


// a middleware for note creation
const createNote = async (req, res, next) => {
    try {

        // check request parameters validation results
        await checkValidation(req)

        // authenticate user
        const user = await authenticate(req, res, next)

        const { title, body } = req.body

        // create new note
        const note = new noteModel({
            author: user._id,
            title: title,
            body: body
        })

        // save note
        const doc = await note.save()

        // send back the saved note
        res.json({ 'doc': doc })

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

const retrieveNote = async (req, res, next) => {
    try {

        // check request parameters validation results
        await checkValidation(req)

        const id = req.query.id

        // find note
        const doc = await noteModel.findById(id).exec()

        if (!doc)
            // if note not found send back a not found message 
            res.status(404).json({ 'message': 'note not found' })
        else {
            // else return the note
            res.json({ 'note': doc })
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

const retrieveAllNotes = async (req, res, next) => {
    try {

        // check request parameters validation results
        await checkValidation(req)

        // find all notes
        const docs = await noteModel.find().exec()

        // send back notes
        res.json({ 'notes': docs })

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

const updateNote = async (req, res, next) => {
    try {

        // check request parameters validation results
        await checkValidation(req)

        // authenticate user
        const user = await authenticate(req, res, next)

        const { id, title, body } = req.body

        // create updated note
        const note = new noteModel({
            '_id': id,
            title,
            body
        })

        // update note with the authenticated user as an author
        const doc = await noteModel.findOneAndUpdate({ _id: id, author: user._id }, note, { new: true })

        if (!doc)
            // if note not found send back a not found message 
            res.status(404).json({ 'message': 'note not found' })
        else
            // else send back the updated note
            res.json({ 'updated note': doc })

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

const deleteNote = async (req, res, next) => {
    try {

        // check request parameters validation results
        await checkValidation(req)

        // authenticate user
        const user = await authenticate(req, res, next)

        const id = req.query.id

        // delete note with the authenticated user as an author
        const doc = await noteModel.findOneAndDelete({ _id: id, author: user._id }).exec()

        if (!doc)
            // if note not found send back a not found message 
            res.status(404).json({ 'message': 'note not found' })
        else
            // else send back the deleted note
            res.json({ 'deleted note': doc })

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


const noteController = { createNote, retrieveNote, retrieveAllNotes, updateNote, deleteNote, validateNote }

export { noteController } 