// app.js

const express = require('express');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/userRoute');
const adminRoutes = require('./routes/AdminAssignUserRouteRoute');
const teacherRoutes = require('./routes/teacherRoute');
const classRoutes = require('./routes/classRoute');
const subjectRoutes = require('./routes/subjectRoute');
const studentClassRoutes = require('./routes/studentClassRoute');
const classRoutineRoutes = require('./routes/classRoutineRoute');
const subjectTeacherRoutes = require('./routes/subjectTeacherRoute');
const attendanceRoutes = require('./routes/attendanceRoute');

const app = express();
const port = 8080;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/admin/admin', adminRoutes);
app.use('/admin/users', userRoutes);
app.use('/admin/teachers', teacherRoutes);
app.use('/admin/classroom', classRoutes); // Ensure /admin/classroom is protected
app.use('/admin/subjects', subjectRoutes);
app.use('/admin/all_teachers', subjectTeacherRoutes);
app.use('/admin/get_students', studentClassRoutes);
app.use('/admin/class-routines', classRoutineRoutes);
app.use('/admin/attendance', attendanceRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the CRUD app');
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
