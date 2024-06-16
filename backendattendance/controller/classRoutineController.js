// controllers/classRoutineController.js

const db = require('../config/db');

// Create a new class routine entry
exports.createClassRoutine = (req, res) => {
    const { day_of_week, end_time, start_time, class_id, subject_id, user_email } = req.body;
    const sql = 'INSERT INTO class_routine (day_of_week, end_time, start_time, class_id, subject_id, user_email) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [day_of_week, end_time, start_time, class_id, subject_id, user_email], (err, result) => {
        if (err) {
            console.error('Database insert error:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.send('Class routine entry added...');
    });
};

// Get all class routine entries
exports.getAllClassRoutines = (req, res) => {
    const sql = 'SELECT * FROM class_routine';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(results);
    });
};

// Get a class routine entry by ID
exports.getClassRoutineById = (req, res) => {
    const sql = `SELECT * FROM class_routine WHERE class_routine_id = ${req.params.id}`;
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(result);
    });
};

// Update a class routine entry
exports.updateClassRoutine = (req, res) => {
    const { id } = req.params;
    const { day_of_week, end_time, start_time, class_id, subject_id, user_email } = req.body;
    const sql = `UPDATE class_routine SET day_of_week = ?, end_time = ?, start_time = ?, class_id = ?, subject_id = ?, user_email = ? WHERE class_routine_id = ?`;
    db.query(sql, [day_of_week, end_time, start_time, class_id, subject_id, user_email, id], (err, result) => {
        if (err) {
            console.error('Database update error:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.send('Class routine entry updated...');
    });
};

// Delete a class routine entry
exports.deleteClassRoutine = (req, res) => {
    const sql = `DELETE FROM class_routine WHERE class_routine_id = ${req.params.id}`;
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Database delete error:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.send('Class routine entry deleted...');
    });
};
