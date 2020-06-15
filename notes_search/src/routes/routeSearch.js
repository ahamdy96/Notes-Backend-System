import express from 'express'

import { searchController } from '../controllers/index.js'


const searchRouter = express.Router()

searchRouter.get('/',
    // validate request parameters
    searchController.validateSearch(),
    // use searchNotes middleware
    searchController.searchNotes)

    
export { searchRouter }