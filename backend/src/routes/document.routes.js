// const express = require('express');
// const router = express.Router();
// const DocumentController = require('../controllers/document.controller');
// const {
//     validateSchema,
//     schemas
// } = require('../middlewares/validation.middleware');
// const AuthMiddleware = require('../middlewares/auth.middleware');
// const UploadMiddleware = require('../middlewares/upload.middleware');

// // Tải lên tài liệu
// router.post('/',
//     AuthMiddleware.authenticate,
//     UploadMiddleware.upload(), // Middleware tải lên
//     validateSchema(schemas.document.create),
//     DocumentController.uploadDocument
// );

// // Cập nhật tài liệu
// router.put('/:id',
//     AuthMiddleware.authenticate,
//     validateSchema(schemas.document.update),
//     DocumentController.updateDocument
// );

// // Tìm kiếm tài liệu
// router.get('/search',
//     validateSchema(schemas.common.searchParams, 'query'),
//     DocumentController.searchDocuments
// );

// // Lỗi tài liệu
// router.delete('/:id',
//     AuthMiddleware.authenticate,
//     AuthMiddleware.authorize('admin'),
//     DocumentController.deleteDocument
// );

// module.exports = router;