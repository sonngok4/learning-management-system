const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
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
    content: {
        type: String,
        required: true
    },
    videoUrl: String,
    duration: {
        type: Number, // in minutes
        default: 0
    },
    order: {
        type: Number,
        default: 0
    },
    resources: [{
        name: String,
        url: String
    }],
    isPreview: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Lesson = mongoose.model('Lesson', LessonSchema);
module.exports = Lesson;