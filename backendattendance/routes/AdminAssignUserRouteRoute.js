const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminAssignedUser');
const auth = require('../middlewares/auth'); // Assuming you have middleware for authentication

// Only an admin can pre-register a user
router.post('/pre-register', auth.authenticateToken, auth.isAdmin, adminController.preRegisterUser);

module.exports = router;
