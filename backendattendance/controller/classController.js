// controllers/classController.js

const db = require('../config/db');

// Create a new class entry
exports.createClass = (req, res) => {
    const { class_id, subject_id, user_email } = req.body;
    const sql = 'INSERT INTO classes (class_id, subject_id, user_email) VALUES (?, ?, ?)';
    db.query(sql, [class_id, subject_id, user_email], (err, result) => {
        if (err) {
            console.error('Database insert error:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.send('Class entry added...');
    });
};

// Get all class entries
exports.getAllClasses = (req, res) => {
    const sql = 'SELECT * FROM classes';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(results);
    });
};

// Get a class entry by ID
exports.getClassById = (req, res) => {
    const sql = `SELECT * FROM classes WHERE id = ${req.params.id}`;
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(result);
    });
};

// Update a class entry
exports.updateClass = (req, res) => {
    const { id } = req.params;
    const { class_id, subject_id, user_email } = req.body;
    const sql = `UPDATE classes SET class_id = ?, subject_id = ?, user_email = ? WHERE id = ?`;
    db.query(sql, [class_id, subject_id, user_email, id], (err, result) => {
        if (err) {
            console.error('Database update error:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.send('Class entry updated...');
    });
};

// Delete a class entry
exports.deleteClass = (req, res) => {
    const sql = `DELETE FROM classes WHERE id = ${req.params.id}`;
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Database delete error:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.send('Class entry deleted...');
    });
};
