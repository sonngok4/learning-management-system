const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        enum: ['Programming', 'Data Science', 'Design', 'Business', 'Language', 'Mathematics', 'Music', 'Photography', 'Health & Fitness', 'Cooking', 'Personal Development', 'Engineering', 'AI & Machine Learning', 'Cybersecurity', 'Philosophy'],
        required: true
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    },
    price: {
        type: Number,
        default: 0
    },
    coverImage: {
        type: String
    },
    lessons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson'
    }],
    enrollments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Enrollment'
    }],
    tags: [String],
    isPublished: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalEnrollments: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;