const cloudinary = require('cloudinary').v2;
const User = require('../models/User');
const { ApiError } = require('../utils/api-error');

class UserController {
    static async getAllUsers(req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }

    static async getUserById(req, res) {
        try {
            const user = await User.findById(req.params.id);
            res.json(user);
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }

    static async getProfile(req, res) {
        try {
            console.log("User: ", req.user);

            // const user = await User.findById(req.user._id);
            const user = req.user;
            res.json({
                user
            });
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }

    static async getUserByRole(req, res) {
        try {
            const users = await User.find({ role: req.params.role });
            res.json(users);
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }

    static async updateProfile(req, res) {
        try {
            const { firstName, lastName, username, email, role } = req.body;
            const userId = req.user.id;

            // Tìm người dùng trong cơ sở dữ liệu
            const user = await User.findById(userId);
            if (!user) {
                throw new ApiError(400, 'User not found');
            }

            // Lưu thay đổi này cơ sở dữ liệu
            user.firstName = firstName;
            user.lastName = lastName;
            user.username = username;
            user.email = email;
            user.role = role;
            await user.save();

            res.status(200).json({ message: 'Profile updated successfully' });
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }


    static async updateAvatar(req, res) {
        try {
            const file = req.file; // Lấy file ảnh từ request

            // Kiểm tra quyền truy cập (nếu cần)
            if (!req.user.permissions.canChangeAvatar) {
                return res.status(403).json({
                    message: 'Bạn không có quyền thay đổi ảnh đại diện'
                });
            }

            // Tải lên Cloudinary vào thư mục 'lms-assets/avatars'
            const uploadResponse = await cloudinary.uploader.upload(file.path, {
                folder: 'lms-assets/avatars',  // Chỉ định thư mục 'avatars'
                resource_type: 'image',  // Chỉ định tải lên hình ảnh
                public_id: `avatar_${req.user._id}`,  // Sử dụng ID người dùng để làm public_id
                width: 150,  // Điều chỉnh kích thước hình ảnh (nếu cần)
                height: 150, // Điều chỉnh kích thước hình ảnh (nếu cần)
                crop: 'fill' // Cắt ảnh để phù hợp
            });

            // Cập nhật URL ảnh đại diện cho người dùng
            const user = await User.findById(req.user._id);
            user.avatar = uploadResponse.secure_url;  // Lưu URL ảnh đại diện vào cơ sở dữ liệu

            await user.save();

            res.status(200).json({
                message: 'Cập nhật ảnh đại diện thành công',
                avatar: uploadResponse.secure_url
            });
        } catch (error) {
            res.status(500).json({
                message: 'Lỗi cập nhật ảnh đại diện',
                error: error.message
            });
        }
    }

}

module.exports = UserController