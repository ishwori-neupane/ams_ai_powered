// controllers/subjectController.js

const db = require('../config/db');

// Create a new subject
exports.createSubject = (req, res) => {
    const { credit_hours, name, short_name } = req.body;
    const sql = 'INSERT INTO subjects (credit_hours, name, short_name) VALUES (?, ?, ?)';
    db.query(sql, [credit_hours, name, short_name], (err, result) => {
        if (err) {
            console.error('Database insert error:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.send('Subject added...');
    });
};

// Get all subjects
exports.getAllSubjects = (req, res) => {
    const sql = 'SELECT * FROM subjects';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(results);
    });
};

// Get a subject by ID
exports.getSubjectById = (req, res) => {
    const sql = `SELECT * FROM subjects WHERE subject_id = ${req.params.id}`;
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(result);
    });
};

// Update a subject
exports.updateSubject = (req, res) => {
    const { id } = req.params;
    const { credit_hours, name, short_name } = req.body;
    const sql = `UPDATE subjects SET credit_hours = ?, name = ?, short_name = ? WHERE subject_id = ?`;
    db.query(sql, [credit_hours, name, short_name, id], (err, result) => {
        if (err) {
            console.error('Database update error:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.send('Subject updated...');
    });
};

// Delete a subject
exports.deleteSubject = (req, res) => {
    const sql = `DELETE FROM subjects WHERE subject_id = ${req.params.id}`;
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Database delete error:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.send('Subject deleted...');
    });
};
