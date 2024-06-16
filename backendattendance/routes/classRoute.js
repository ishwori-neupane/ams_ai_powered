// routes/classRoute.js

const express = require('express');
const router = express.Router();
const classController = require('../controller/classController');
const auth = require('../middlewares/auth');

router.post('/', auth.authenticateToken, auth.isAdmin, classController.createClass);
router.get('/', auth.authenticateToken, auth.isAdmin, classController.getAllClasses);
router.get('/:id', auth.authenticateToken, auth.isAdmin, classController.getClassById);
router.put('/:id', auth.authenticateToken, auth.isAdmin, classController.updateClass);
router.delete('/:id', auth.authenticateToken, auth.isAdmin, classController.deleteClass);

module.exports = router;
