const jwt = require('jsonwebtoken')

const generateAccessToken  = (uid, isAdmin) => jwt.sign({_id: uid, isAdmin}, process.env.JWT_SECRET_KEY, { expiresIn: '2d' })

module.exports = generateAccessToken