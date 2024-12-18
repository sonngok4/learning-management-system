// middlewares/validation.middleware.js
const Joi = require('joi');
const { updateAvatar } = require('../controllers/user.controller');

// Middleware validation chung
const validateSchema = (schema, source = 'body') => {
    return (req, res, next) => {
        const { error } = schema.validate(req[source], {
            abortEarly: false // Trả về tất cả các lỗi
        });

        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                errors: error.details.map(detail => ({
                    message: detail.message,
                    path: detail.path
                }))
            });
        }

        next();
    };
};

// Các schema validation
const schemas = {
    user: {
        registration: Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            username: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string()
                .min(8)
                .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d!@#$%^&*()_+={}|;:,.<>?`~\\-\\[\\]\\/]{8,}$'))
                .required(),
            role: Joi.string().valid('student', 'instructor', 'admin').default('student')
        }),
        login: Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        }),
        update: Joi.object({
            firstName: Joi.string(),
            lastName: Joi.string(),
            username: Joi.string(),
            email: Joi.string().email(),
            role: Joi.string().valid('student', 'instructor', 'admin')
        }),
        updateAvatar: Joi.object({
            avatar: Joi.object().required().keys({
                mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp').required(),
                size: Joi.number().max(5 * 1024 * 1024).required()
            })
        }),
        changePassword: Joi.object({
            oldPassword: Joi.string().required(),
            newPassword: Joi.string()
                .min(8)
                .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d!@#$%^&*()_+={}|;:,.<>?`~\\-\\[\\]\\/]{8,}$'))
                .required()
        })
    },
    course: {
        create: Joi.object({
            name: Joi.string().required(),
            description: Joi.string().required(),
            duration: Joi.string().required(),
            price: Joi.number().positive().required(),
            status: Joi.string().valid('active', 'inactive').default('active')
        }),
        update: Joi.object({
            name: Joi.string(),
            description: Joi.string(),
            duration: Joi.string(),
            price: Joi.number().positive(),
            status: Joi.string().valid('active', 'inactive')
        })
    },
    document: {
        create: Joi.object({
            title: Joi.string().required(),
            course: Joi.string().required(),
            lesson: Joi.string().required(),
            description: Joi.string(),
            fileUrl: Joi.string().required(),
            uploadedBy: Joi.string().required(),
            fileType: Joi.string().valid('pdf', 'docx', 'pptx', 'xlsx', 'other')
        }),
        update: Joi.object({
            title: Joi.string(),
            course: Joi.string(),
            lesson: Joi.string(),
            fileUrl: Joi.string(),
            description: Joi.string(),
            uploadedBy: Joi.string(),
            fileType: Joi.string().valid('pdf', 'docx', 'pptx', 'xlsx', 'other')
        })
    },
    common: {
        searchParams: Joi.object({
            query: Joi.string().required(),
            limit: Joi.number().integer().min(1).max(100).default(10),
            offset: Joi.number().integer().min(0).default(0)
        }),
        paginationParams: Joi.object({
            limit: Joi.number().integer().min(1).max(100).default(10),
            offset: Joi.number().integer().min(0).default(0)
        })
    }
};

module.exports = {
    validateSchema,
    schemas
};