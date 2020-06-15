import express from 'express'
import { noteController } from '../controllers/index.js'

const noteRouter = express.Router()

noteRouter
    .get('/retrieve',
        // validate request parameters
        noteController.validateNote('retrieve'),
        // use retrieveNote middleware
        noteController.retrieveNote)
    .get('/retrieveAll',
        // use retrieveAllNotes middleware
        noteController.retrieveAllNotes)
    .post('/create',
        // validate request parameters
        noteController.validateNote('create'),
        // use createNote middleware
        noteController.createNote)
    .put('/update',
        // validate request parameters
        noteController.validateNote('update'),
        // use updateNote middleware
        noteController.updateNote)
    .delete('/delete',
        // validate request parameters
        noteController.validateNote('delete'),
        // use deleteNote middleware
        noteController.deleteNote)

        
export { noteRouter }