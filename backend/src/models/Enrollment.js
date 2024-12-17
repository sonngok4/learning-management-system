const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'dropped'],
        default: 'active'
    },
    progress: [{
        lesson: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lesson'
        },
        completed: {
            type: Boolean,
            default: false
        },
        completedAt: Date
    }],
    completionDate: Date,
    purchaseDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Enrollment = mongoose.model('Enrollment', EnrollmentSchema);
module.exports = Enrollment;