const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const {
    validateSchema,
    schemas,
} = require('../middlewares/validation.middleware');

const AuthMiddleware = require('../middlewares/auth.middleware');

// Đăng ký người dùng
router.post('/register',
    // validateSchema(schemas.user.registration),
    AuthController.register
);

// Đăng nhập
router.post('/login',
    // validateSchema(schemas.user.login),
    AuthController.login
);

// Cập nhật thông tin người dùng (yêu cầu xác thực)
// router.put('/profile',
//     AuthMiddleware.authenticate,
//     validateSchema(schemas.user.update),
//     AuthController.updateProfile
// );

// Thay đổi mật khẩu
// router.post('/change-password',
//     AuthMiddleware.authenticate,
//     validateSchema(schemas.user.changePassword),
//     AuthController.changePassword
// );

module.exports = router;