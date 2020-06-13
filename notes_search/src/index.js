import express from 'express';
import bodyParser from 'body-parser';

import { searchRouter } from './routes/index.js'
import { port } from './utils/environment.js'


var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/notes', searchRouter)

app.listen(port, () => {
    console.log(`data management server started and is listening to ${port}`);
})