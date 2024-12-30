const jwt = require('jsonwebtoken');
const logoutRouter = require('express').Router();

logoutRouter.post('/', async (request, response) => {
    try {
        const token = request.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.SECRET);
        if (!token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' });
        }
        response.status(200).send({ message: 'Logged out' });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});

module.exports = logoutRouter;