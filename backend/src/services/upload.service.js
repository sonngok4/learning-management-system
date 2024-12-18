// upload.service.js
const cloudinary = require('cloudinary').v2;
const Logger = require('../utils/logger.util');

class UploadService {
	constructor() {
		cloudinary.config({
			cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
			api_key: process.env.CLOUDINARY_API_KEY,
			api_secret: process.env.CLOUDINARY_API_SECRET
		});
	}

	async uploadFile(file, folder) {
		try {
			// Chuyển buffer thành base64 hoặc stream
			const uploadOptions = {
				folder: folder,
				use_filename: true,
				unique_filename: true,
				overwrite: false
			};

			const result = await new Promise((resolve, reject) => {
				const uploadStream = cloudinary.uploader.upload_stream(
					uploadOptions,
					(error, result) => {
						if (error) {
							reject(error);
						} else {
							resolve(result);
						}
					}
				);

				// Nếu file là buffer từ multer
				if (file.buffer) {
					uploadStream.end(file.buffer);
				} else {
					// Nếu file là path
					cloudinary.uploader.upload(file.path, uploadOptions, (error, result) => {
						if (error) {
							reject(error);
						} else {
							resolve(result);
						}
					});
				}
			});

			Logger.info(`File uploaded successfully: ${result.secure_url}`);
			return result.secure_url;
		} catch (error) {
			Logger.error('Error uploading file:', error);
			throw error;
		}
	}

	async deleteFile(fileUrl) {
		try {
			// Trích xuất public_id từ URL
			const publicId = fileUrl.split('/').slice(-1)[0].split('.')[0];
			console.log("publicId: ", publicId);

			const result = await cloudinary.uploader.destroy(publicId);

			if (result.result === 'ok') {
				Logger.info(`File deleted successfully: ${fileUrl}`);
			} else {
				throw new Error('Failed to delete file');
			}
		} catch (error) {
			Logger.error('Error deleting file:', error);
			throw error;
		}
	}
}

module.exports = UploadService;