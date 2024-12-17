// const express = require('express');
// const router = express.Router();
// const CourseController = require('../controllers/course.controller');
// const {
//     validateSchema,
//     schemas
// } = require('../middlewares/validation.middleware');
// const AuthMiddleware = require('../middlewares/auth.middleware');

// // Tạo khóa học (chỉ admin và giảng viên)
// router.post('/',
//     AuthMiddleware.authenticate,
//     AuthMiddleware.authorize('admin', 'instructor'),
//     validateSchema(schemas.course.create),
//     CourseController.createCourse
// );

// // Cập nhật khóa học
// router.put('/:id',
//     AuthMiddleware.authenticate,
//     AuthMiddleware.authorize('admin', 'instructor'),
//     validateSchema(schemas.course.update),
//     CourseController.updateCourse
// );

// // Tìm kiếm khóa học
// router.get('/search',
//     validateSchema(schemas.common.searchParams, 'query'),
//     CourseController.searchCourses
// );

// module.exports = router;