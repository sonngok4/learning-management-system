// models/Document.js
const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    size: Number,
    mimetype: String,
    uploadDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Document', DocumentSchema);