const express = require('express');
const router = express.Router();
const LessonController = require('../controllers/lesson.controller');
const {
    validateSchema,
    schemas
} = require('../middlewares/validation.middleware');
const AuthMiddleware = require('../middlewares/auth.middleware');
const checkPermission = require('../middlewares/permission.middleware');

// Tạo bài giải
router.post('/create',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize('admin', 'instructor'),
    checkPermission('lessons', 'create'),
    validateSchema(schemas.lesson.create),
    LessonController.createLesson
);

// Cập nhật bài giải
router.put('/:id',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize('admin', 'instructor'),
    checkPermission('lessons', 'update'),
    validateSchema(schemas.lesson.update),
    LessonController.updateLesson
);

// Xoá bài giải
router.delete('/:id',    
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize('admin', 'instructor'),    
    checkPermission('lessons', 'delete'),
    LessonController.deleteLesson
);

// Lấy danh sách bài giải
router.get('/search',
    validateSchema(schemas.common.searchParams, 'query'),
    LessonController.getLessonsByCourse
);



module.exports = router;