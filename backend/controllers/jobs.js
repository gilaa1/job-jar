const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const jobsRouter = require('express').Router()
const Job = require('../models/job')

jobsRouter.get('/', async (request, response) => {
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

jobsRouter.post('/', async (request, response) => {
    try {
        const token = request.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.SECRET);
        if (!token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' });
        }

        console.log('data1: ' , request.body.data);
        console.log('user: ' , request.body.user);

        const { title, time, description, payment } = request.body.data;
        const user = request.body.user;
        console.log(user.address);


        if (!title || !time || !description || !payment) {
            return response.status(400).json({ error: 'missing fields' });
        }

        const job = new Job({ title : title , time : time, description : description, payment : payment, location: user.address, userId: user.id , datePosted: new Date() });
        console.log('job', job);

        const newJob = await job.save();

        response.status(201).json(newJob);
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});

jobsRouter.delete('/:id', async (request, response) => {
    try {
        const token = request.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.SECRET);
        if (!token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' });
        }

        const job = await Job.findById(request.params.id);
        if (!job) {
            return response.status(404).json({ error: 'job not found' });
        }
    
        if (job.userId !== decodedToken.id) {
            return response.status(401).json({ error: 'unauthorized' });
        }


        await job.deleteOne();

        response.status(204).end();
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
}
);

jobsRouter.put('/:id', async (request, response) => {
    try {
        const token = request.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.SECRET);
        if (!token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' });
        }

        const job = await Job.findById(request.params.id);
        if (!job) {
            return response.status(404).json({ error: 'job not found' });
        }

        if (job.userId.toString() !== decodedToken.id) {
            return response.status(401).json({ error: 'unauthorized' });
        }

        const { title, time, description, payment } = request.body;
        job.title = title;
        job.time = time;
        job.description = description;
        job.payment = payment;

        const updatedJob = await job.save();
        response.status(200).json(updatedJob);
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});

module.exports = jobsRouter;    