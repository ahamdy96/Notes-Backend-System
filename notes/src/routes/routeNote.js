import express from 'express'
import { noteController } from '../controllers/index.js'

const noteRouter = express.Router();

noteRouter
    .get('/retrieve',
        noteController.validateNote('retrieve'),
        noteController.retrieveNote)
    .get('/retrieveAll',
        noteController.retrieveAllNotes)
    .post('/create',
        noteController.validateNote('create'),
        noteController.createNote)
    .put('/update',
        noteController.validateNote('update'),
        noteController.updateNote)
    .delete('/delete',
        noteController.validateNote('delete'),
        noteController.deleteNote)

export { noteRouter }