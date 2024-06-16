const db = require('../config/db');

// Create teacher subject
exports.create = (req, res) => {
    const teacherSubject = req.body;
    const sql = 'INSERT INTO teacher_subjects SET ?';
    db.query(sql, teacherSubject, (err, result) => {
        if (err) throw err;
        res.send('Teacher subject record added...');
    });
};

// Get all teacher subjects
exports.getAll = (req, res) => {
    const sql = 'SELECT * FROM teacher_subjects';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
};

// Get teacher subject by ID
exports.getById = (req, res) => {
    const sql = 'SELECT * FROM teacher_subjects WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
};

// Update teacher subject
exports.update = (req, res) => {
    const sql = 'UPDATE teacher_subjects SET ? WHERE id = ?';
    db.query(sql, [req.body, req.params.id], (err, result) => {
        if (err) throw err;
        res.send('Teacher subject record updated...');
    });
};

// Delete teacher subject
exports.delete = (req, res) => {
    const sql = 'DELETE FROM teacher_subjects WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.send('Teacher subject record deleted...');
    });
};
