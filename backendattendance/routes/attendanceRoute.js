const express = require('express');
const router = express.Router();
const attendanceController = require('../controller/attendanceController');
const auth = require('../middlewares/auth');

// Attendance routes
router.post('/set_attendance', attendanceController.create);
router.get('/', auth.authenticateToken, auth.isAdmin, attendanceController.getAll);
router.get('/:id', auth.authenticateToken, attendanceController.getById);
router.put('/:id', auth.authenticateToken, attendanceController.update);
router.delete('/:id', auth.authenticateToken, auth.isAdmin, attendanceController.delete);

module.exports = router;
