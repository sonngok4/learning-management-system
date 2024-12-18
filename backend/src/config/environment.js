// src/config/environment.js
require('dotenv').config();

module.exports = {
	NODE_ENV: process.env.NODE_ENV || 'development',
	PORT: process.env.PORT || 3000,
	DATABASE: {
		URI: process.env.MONGODB_URI,
	},
	JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
	JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
	JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
	EMAIL: {
		HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
		PORT: parseInt(process.env.EMAIL_PORT, 10) || 587,
		SECURE: process.env.EMAIL_SECURE === 'true',
		USER: process.env.EMAIL_USER,
		PASSWORD: process.env.EMAIL_PASSWORD,
		FROM_ADDRESS: process.env.EMAIL_FROM_ADDRESS || 'noreply@lms.com',
	},
	CLOUDINARY: {
		CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
		API_KEY: process.env.CLOUDINARY_API_KEY,
		API_SECRET: process.env.CLOUDINARY_API_SECRET,
	},
};
