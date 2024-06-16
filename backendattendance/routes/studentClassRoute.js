// routes/studentClassRoutes.js

const express = require('express');
const router = express.Router();
const studentClassController = require('../controller/studentClassController');

router.post('/', studentClassController.createStudentClass);
router.get('/', studentClassController.getAllStudentClasses);
router.get('/:roll_no/:class_id/:user_id', studentClassController.getStudentClassById);
router.put('/:roll_no/:class_id/:user_id', studentClassController.updateStudentClass);
router.delete('/:roll_no/:class_id/:user_id', studentClassController.deleteStudentClass);

module.exports = router;
