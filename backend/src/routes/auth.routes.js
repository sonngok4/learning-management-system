const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const multer = require('multer');
const upload = multer();
const {
    validateSchema,
    schemas,
} = require('../middlewares/validation.middleware');

const AuthMiddleware = require('../middlewares/auth.middleware');

// Đăng ký người dùng
router.post('/register',
    upload.single('avatar'),
    validateSchema(schemas.user.registration),
    AuthController.register
);

// Đăng nhập
router.post('/login',
    validateSchema(schemas.user.login),
    AuthController.login
);

// Đăng xuất
router.post('/logout',
    AuthMiddleware.authenticate,
    AuthController.logout
);

// Làm mới phiên đăng nhập
router.post('/refresh-token',
    AuthMiddleware.refreshToken,
    AuthController.refreshToken
);

// Thay đổi mật khẩu
router.post('/change-password',
    AuthMiddleware.authenticate,
    validateSchema(schemas.user.changePassword),
    AuthController.changePassword
);

module.exports = router;