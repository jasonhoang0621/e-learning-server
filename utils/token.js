const jwt = require('jsonwebtoken')
const config = require('../config/app.json')
require('dotenv').config()

const createSecretKey = async (payload) => {
    const options = {}
    return jwt.sign(payload, config.tokenKey, options)
}
const createRefreshToken = async (payload) => {
    const options = {}
    return jwt.sign(payload, config.refreshTokenKey, options)
}

const verifyToken = async (token) => {
    try {
        const verify = jwt.decode(token, config.tokenKey)
        if (verify) {
            return verify
        }
    } catch (e) {
        return false
    }
}
async function decodeToken(token) {
    return jwt.decode(token)
}
module.exports = {
    createSecretKey,
    verifyToken,
    createRefreshToken,
    decodeToken,
}
