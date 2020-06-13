import express from 'express'

import { searchController } from '../controllers/index.js'


const searchRouter = express.Router();

searchRouter.get('/',
    searchController.validateSearch(),
    searchController.searchNotes)

export { searchRouter }