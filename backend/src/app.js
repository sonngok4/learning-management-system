// Config express, middleware, and routes
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectMongoDB = require('./config/database.config');
const { configureCloudinary } = require('./config/cloudinary.config')
const app = express();

// Kết nối MongoDB
console.log('MongoDB trying to connect...');
connectMongoDB();

// Kết nối Cloudinary
console.log('Cloudinary trying to connect...');
configureCloudinary();


// Middleware
// CORS
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
    const oldJson = res.json;
    res.json = function (data) {
        console.log('Response data:', data);
        return oldJson.call(this, data);
    };
    next();
});

const {
    errorHandler,
    notFoundHandler,
    apiLimiter,
    requestLogger,
} = require('./middlewares/error.middleware');

// Apply middleware
app.use(requestLogger);

// Apply rate limiter
app.use("/api", apiLimiter);


// Routes
const index = require('./routes/index.routes')
const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/user.routes')
const documentRoutes = require('./routes/document.routes')
const courseRoutes = require('./routes/course.routes')
// const lessonRoutes = require('./routes/lesson.routes')
// const assignmentRoutes = require('./routes/assignment.routes')


// Routes
app.use("/", index)
app.use('/api/auth', authRoutes);
app.use("/api/users", userRoutes)
app.use("/api/courses", courseRoutes)
app.use('/api/documents', documentRoutes);
// app.use('/api/lessons', lessonRoutes);
// app.use('/api/assignments', assignmentRoutes);



// Apply error handling
app.use(notFoundHandler);
app.use(errorHandler);


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});


module.exports = app;
