// routes/classRoutineRoutes.js

const express = require('express');
const router = express.Router();
const classRoutineController = require('../controller/classRoutineController');

router.post('/', classRoutineController.createClassRoutine);
router.get('/', classRoutineController.getAllClassRoutines);
router.get('/:id', classRoutineController.getClassRoutineById);
router.put('/:id', classRoutineController.updateClassRoutine);
router.delete('/:id', classRoutineController.deleteClassRoutine);

module.exports = router;
