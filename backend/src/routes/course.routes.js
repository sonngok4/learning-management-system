const express = require('express');
const router = express.Router();
const CourseController = require('../controllers/course.controller');
const multer = require('multer');
const upload = multer();
const {
    validateSchema,
    schemas
} = require('../middlewares/validation.middleware');
const AuthMiddleware = require('../middlewares/auth.middleware');
const checkPermission = require('../middlewares/permission.middleware');


router.get('/', CourseController.getAllCourses);

router.get('/my-courses', AuthMiddleware.authenticate, CourseController.getMyCourses);

router.get('/:id', AuthMiddleware.authenticate, CourseController.getCourseById);

// Tạo khóa học (chỉ admin và giảng viên)
router.post('/create',
    AuthMiddleware.authenticate,
    upload.single('coverImage'),
    AuthMiddleware.authorize('admin', 'instructor'),
    checkPermission('courses', 'create'),
    validateSchema(schemas.course.create),
    CourseController.createCourse
);

router.post('/create-with-lessons',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize('admin', 'instructor'),
    checkPermission('courses', 'create'),
    validateSchema(schemas.course.createWithLessons),
    CourseController.createCourseWithLessons
);

router.post('/:courseId/lessons', AuthMiddleware.authenticate, CourseController.addLesson);

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