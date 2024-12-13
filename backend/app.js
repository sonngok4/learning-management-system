// Config express, middleware, and routes
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

module.exports = app;
