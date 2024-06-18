const db = require('../config/db');

// Create attendance
exports.create = (req, res) => {
    const { roll_number, date } = req.body;

    // Check if the attendance record already exists for the given roll number and date
    const checkSql = 'SELECT * FROM attendance WHERE roll_number = ? AND date = ?';
    db.query(checkSql, [roll_number, date], (err, results) => {
        if (err) {
            res.status(500).send('Database query error');
            throw err;
        }

        if (results.length > 0) {
            // Record already exists for the given roll number and date
            res.status(200).send('Attendance record for this roll number on this date already exists');
        } else {
            // Insert new attendance record
            const sql = 'INSERT INTO attendance SET ?';
            db.query(sql, req.body, (err, result) => {
                if (err) {
                    res.status(500).send('Database insert error');
                    throw err;
                }
                res.status(201).send('Attendance record added...');
            });
        }
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
