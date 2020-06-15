import mongoose from 'mongoose'


const schema = mongoose.Schema

const noteSchema = schema({
    author: {
        type: schema.Types.ObjectId,
        required: true
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
},
    { timestamps: true }
)


const noteModel = mongoose.model('note', noteSchema)

export { noteModel }