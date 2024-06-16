// controllers/studentClassController.js

const db = require('../config/db');

// Create a new student class entry
exports.createStudentClass = (req, res) => {
    const { roll_no, class_id, user_id } = req.body;
    const sql = 'INSERT INTO student_classes (roll_no, class_id, user_id) VALUES (?, ?, ?)';
    db.query(sql, [roll_no, class_id, user_id], (err, result) => {
        if (err) {
            console.error('Database insert error:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.send('Student class entry added...');
    });
};

// Get all student class entries
exports.getAllStudentClasses = (req, res) => {
    const sql = 'SELECT * FROM student_classes';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(results);
    });
};

// Get a student class entry by roll_no, class_id, and user_id
exports.getStudentClassById = (req, res) => {
    const { roll_no, class_id, user_id } = req.params;
    const sql = 'SELECT * FROM student_classes WHERE roll_no = ? AND class_id = ? AND user_id = ?';
    db.query(sql, [roll_no, class_id, user_id], (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(result);
    });
};

// Update a student class entry
exports.updateStudentClass = (req, res) => {
    const { roll_no, class_id, user_id } = req.params;
    const { new_roll_no, new_class_id, new_user_id } = req.body;
    const sql = 'UPDATE student_classes SET roll_no = ?, class_id = ?, user_id = ? WHERE roll_no = ? AND class_id = ? AND user_id = ?';
    db.query(sql, [new_roll_no, new_class_id, new_user_id, roll_no, class_id, user_id], (err, result) => {
        if (err) {
            console.error('Database update error:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.send('Student class entry updated...');
    });
};

// Delete a student class entry
exports.deleteStudentClass = (req, res) => {
    const { roll_no, class_id, user_id } = req.params;
    const sql = 'DELETE FROM student_classes WHERE roll_no = ? AND class_id = ? AND user_id = ?';
    db.query(sql, [roll_no, class_id, user_id], (err, result) => {
        if (err) {
            console.error('Database delete error:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.send('Student class entry deleted...');
    });
};
