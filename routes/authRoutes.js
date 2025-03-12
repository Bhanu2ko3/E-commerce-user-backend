const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController'); // Controllers import
const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
    try {
        await registerUser(req, res); // Call the register function from the controller
    } catch (error) {
        console.error('Error in /register route:', error.message);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        await loginUser(req, res); // Call the login function from the controller
    } catch (error) {
        console.error('Error in /login route:', error.message);
        res.status(500).json({ error: 'Server error during login' });
    }
});

module.exports = router;
