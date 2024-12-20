const Assignment = require('../models/Assignment');
const { ApiError } = require('../utils/api-error');
const logger = require('../utils/logger.util');

class AssignmentController {
    async getAllAssignments(req, res, next) {
        try {
            const assignments = await Assignment.find();
            res.status(200).json(assignments);
        } catch (error) {
            logger.error(error);
            next(ApiError.internal(error.message));
        }
    }

    async getAssignmentById(req, res, next) {
        try {
            const assignment = await Assignment.findById(req.params.id);
            if (!assignment) {
                return next(ApiError.notFound(`Assignment with id ${req.params.id} not found`));
            }
            res.status(200).json(assignment);
        } catch (error) {
            logger.error(error);
            next(ApiError.internal(error.message));
        }
    }

    async createAssignment(req, res, next) {
        try {
            const assignment = await Assignment.create(req.body);
            res.status(201).json(assignment);
        } catch (error) {
            logger.error(error);
            next(ApiError.internal(error.message));
        }
    }

    async updateAssignment(req, res, next) {
        try {
            const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!assignment) {
                return next(ApiError.notFound(`Assignment with id ${req.params.id} not found`));
            }
            res.status(200).json(assignment);
        } catch (error) {
            logger.error(error);
            next(ApiError.internal(error.message));
        }
    }

    async deleteAssignment(req, res, next) {
        try {
            const assignment = await Assignment.findByIdAndDelete(req.params.id);
            if (!assignment) {
                return next(ApiError.notFound(`Assignment with id ${req.params.id} not found`));
            }
            res.status(200).json(assignment);
        } catch (error) {
            logger.error(error);
            next(ApiError.internal(error.message));
        }
    }

    async submitAssignment(req, res, next) {
        try {
            const { assignmentId } = req.params;
            const studentId = req.user._id;

            const assignment = await Assignment.findById(assignmentId);
            if (!assignment) {
                throw new ApiError(404, 'Assignment not found');
            }

            // Check if assignment is still accepting submissions
            if (new Date() > assignment.dueDate) {
                throw new ApiError(400, 'Assignment submission deadline has passed');
            }

            // Check if student has already submitted
            const existingSubmission = assignment.submissions.find(
                sub => sub.student.toString() === studentId.toString()
            );

            if (existingSubmission) {
                // Update existing submission
                existingSubmission.submissionFile = req.file.path;
                existingSubmission.submissionDate = new Date();
            } else {
                
                // Add new submission
                assignment.submissions.push({
                    student: studentId,
                    submissionFile: req.file.path,
                    submissionDate: new Date()
                });
            }

            await assignment.save();

            res.status(200).json({
                success: true,
                message: 'Assignment submitted successfully'
            });

        } catch (error) {
            next(error);
        }
    };

    async getMySubmissions (req, res, next) {
        try {
            const studentId = req.user._id;

            const submissions = await Assignment.find({
                'submissions.student': studentId
            })
                .select('title dueDate submissions maxScore')
                .populate('course', 'name');

            // Format response to show only student's submissions
            const formattedSubmissions = submissions.map(assignment => {
                const mySubmission = assignment.submissions.find(
                    sub => sub.student.toString() === studentId.toString()
                );

                return {
                    assignmentId: assignment._id,
                    title: assignment.title,
                    courseName: assignment.course.name,
                    dueDate: assignment.dueDate,
                    maxScore: assignment.maxScore,
                    submission: mySubmission
                };
            });

            res.status(200).json({
                success: true,
                data: formattedSubmissions
            });

        } catch (error) {
            next(error);
        }
    };

}

module.exports = new AssignmentController();