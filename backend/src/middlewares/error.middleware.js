const { ApiError } = require('../utils/api-error');
const logger = require('../utils/logger.util');

const errorHandler = (err, req, res, next) => {
    // Log lỗi
    logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    // Xử lý các loại lỗi khác nhau
    if (err instanceof ApiError) {
        return res.status(err.status).json({
            success: false,
            message: err.message
        });
    }

    // Lỗi validation của Mongoose
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(error => error.message);
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors
        });
    }

    // Lỗi trùng dữ liệu (unique)
    if (err.code === 11000) {
        return res.status(409).json({
            success: false,
            message: 'Duplicate key error',
            field: Object.keys(err.keyPattern)[0]
        });
    }

    // Lỗi không xác định
    res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'production'
            ? 'Internal Server Error'
            : err.message
    });
};

// Not found handler
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Resource not found',
    });
};

// Rate limiter middleware
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests, please try again later',
    },
});

// Request logger middleware
const requestLogger = (req, res, next) => {
    logger.info({
        method: req.method,
        path: req.path,
        ip: req.ip,
        timestamp: new Date().toISOString(),
    });
    next();
};

module.exports = {
    errorHandler,
    notFoundHandler,
    apiLimiter,
    requestLogger
};