const ApiError = require('../utils/api-error');

class RoleMiddleware {
    // Kiểm tra quyền cho từng tài nguyên cụ thể
    static checkResourceAccess(resourceModel) {
        return async (req, res, next) => {
            try {
                const resourceId = req.params.id;
                const resource = await resourceModel.findById(resourceId);

                if (!resource) {
                    throw new ApiError(404, 'Resource not found');
                }

                // Kiểm tra quyền sở hữu hoặc admin
                const isOwner = resource.instructor.toString() === req.user._id.toString();
                const isAdmin = req.user.role === 'admin';

                if (!isOwner && !isAdmin) {
                    throw new ApiError(403, 'You do not have permission to access this resource');
                }

                req.resource = resource;
                next();
            } catch (error) {
                next(error);
            }
        };
    }

    // Kiểm tra quyền đăng ký khóa học
    static checkCourseEnrollment() {
        return async (req, res, next) => {
            try {
                const courseId = req.params.courseId;
                const userId = req.user._id;

                // Logic kiểm tra đăng ký khóa học
                const enrollment = await Enrollment.findOne({
                    student: userId,
                    course: courseId
                });

                if (!enrollment && req.user.role !== 'admin') {
                    throw new ApiError(403, 'You must enroll in this course first');
                }

                next();
            } catch (error) {
                next(error);
            }
        };
    }
}

module.exports = RoleMiddleware;