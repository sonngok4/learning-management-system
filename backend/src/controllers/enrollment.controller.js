// controllers/enrollment.controller.js
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const { ApiError } = require('../utils/api-error');

class EnrollmentController {
    // Get all enrollments for current user
    static async getMyEnrollments(req, res) {
        try {
            const enrollments = await Enrollment.find({ user: req.user._id })
                .populate('course', 'title description thumbnail')
                .lean();

            res.status(200).json(enrollments);
        } catch (error) {
            throw new ApiError(500, 'Error fetching enrollments: ' + error.message);
        }
    }

    // Check if user is enrolled in a specific course
    static async checkEnrollmentStatus(req, res) {
        try {
            const { courseId } = req.params;
            const userId = req.user._id;

            const enrollment = await Enrollment.findOne({
                user: userId,
                course: courseId
            });

            res.status(200).json({
                isEnrolled: !!enrollment
            });
        } catch (error) {
            throw new ApiError(500, 'Error checking enrollment status: ' + error.message);
        }
    }

    // Enroll user in a course
    static async enrollInCourse(req, res) {
        try {
            const { courseId } = req.params;
            const userId = req.user._id;

            // Check if course exists
            const course = await Course.findById(courseId);
            if (!course) {
                throw new ApiError(404, 'Course not found');
            }

            // Check if already enrolled
            const existingEnrollment = await Enrollment.findOne({
                user: userId,
                course: courseId
            });

            if (existingEnrollment) {
                throw new ApiError(400, 'Already enrolled in this course');
            }

            // Create new enrollment
            const newEnrollment = await Enrollment.create({
                user: userId,
                course: courseId,
                enrollmentDate: new Date(),
                status: 'active'
            });

            await newEnrollment.populate('course', 'title description thumbnail');

            res.status(201).json({
                success: true,
                message: 'Successfully enrolled in course',
                enrollment: newEnrollment
            });
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Error enrolling in course: ' + error.message);
        }
    }
}

module.exports = EnrollmentController;