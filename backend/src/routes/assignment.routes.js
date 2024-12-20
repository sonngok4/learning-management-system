const express = require('express');
const router = express.Router();
const AssignmentController = require('../controllers/assignment.controller');
const {
    validateSchema,
    schemas
} = require('../middlewares/validation.middleware');
const AuthMiddleware = require('../middlewares/auth.middleware');
const checkPermission = require('../middlewares/permission.middleware');

router.get('/', AuthMiddleware.authenticate, AssignmentController.getAllAssignments);

router.get('/:id', AuthMiddleware.authenticate, AssignmentController.getAssignmentById);


// Tạo bài tập
router.post('/create',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize('admin', 'instructor'),
    checkPermission('assignments', 'create'),
    validateSchema(schemas.assignment.create),
    AssignmentController.createAssignment
);

// Cập nhật bài tập
router.put('/:id',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize('admin', 'instructor'),
    checkPermission('assignments', 'update'),
    validateSchema(schemas.assignment.update),
    AssignmentController.updateAssignment
);

// Xoá bài tập
router.delete('/:id',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize('admin', 'instructor'),
    checkPermission('assignments', 'delete'),
    AssignmentController.deleteAssignment
);

// Nộp bài tập
router.post('/submit/:id',
    AuthMiddleware.authenticate,
    validateSchema(schemas.assignment.submit),
    AssignmentController.submitAssignment
);

// Lấy danh sách bài tập
router.get('/my-submissions',
    AuthMiddleware.authenticate,
    AssignmentController.getMySubmissions
);

module.exports = router;