// controllers/teacherController.js

const db = require('../config/db');

// Create a new teacher
exports.createTeacher = (req, res) => {
    const { user_id } = req.body;
    const sql = 'INSERT INTO teachers (user_id) VALUES (?)';
    db.query(sql, [user_id], (err, result) => {
        if (err) {
            console.error('Database insert error:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.send('Teacher added...');
    });
};

// Get all teachers
exports.getAllTeachers = (req, res) => {
    const sql = 'SELECT * FROM teachers';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(results);
    });
};

// Get a teacher by ID
exports.getTeacherById = (req, res) => {
    const sql = `SELECT * FROM teachers WHERE teacher_id = ${req.params.id}`;
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(result);
    });
};

// Update a teacher
exports.updateTeacher = (req, res) => {
    const { id } = req.params;
    const { user_id } = req.body;
    const sql = `UPDATE teachers SET user_id = ? WHERE teacher_id = ?`;
    db.query(sql, [user_id, id], (err, result) => {
        if (err) {
            console.error('Database update error:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.send('Teacher updated...');
    });
};

// Delete a teacher
exports.deleteTeacher = (req, res) => {
    const sql = `DELETE FROM teachers WHERE teacher_id = ${req.params.id}`;
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Database delete error:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.send('Teacher deleted...');
    });
};
