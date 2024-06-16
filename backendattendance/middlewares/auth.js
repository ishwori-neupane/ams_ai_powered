// middlewares/auth.js

const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).send('Access Denied. No token provided.');

    jwt.verify(token, 'secret', (err, user) => {
        if (err) return res.status(403).send('Invalid token.');
        req.user = user;
        next();
    });
};

exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).send('Access Denied. Admins only.');
    next();
};

exports.isUser = (req, res, next) => {
    if (req.user.id !== parseInt(req.params.id)) return res.status(403).send('Access Denied.');
    next();
};
