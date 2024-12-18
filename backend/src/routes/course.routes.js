const express = require('express');
const router = express.Router();
const CourseController = require('../controllers/course.controller');
const {
    validateSchema,
    schemas
} = require('../middlewares/validation.middleware');
const AuthMiddleware = require('../middlewares/auth.middleware');
const checkPermission = require('../middlewares/permission.middleware');


router.get('/', AuthMiddleware.authenticate, CourseController.getAllCourses);

router.get('/:id', AuthMiddleware.authenticate, CourseController.getCourseById);

// Tạo khóa học (chỉ admin và giảng viên)
router.post('/add',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize('admin', 'instructor'),
    checkPermission('courses', 'create'),
    validateSchema(schemas.course.create),
    CourseController.createCourse
);

// Cập nhật khóa học
router.put('/:id',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize('admin', 'instructor'),
    checkPermission('courses', 'update'),
    validateSchema(schemas.course.update),
    CourseController.updateCourse
);

// Tìm kiếm khóa học
router.get('/search',
    validateSchema(schemas.common.searchParams, 'query'),
    CourseController.searchCourses
);

router.delete('/:id',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize('admin', 'instructor'),
    checkPermission('courses', 'delete'),
    CourseController.deleteCourse
);

module.exports = router;