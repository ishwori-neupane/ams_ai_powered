const express = require('express');
const router = express.Router();
const teacherSubjectsController = require('../controller/subjectTeacherController');

router.post('/', teacherSubjectsController.create);
router.get('/', teacherSubjectsController.getAll);
router.get('/:id', teacherSubjectsController.getById);
router.put('/:id', teacherSubjectsController.update);
router.delete('/:id', teacherSubjectsController.delete);

module.exports = router;
