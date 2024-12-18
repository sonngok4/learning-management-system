const multer = require('multer');
const path = require('path');
const ApiError = require('../utils/api-error');

class UploadMiddleware {
  // Cấu hình lưu trữ tệp
  static storage(destination) {
    return multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, destination);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
      }
    });
  }

  // Kiểm tra loại tệp
  static fileFilter(allowedTypes) {
    return (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (allowedTypes.includes(ext)) {
        cb(null, true);
      } else {
        cb(new ApiError(400, `Only ${allowedTypes.join(', ')} files are allowed`));
      }
    };
  }

  // Giới hạn kích thước tệp
  static upload(destination, allowedTypes, maxSize = 5 * 1024 * 1024) {
    return multer({
      storage: this.storage(destination),
      fileFilter: this.fileFilter(allowedTypes),
      limits: { fileSize: maxSize }
    }).single('file');
  }

  // Middleware xử lý lỗi tải lên
  static handleUploadError(err, req, res, next) {
    if (err instanceof multer.MulterError) {
      // Lỗi của Multer
      return res.status(400).json({
        success: false,
        message: err.message
      });
    } else if (err) {
      // Lỗi do fileFilter
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    next();
  }
}

module.exports = UploadMiddleware;