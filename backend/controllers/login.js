const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');


loginRouter.post('/', async (request, response) => {
    try {

        const { email, password } = request.body;
    
        if (!email || !password) {
            return response.status(400).json({ error: 'missing fields' });
        }
    
        const user = await User.findOne({ email: email });
        if (!user) {
            return response.status(401).json({ error: 'user does not exist' });
        }
    
        const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
        if (!passwordCorrect) {
            return response.status(401).json({ error: 'incorrect password' });
        }
    
        const userForToken = {
            email: user.email,
            id: user._id
        };

        const token = jwt.sign(userForToken, process.env.SECRET);
    
        response.status(200).send({ Authorization: token, user: user });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
    });

module.exports = loginRouter;