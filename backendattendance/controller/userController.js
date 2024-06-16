const db = require('../config/db');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'khatribikramarun@gmail.com',
        pass: 'xvbgqkbdwcdzgrel'
    }
});

// Admin assigns a student
exports.assignStudent = (req, res) => {
    const { email, role } = req.body;
    const sql = 'UPDATE users SET is_assigned = true WHERE email = ? AND role = ?';
    db.query(sql, [email, role], (err, result) => {
        if (err) {
            console.error('Database update error:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (result.affectedRows === 0) {
            return res.status(400).send('No user found to assign');
        }
        const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
        const sqlOtp = 'UPDATE users SET otp = ? WHERE email = ?';
        db.query(sqlOtp, [otp, email], (err, result) => {
            if (err) {
                console.error('Database OTP update error:', err);
                return res.status(500).send('Internal Server Error');
            }
            const mailOptions = {
                from: 'khatribikramarun@gmail.com',
                to: email,
                subject: 'OTP for Registration',
                text: `Your OTP is ${otp}`
            };
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error('Error sending OTP email:', err);
                    return res.status(500).send('Error sending OTP email');
                }
                console.log('OTP sent: ' + info.response);
                res.send('OTP sent to email');
            });
        });
    });
};

// Register User (pre-approved by admin)
exports.registerUser = (req, res) => {
    const { email, role, roll, class_id } = req.body;

    // Check if the user is in the admin_assigned_users table
    const sqlCheck = 'SELECT * FROM admin_assigned_users WHERE user_email = ?';
    db.query(sqlCheck, [email], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length === 0) {
            return res.status(400).send('User is not authorized to register');
        }

        // Proceed with registration if user is found in admin_assigned_users
        const defaultPassword = 'defaultPassword';
        const hashedPassword = bcrypt.hashSync(defaultPassword, 8);
        const sql = 'INSERT INTO users (email, password, role, roll, class_id) VALUES (?, ?, ?, ?, ?)';
        db.query(sql, [email, hashedPassword, role, roll, class_id], (err, result) => {
            if (err) {
                console.error('Database insert error:', err);
                return res.status(500).send('Internal Server Error');
            }

            // Send OTP
            const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
            const sqlOtp = 'UPDATE users SET otp = ? WHERE email = ?';
            db.query(sqlOtp, [otp, email], (err, result) => {
                if (err) {
                    console.error('Database OTP update error:', err);
                    return res.status(500).send('Internal Server Error');
                }
                const mailOptions = {
                    from: 'khatribikramarun@gmail.com',
                    to: email,
                    subject: 'OTP for Registration',
                    text: `Your OTP is ${otp}`
                };
                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.error('Error sending OTP email:', err);
                        return res.status(500).send('Error sending OTP email');
                    }
                    console.log('OTP sent: ' + info.response);
                    res.send('User registered, OTP sent to email');
                });
            });
        });
    });
};

// Verify OTP
exports.verifyOtp = (req, res) => {
    const { email, otp } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ? AND otp = ?';
    db.query(sql, [email, otp], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length > 0) {
            const hashedPassword = bcrypt.hashSync('defaultPassword', 8);
            const sqlUpdate = 'UPDATE users SET is_verified = true, password = ?, otp = NULL WHERE email = ?';
            db.query(sqlUpdate, [hashedPassword, email], (err, result) => {
                if (err) {
                    console.error('Database update error:', err);
                    return res.status(500).send('Internal Server Error');
                }
                res.send('User verified, please login with the default password');
            });
        } else {
            res.status(400).send('Invalid OTP');
        }
    });
};

// Login User
exports.loginUser = (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length > 0) {
            const user = results[0];
            console.log('User found:', user);
            const passwordMatch = bcrypt.compareSync(password, user.password);
            console.log('Password match:', passwordMatch);
            if (passwordMatch) {
                if (user.is_verified) {
                    const token = jwt.sign({ id: user.user_id, role: user.role }, 'secret', { expiresIn: '1h' });
                    res.json({ token });
                } else {
                    res.status(400).send('User not verified');
                }
            } else {
                console.log('Invalid password. Provided:', password, 'Expected:', user.password);
                res.status(400).send('Invalid password');
            }
        } else {
            res.status(400).send('User not found');
        }
    });
};

// Access Dashboard
exports.dashboard = (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    jwt.verify(token, 'secret', (err, decoded) => {
        if (err) return res.status(401).send('Unauthorized');
        res.send('Welcome to the dashboard');
    });
};
