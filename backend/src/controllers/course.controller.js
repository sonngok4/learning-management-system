const Course = require('../models/Course');
const { ApiError } = require('../utils/api-error');
class CourseController {

    static async createCourse(req, res) {
        try {
            const course = await Course.create(req.body);
            res.status(201).json(course);
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }

    static async getAllCourses(req, res) {
        try {
            // Kiểm tra vai trò của người dùng
            const user = req.user;

            let courses;
            if (user.role === 'admin') {
                // Admin có quyền lấy tất cả khóa học
                courses = await Course.find();
            } else if (user.role === 'instructor') {
                // Instructor chỉ có thể lấy các khóa học do họ tạo
                courses = await Course.find({ createdBy: user._id });
            } else if (user.role === 'student') {
                // Sinh viên chỉ có thể lấy các khóa học mà họ đã đăng ký
                courses = await Course.find({ _id: { $in: user.enrolledCourses } });
            } else {
                return res.status(403).json({ message: 'Quyền truy cập không hợp lệ' });
            }

            res.status(200).json(courses);
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }

    static async getCourseById(req, res) {
        try {
            const courseId = req.params.id;
            const user = req.user;

            // Tìm khóa học
            const course = await Course.findById(courseId);

            if (!course) {
                return res.status(404).json({ message: 'Khóa học không tồn tại' });
            }

            // Kiểm tra quyền truy cập vào khóa học
            if (user.role === 'admin') {
                return res.status(200).json(course); // Admin có thể xem tất cả
            }

            if (user.role === 'instructor' && course.createdBy.equals(user._id)) {
                return res.status(200).json(course); // Instructor chỉ có thể xem khóa học của mình
            }

            if (user.role === 'student' && user.enrolledCourses.includes(course._id)) {
                return res.status(200).json(course); // Sinh viên chỉ có thể xem khóa học họ đã đăng ký
            }

            return res.status(403).json({ message: 'Quyền truy cập không hợp lệ' });
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }

    static async updateCourse(req, res) {
        try {
            const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.status(200).json(course);
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }

    static async deleteCourse(req, res) {
        try {
            const course = await Course.findByIdAndDelete(req.params.id);
            res.status(200).json(course);
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }

    static async searchCourses(req, res) {
        try {
            const courses = await Course.find({
                $or: [
                    { name: { $regex: req.query.name, $options: 'i' } },
                    { description: { $regex: req.query.description, $options: 'i' } },
                ],
            });
            res.status(200).json(courses);
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }
}

module.exports = CourseController;