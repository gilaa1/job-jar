const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    location: { type: String, required: true },
    payment: { type: Number, required: true },
    description: { type: String, required: true },
    datePosted: { type: Date, required: true },
    time: { type: String, required: true },
    userId : { type: String, required: true }
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;