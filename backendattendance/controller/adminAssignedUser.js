const db = require('../config/db');

// Admin assigns a user
exports.preRegisterUser = (req, res) => {
    const { user_email, roll, user_role, class_id } = req.body;
    const sql = 'INSERT INTO admin_assigned_users (user_email, roll, user_role, class_id) VALUES (?, ?, ?, ?)';
    db.query(sql, [user_email, roll, user_role, class_id], (err, result) => {
        if (err) {
            console.error('Database insert error:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.send('User pre-registered by admin');
    });
};
