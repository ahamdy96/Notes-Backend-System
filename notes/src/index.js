import express from 'express';
import bodyParser from 'body-parser';

import { noteRouter } from './routes/index.js'
import { passport } from './config/index.js'
import { port } from './utils/index.js'


var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());

app.use('/', noteRouter)

app.listen(port, () => {
    console.log(`notes server started and is listening to port ${port}`);
})