import mongoose from 'mongoose';

const schema = mongoose.Schema;

mongoose.set('useCreateIndex', true);

const verificationTokenSchema = schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    token: {
        type: String,
        required: true
    }
}, { timestamps: true })

const verificationTokenModel = mongoose.model('verificationToken', verificationTokenSchema);

export { verificationTokenModel }


