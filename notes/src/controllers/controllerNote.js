import { noteModel } from '../models/index.js'
import { validationResult, validateNote } from 'validation'
import { passport } from '../config/index.js'

const checkValidation = async (req) => {
    return new Promise((resolve, reject) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            reject(errors.array());
        }
        resolve(true)
    })
}

const authenticate = async (req, res, next) => {
    return new Promise((resolve, reject) => {
        passport.authenticate('jwt', { session: false }, (err, doc, info) => {
            if (err) {
                reject(err)
            }
            if (info) {
                reject(info)
            } else {
                resolve(doc);
            }
        })(req, res, next)
    })
}


const createNote = async (req, res, next) => {
    try {
        await checkValidation(req);
        const user = await authenticate(req, res, next);

        const { title, body } = req.body;
        const note = new noteModel({
            author: user._id,
            title: title,
            body: body
        })

        const doc = await note.save();

        res.json({ 'doc': doc })

    } catch (error) {
        console.log(error)
        if (error instanceof Array)
            res.status(422).send({ 'message': error })
        else
            res.status(401).send({ message: error.message })
    }
}

const retrieveNote = async (req, res, next) => {
    try {
        await checkValidation(req)

        const id = req.query.id;
        const doc = await noteModel.findById(id).exec();

        if (!doc)
            res.status(404).json({ 'message': 'note not found' })
        else {
            res.json({ 'note': doc })
        }

    } catch (error) {
        console.log(error)
        if (error instanceof Array)
            res.status(422).send({ 'message': error })
        else
            res.status(401).send({ 'message': error.message })
    }
}

const retrieveAllNotes = async (req, res, next) => {
    try {
        await checkValidation(req)
        const docs = await noteModel.find().exec();

        if (!docs)
            res.status(404).json({ 'message': 'note not found' })
        else {
            res.json({ 'notes': docs })
        }

    } catch (error) {
        console.log(error)
        if (error instanceof Array)
            res.status(422).send({ 'message': error })
        else
            res.status(401).send({ 'message': error.message })
    }
}

const updateNote = async (req, res, next) => {
    try {
        await checkValidation(req)
        const user = await authenticate(req, res, next);

        const { id, title, body } = req.body;
        const note = new noteModel({
            '_id': id,
            title,
            body
        })

        const doc = await noteModel.findOneAndUpdate({ _id: id, author: user._id }, note);

        if (!doc)
            res.status(404).json({ 'message': 'note not found' })
        else
            res.json({ 'message': 'note updated' })

    } catch (error) {
        console.log(error)
        if (error instanceof Array)
            res.status(422).send({ 'message': error })
        else
            res.status(401).send({ 'message': error.message })
    }
}

const deleteNote = async (req, res, next) => {
    try {
        await checkValidation(req)
        const user = await authenticate(req, res, next);

        const id = req.query.id;
        const doc = await noteModel.findOneAndDelete({ _id: id, author: user._id }).exec();

        if (!doc)
            res.status(404).json({ 'message': 'note not found' })
        else
            res.json({ 'message': 'note deleted' })

    } catch (error) {
        console.log(error)
        if (error instanceof Array)
            res.status(422).send({ 'message': error })
        else
            res.status(401).send({ 'message': error.message })
    }
}


const noteController = { createNote, retrieveNote, retrieveAllNotes, updateNote, deleteNote, validateNote }

export { noteController } 