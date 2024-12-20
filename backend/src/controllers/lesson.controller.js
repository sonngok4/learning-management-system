const Lesson = require('../models/Lesson');
const { ApiError } = require('../utils/api-error');
const logger = require('../utils/logger.util');
const cloudinary = require('cloudinary').v2;

class LessonController {
    static async createLesson(req, res, next) {
        try {
            const { title, content, course, videoUrl, duration } = req.body;

            // Upload video to cloudinary
            if (videoUrl) {
                const uploadResponse = await cloudinary.uploader.upload(videoUrl, {
                    folder: 'lms-assets/lessons',
                    resource_type: 'video',
                    eager: [
                        { quality: 'auto:low', format: 'mp4' },
                        { quality: 'auto:eco', format: 'mp4' }
                    ],
                    eager_async: true,
                    // eager_notification_url: 'https://lms-api.onrender.com/api/v1/cloudinary-notification',
                });
                videoUrl = uploadResponse.secure_url;
            }

            const resources = req.files.map(file => ({
                name: file.originalname,
                url: file.path
            }))
            const lesson = await Lesson.create({
                title,
                content,
                course,
                videoUrl,
                duration,
                resources
            });
            res.status(201).json(lesson);
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }

    static async updateLesson(req, res, next) {
        try {
            const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.status(200).json(lesson);
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }

    static async deleteLesson(req, res, next) {
        try {
            const lesson = await Lesson.findByIdAndDelete(req.params.id);
            res.status(200).json(lesson);
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }

    static async getLessonsByCourse(req, res, next) {
        try {
            const lessons = await Lesson.find({ course: req.params.id });
            res.status(200).json(lessons);
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }

    static async getLessonById(req, res, next) {
        try {
            const lesson = await Lesson.findById(req.params.id);
            res.status(200).json(lesson);
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }


}

module.exports = LessonController;