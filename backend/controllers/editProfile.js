const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const editProfileRouter = require('express').Router()

editProfileRouter.put('/', async (request, response) => {
    try {
        const token = request.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }

        const { firstName, lastName, email, address } = request.body
        if (!firstName || !lastName || !email || !address) {
            return response.status(400).json({ error: 'missing fields' })
        }

        const user = await User.findByIdAndUpdate(decodedToken.id, { firstName, lastName, email, address }, { new: true })
        response.status(200).json({user: user})
    } catch (error) {
        response.status(400).json({ error: error.message })
    }
}
)

module.exports = editProfileRouter