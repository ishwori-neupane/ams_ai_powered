const db = require('../config/db');

// Create attendance
exports.create = (req, res) => {
    const attendance = req.body;
    const sql = 'INSERT INTO attendance SET ?';
    db.query(sql, attendance, (err, result) => {
        if (err) throw err;
        res.send('Attendance record added...');
    });
};

// Get all attendance
exports.getAll = (req, res) => {
    const sql = 'SELECT * FROM attendance';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
};

// Get attendance by ID
exports.getById = (req, res) => {
    const sql = 'SELECT * FROM attendance WHERE attendance_id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
};

// Update attendance
exports.update = (req, res) => {
    const sql = 'UPDATE attendance SET ? WHERE attendance_id = ?';
    db.query(sql, [req.body, req.params.id], (err, result) => {
        if (err) throw err;
        res.send('Attendance record updated...');
    });
};

// Delete attendance
exports.delete = (req, res) => {
    const sql = 'DELETE FROM attendance WHERE attendance_id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.send('Attendance record deleted...');
    });
};
