const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: String,
        default: 'default-avatar.png'
    },
    role: {
        type: String,
        enum: ['student', 'instructor', 'admin'],
        default: 'student'
    },
    enrolledCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    createdCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
}, {
    timestamps: true
});

// Password hashing middleware
UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};
const User = mongoose.model('User', UserSchema);
module.exports = User;