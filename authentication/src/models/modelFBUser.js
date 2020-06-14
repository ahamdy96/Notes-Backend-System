import mongoose from 'mongoose';

const schema = mongoose.Schema;

mongoose.set('useCreateIndex', true);

const fbUserSchema = schema({
    email: {
        type: String,
        unique: true,
    },
    fbId: {
        type: String,
        unique: true,
    },
    accessToken: {
        type: String,
        required: true
    }
}, { timestamps: true })

const fbUserModel = mongoose.model('fbUser', fbUserSchema);

export { fbUserModel }


