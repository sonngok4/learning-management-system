// utils/upload.util.js
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const ValidationUtil = require('./validation.util');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		let uploadPath = 'uploads/';

		// Determine folder based on file type
		if (file.mimetype.startsWith('image/')) {
			uploadPath += 'images/';
		} else if (file.mimetype === 'application/pdf') {
			uploadPath += 'documents/';
		} else {
			uploadPath += 'others/';
		}

		cb(null, uploadPath);
	},
	filename: (req, file, cb) => {
		// Generate unique filename
		const uniqueSuffix = crypto.randomBytes(16).toString('hex');
		cb(null, `${Date.now()}-${uniqueSuffix}${path.extname(file.originalname)}`);
	},
});

const fileFilter = (req, file, cb) => {
	const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
	const allowedDocumentTypes = ['application/pdf'];
	const maxSize = 5 * 1024 * 1024; // 5MB

	// Check file type
	if (
		!allowedImageTypes.includes(file.mimetype) &&
		!allowedDocumentTypes.includes(file.mimetype)
	) {
		return cb(new Error('Invalid file type'), false);
	}

	// Check file size
	if (file.size > maxSize) {
		return cb(new Error('File too large'), false);
	}

	cb(null, true);
};

const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB
	},
});

class UploadUtil {
	static single(fieldName) {
		return upload.single(fieldName);
	}

	static multiple(fieldName, maxCount = 5) {
		return upload.array(fieldName, maxCount);
	}

	static fields(fields) {
		return upload.fields(fields);
	}

	static deleteFile(filePath) {
		return new Promise((resolve, reject) => {
			fs.unlink(filePath, err => {
				if (err) {
					reject(err);
					return;
				}
				resolve();
			});
		});
	}

	static async processImage(file) {
		try {
			const sharp = require('sharp');
			const processedImage = await sharp(file.path)
				.resize(800, 600, {
					fit: 'inside',
					withoutEnlargement: true,
				})
				.jpeg({ quality: 80 })
				.toFile(`${file.path}-processed.jpg`);

			await this.deleteFile(file.path);
			return processedImage;
		} catch (error) {
			throw error;
		}
	}
}

module.exports = UploadUtil;
