import mongoose from 'mongoose';

const schema = mongoose.Schema;

mongoose.set('useCreateIndex', true);

const userSchema = schema({
    username: {
        type: String,
        unique: true,
        sparse: true
    },
    email: {
        type: String,
        unique: true,
        sparse: true
    },
    phone: {
        type: String,
        unique: true,
        sparse: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const userModel = mongoose.model('user', userSchema);

export { userModel }


