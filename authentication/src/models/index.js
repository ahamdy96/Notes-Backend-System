import mongoose from 'mongoose';

import { userModel } from './modelUser.js'
import { verificationTokenModel } from './modelVerificationToken.js'
import { dbString } from '../utils/index.js'


mongoose.set('useUnifiedTopology', true);

mongoose.connect(dbString, { useNewUrlParser: true, useFindAndModify: false });

const db = mongoose.connection;

db.once('open', () => {
    console.log('Connected to database!');
})

db.on('error', (error) => {
    console.log('[X] ERROR conecting to DB:', error);
    process.exit(-1);
})

export { userModel, verificationTokenModel }