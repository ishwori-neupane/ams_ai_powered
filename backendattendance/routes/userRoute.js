const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const auth = require('../middlewares/auth');

// User routes
router.post('/register', userController.registerUser);
router.post('/assign', auth.authenticateToken, auth.isAdmin, userController.assignStudent);
router.post('/verify-otp', userController.verifyOtp);
router.post('/login', userController.loginUser);
router.get('/dashboard', auth.authenticateToken, userController.dashboard);

module.exports = router;
