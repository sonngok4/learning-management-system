// routes/enrollment.routes.js
const express = require('express');
const router = express.Router();
const EnrollmentController = require('../controllers/enrollment.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');

// Get all enrollments for current user
router.get('/my-enrollments',
    AuthMiddleware.authenticate,
    EnrollmentController.getMyEnrollments
);

// Check enrollment status for a specific course
router.get('/status/:courseId',
    AuthMiddleware.authenticate,
    EnrollmentController.checkEnrollmentStatus
);

// Enroll in a course
router.post('/enroll/:courseId',
    AuthMiddleware.authenticate,
    EnrollmentController.enrollInCourse
);

module.exports = router;
