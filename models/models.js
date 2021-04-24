const mongoose = require('mongoose')
const { Schema } = mongoose;

const bookSchema = new Schema({
    title: String,
    commentcount: {
        type: Number,
        default: 0
    },
    comments: Array
})

const Book = mongoose.model('books', bookSchema)

module.exports = {Book}

