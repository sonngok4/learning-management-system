const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ApiError } = require('../utils/api-error');

class AuthMiddleware {
  // Xác thực token và gắn user vào request
  static async authenticate(req, res, next) {
    try {
      const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];

      if (!token) {
        throw new ApiError(401, 'No token provided');
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        throw new ApiError(401, 'Invalid token');
      }

      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  }

  // Kiểm tra quyền truy cập
  static authorize(...roles) {
    return (req, res, next) => {
      if (!req.user) {
        throw new ApiError(401, 'Authentication required');
      }

      if (!roles.includes(req.user.role)) {
        throw new ApiError(403, 'Access denied');
      }
      next();
    };
  }

  // Kiểm tra token refresh
  static async refreshToken(req, res, next) {
    try {
      const refreshToken = req.body.refreshToken;

      if (!refreshToken) {
        throw new ApiError(400, 'Refresh token is required');
      }

      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
      );

      const user = await User.findById(decoded.id);

      if (!user) {
        throw new ApiError(401, 'Invalid refresh token');
      }

      // Tạo access token và refresh token mới
      const accessToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );

      const newRefreshToken = jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
      );

      req.tokens = { accessToken, refreshToken: newRefreshToken };
      next();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthMiddleware;