const express = require('express');
const router = express.Router();
const DocumentController = require('../controllers/document.controller');
const {
    validateSchema,
    schemas
} = require('../middlewares/validation.middleware');
const AuthMiddleware = require('../middlewares/auth.middleware');
const checkPermission = require('../middlewares/permission.middleware');


// Lấy danh sách tài liệu
router.get('/',
    validateSchema(schemas.common.searchParams, 'query'),
    DocumentController.getDocuments
);

// Tải lên tài liệu
router.post('/',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize('admin', 'instructor'),
    checkPermission('documents', 'create'),
    validateSchema(schemas.document.create),
    DocumentController.uploadDocument
);

// Cập nhật tài liệu
router.put('/:id',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize('admin', 'instructor'),
    checkPermission('documents', 'update'), 
    validateSchema(schemas.document.update),
    DocumentController.updateDocument
);

// Tìm kiếm tài liệu
router.get('/search',
    validateSchema(schemas.common.searchParams, 'query'),
    DocumentController.searchDocuments
);

// Xoá tài liệu
router.delete('/:id',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize('admin', 'instructor'),
    DocumentController.deleteDocument
);

module.exports = router;