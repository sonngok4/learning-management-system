const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    console.log('Welcome to the API!');
    res.status(200).json({ message: 'Welcome to the API!' });
});

module.exports = router;