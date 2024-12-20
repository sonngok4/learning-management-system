const express = require('express');
const User = require('../models/User');
const { ApiError } = require('../utils/api-error');

const router = express.Router();

const AuthMiddleware = require('../middlewares/auth.middleware');
const { validateSchema, schemas } = require('../middlewares/validation.middleware');
const UserController = require('../controllers/user.controller');

router.get('/', AuthMiddleware.authenticate, AuthMiddleware.authorize('admin'), UserController.getAllUsers);

router.get('/:id', AuthMiddleware.authenticate, AuthMiddleware.authorize('admin'), UserController.getUserById);

router.get('/role/:role', AuthMiddleware.authenticate, AuthMiddleware.authorize('admin'), UserController.getUserByRole);

router.get('/by-user/me', AuthMiddleware.authenticate, UserController.getProfile);

// Cập nhật thông tin người dùng (yêu cầu xác thực)
router.put('/profile/:id',
    AuthMiddleware.authenticate,
    validateSchema(schemas.user.update),
    UserController.updateProfile
);

// Cập nhật ảnh đại diện người dùng (yêu cầu xác thực)
router.put('/avatar/:id',
    AuthMiddleware.authenticate,
    validateSchema(schemas.user.updateAvatar),
    UserController.updateAvatar
);

module.exports = router;
