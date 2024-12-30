const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    try {
        const users = await User.find({})
        response.json(users)
    } catch (error) {
        response.status(400).json({ error: error.message })
    }
    })
    
module.exports = usersRouter;




