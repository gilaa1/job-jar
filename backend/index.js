const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const signupRouter = require('./controllers/signup');
const loginRouter = require('./controllers/login');
const logoutRouter = require('./controllers/logout');
const jobsRouter = require('./controllers/jobs');
const editProfileRouter = require('./controllers/editProfile');
const usersRouter = require('./controllers/users');

require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/api/signup', signupRouter);
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/editprofile', editProfileRouter);
app.use('/api/users', usersRouter);

const User = require('./models/user');
const jwt = require('jsonwebtoken');
const Job = require('./models/job');


mongoose.connect(process.env.MONGODB_CONNECTION_URL)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    });


app.get('/jobs', async (request, response) => {
    try {
        const page = parseInt(request.query.page) || 1;
        const limit = 10;
        const skipIndex = (page - 1) * limit;

        const totalJobs = await Job.countDocuments();
        const jobs = await Job.find().sort({ datePosted: -1 }).limit(limit).skip(skipIndex).exec();

        response.status(200).json({ jobs: jobs, totalJobs: totalJobs });

    } catch (error) {
        response.status(400).json({ error: error.message });
    }

    });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});