const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson'
    },
    description: String,
    fileUrl: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        enum: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt', 'xlsx', 'csv'],
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    size: Number,
    accessRoles: [{
        type: String,
        enum: ['student', 'instructor', 'admin'],
        default: ['student', 'instructor', 'admin'],
    }],
}, {
    timestamps: true
});

const Document = mongoose.model('Document', DocumentSchema);

module.exports = Document;