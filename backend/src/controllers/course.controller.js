const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const { ApiError } = require('../utils/api-error');
const logger = require('../utils/logger.util');
class CourseController {

    static async createCourse(req, res) {
        try {
            logger.info(`Course created for user: ${req.user._id}`);
            const courseData = req.body;
            console.log("courseData: ", courseData);

            // Nếu tags là chuỗi, tách nó thành mảng
            if (req.body.tags && typeof req.body.tags === 'string') {
                req.body.tags = req.body.tags.split(',');
            }

            // Kiểm tra xem có file ảnh bìa gửi lên không
            let coverImageUrl = null;
            if (req.file) {
                // Tải ảnh lên Cloudinary
                const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'lms-assets/courses',  // Bạn có thể tùy chỉnh thư mục trong Cloudinary
                    transformation: [{ width: 800, height: 600, crop: 'fill' }]  // Chỉnh sửa kích thước ảnh nếu cần
                });
                coverImageUrl = uploadResult.secure_url;  // Lấy URL ảnh đã tải lên
            }

            // Tạo khóa học
            const newCourse = new Course({
                ...courseData,
                coverImage: coverImageUrl,
                instructor: req.user._id
            });
            await newCourse.save();
            res.status(201).json(newCourse);
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }

    static async createCourseWithLessons(req, res, next) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            logger.info(`Starting course creation for user: ${req.user._id}`);
            const {
                name, description, category, level, price, tags,
                lessons: lessonsData,
                ...otherCourseData
            } = req.body;

            const files = req.files;

            let processedTags = [];
            if (tags) {
                processedTags = typeof tags === 'string'
                    ? tags.split(',').map(tag => tag.trim())
                    : Array.isArray(tags) ? tags : [];
            }

            // Handle cover image upload
            let coverImageUrl = null;
            if (req.file) {
                const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'lms-assets/courses',
                    transformation: [{ width: 800, height: 600, crop: 'fill' }]
                });
                coverImageUrl = uploadResult.secure_url;
                fs.unlinkSync(req.file.path); // Cleanup uploaded file
            }

            // 1. Create course
            const courseData = {
                name,
                description,
                category,
                level,
                price: Number(price),
                tags: processedTags,
                coverImage: coverImageUrl,
                instructor: req.user._id,
                ...otherCourseData
            };

            // Log processed course data
            console.log("Processed course data:", JSON.stringify(courseData, null, 2));

            const course = await Course.create([courseData], { session });

            if (!lessonsData || !Array.isArray(lessonsData)) {
                throw new Error('Lessons data must be an array');
            }

            if (lessonsData.length === 0) {
                throw new Error('At least one lesson is required');
            }

            // 2. Process and create lessons
            const processedLessons = await Promise.all(lessonsData.map(async (lessonData, index) => {
                // Validate required lesson fields
                if (!lessonData.title || !lessonData.content) {
                    throw new Error(`Missing required fields for lesson ${index + 1}`);
                }

                // Handle video upload if exists
                let videoUrl = null;
                if (files && files.length) {
                    const videoFile = files.find(f => f.originalname === lessonData.fileName);
                    if (videoFile) {
                        const uploadResponse = await cloudinary.uploader.upload(videoFile.path, {
                            folder: 'lms-assets/lessons',
                            resource_type: 'video',
                            eager: [
                                { quality: 'auto:low', format: 'mp4' },
                                { quality: 'auto:eco', format: 'mp4' }
                            ],
                            eager_async: true
                        });
                        videoUrl = uploadResponse.secure_url;
                        fs.unlinkSync(videoFile.path); // Cleanup uploaded file
                    }
                }

                // Process resources if they exist
                const resources = lessonData.resources?.map(resource => ({
                    name: resource.name,
                    url: resource.url
                })) || [];

                return {
                    title: lessonData.title,
                    content: lessonData.content,
                    course: course[0]._id,
                    videoUrl: videoUrl || lessonData.videoUrl,
                    duration: lessonData.duration || 0,
                    order: lessonData.order || index + 1,
                    resources: resources,
                    isPreview: lessonData.isPreview || false
                };
            }));

            // 3. Create lessons
            const createdLessons = await Lesson.insertMany(processedLessons, { session });

            // 4. Update course with lesson references
            await Course.findByIdAndUpdate(
                course[0]._id,
                {
                    $push: {
                        lessons: {
                            $each: createdLessons.map(lesson => lesson._id)
                        }
                    }
                },
                { session }
            );

            // 5. Commit transaction
            await session.commitTransaction();

            // 6. Return response
            res.status(201).json({
                success: true,
                data: {
                    course: await Course.findById(course[0]._id)
                        .populate('lessons')
                        .lean(),
                    lessons: createdLessons
                }
            });

        } catch (error) {
            // Rollback if error occurs
            await session.abortTransaction();

            // Cleanup any remaining files
            if (req.files) {
                req.files.forEach(file => {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                });
            }

            next(new ApiError(400, error.message));
        } finally {
            session.endSession();
        }
    }

    static async updateCourse(req, res) {
        try {
            const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.status(200).json(course);
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }

    static async deleteCourse(req, res) {
        try {
            const course = await Course.findByIdAndDelete(req.params.id);
            res.status(200).json(course);
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }


    static async getAllCourses(req, res) {
        try {
            // Kiểm tra vai trò của người dùng
            const user = req.user;

            let courses;
            if (user.role === 'admin') {
                // Admin có quyền lấy tất cả khóa học
                courses = await Course.find();
            } else if (user.role === 'instructor') {
                // Instructor chỉ có thể lấy các khóa học do họ tạo
                courses = await Course.find({ createdBy: user._id });
            } else if (user.role === 'student') {
                // Sinh viên chỉ có thể lấy các khóa học mà họ đã đăng ký
                courses = await Course.find({ _id: { $in: user.enrolledCourses } });
            } else {
                return res.status(403).json({ message: 'Quyền truy cập không hợp lệ' });
            }

            res.status(200).json(courses);
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }

    static async getCourseById(req, res) {
        try {
            const courseId = req.params.id;
            const user = req.user;

            // Tìm khóa học
            const course = await Course.findById(courseId);

            if (!course) {
                return res.status(404).json({ message: 'Khóa học không tồn tại' });
            }

            // Kiểm tra quyền truy cập vào khóa học
            if (user.role === 'admin') {
                return res.status(200).json(course); // Admin có thể xem tất cả
            }

            if (user.role === 'instructor' && course.instructor.equals(user._id)) {
                return res.status(200).json(course); // Instructor chỉ có thể xem khóa học của mình
            }

            if (user.role === 'student' && user.enrolledCourses.includes(course._id)) {
                return res.status(200).json(course); // Sinh viên chỉ có thể xem khóa học họ đã đăng ký
            }

            return res.status(403).json({ message: 'Quyền truy cập không hợp lệ' });
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }

    static async updateCourse(req, res) {
        try {
            const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.status(200).json(course);
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }

    static async deleteCourse(req, res) {
        try {
            const course = await Course.findByIdAndDelete(req.params.id);
            res.status(200).json(course);
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }

    static async searchCourses(req, res) {
        try {
            const courses = await Course.find({
                $or: [
                    { name: { $regex: req.query.name, $options: 'i' } },
                    { description: { $regex: req.query.description, $options: 'i' } },
                ],
            });
            res.status(200).json(courses);
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }
}

module.exports = CourseController;