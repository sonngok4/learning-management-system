// configs/cloudinary.config.js
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const configureCloudinary = () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        // Kiểm tra kết nối Cloudinary bằng cách thử lấy account info
        return cloudinary.api
            .ping()
            .then(() => {
                console.log('✅ Cloudinary connected successfully');
                return true;
            })
            .catch(error => {
                console.error('❌ Cloudinary connection failed:', error.message);
                return false;
            });
    } catch (error) {
        console.error('❌ Cloudinary configuration error:', error.message);
        return false;
    }
};

module.exports = {
    cloudinary,
    configureCloudinary,
};
