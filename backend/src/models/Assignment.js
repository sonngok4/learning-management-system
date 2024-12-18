const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    maxScore: {
        type: Number,
        default: 100
    },
    attachments: [String],
    submissions: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        submissionFile: String,
        submissionDate: Date,
        grade: {
            type: Number,
            min: 0
        },
        feedback: String
    }]
}, {
    timestamps: true
});

const Assignment = mongoose.model('Assignment', AssignmentSchema);
module.exports = Assignment;