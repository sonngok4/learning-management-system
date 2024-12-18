const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { ApiError } = require('../utils/api-error');

dotenv.config();

class AuthController {
    static async register(req, res) {
        try {
            const { firstName, lastName, username, email, password } = req.body;
            console.log("Request body: ", firstName, lastName, username, email, password);


            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new ApiError(400, 'User already exists');
            }

            const user = await User.create({
                firstName,
                lastName,
                username,
                email,
                password
            });

            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;

            // Validate input
            if (!email || !password) {
                throw new ApiError(400, 'Email and password are required');
            }

            // Find user
            const user = await User.findOne({ email });
            console.log("user: ", user);

            if (!user) {
                throw new ApiError(400, 'User not found');
            }

            // Validate password
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                throw new ApiError(400, 'Invalid password');
            }

            // Generate token
            const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const refreshToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

            // Set cookies
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Chỉ gửi qua HTTPS trong môi trường production
                sameSite: 'Lax' // in development mode
            });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Chỉ gửi qua HTTPS trong môi trường production
                sameSite: 'Lax' // in development mode
            });

            // Send response (optional: remove token from response if you rely entirely on cookies)
            res.status(200).json({ user, accessToken, refreshToken });
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }


    static async logout(req, res, next) {
        try {
            res.clearCookie('authToken');
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            res.status(200).json({ message: 'Logout successful' });
        } catch (error) {
            next(error);
        }
    }
    static async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                throw new ApiError(400, 'Refresh token is required');
            }

            // Xác minh Refresh Token
            jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(401).json({ message: 'Invalid refresh token' });
                }

                // Nếu Refresh Token hợp lệ, tạo Access Token mới
                const newAccessToken = jwt.sign({ id: decoded.id, role: decoded.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

                // Trả về Access Token mới
                res.cookie('accessToken', newAccessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production', // Bật secure khi ở môi trường production
                    sameSite: 'Lax', // in development mode
                    maxAge: 3600 * 1000 // Đặt thời gian hết hạn cho cookie (1 giờ)
                })

                // Trả về Access Token mới
                res.status(200).json({ accessToken: newAccessToken });
            });
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }

    static async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;
            const userId = req.user.id;  // Giả sử bạn có middleware xác thực người dùng và lưu id người dùng vào req.user

            // Kiểm tra xem cả mật khẩu cũ và mật khẩu mới có được cung cấp không
            if (!currentPassword || !newPassword) {
                throw new ApiError(400, 'Both current and new passwords are required');
            }

            // Tìm người dùng trong cơ sở dữ liệu
            const user = await User.findById(userId);
            if (!user) {
                throw new ApiError(400, 'User not found');
            }

            // Kiểm tra xem mật khẩu cũ có đúng không
            const isPasswordValid = await user.comparePassword(currentPassword);
            if (!isPasswordValid) {
                throw new ApiError(400, 'Current password is incorrect');
            }

            // Băm mật khẩu mới và lưu vào cơ sở dữ liệu
            user.password = await bcrypt.hash(newPassword, 10);
            await user.save();

            res.status(200).json({ message: 'Password updated successfully' });
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }

}

module.exports = AuthController;