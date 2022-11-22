const jwt = require('jsonwebtoken')
const config = require('../config/app.json')
require('dotenv').config()

const createSecretKey = async (payload) => {
    const options = {
        expiresIn: parseInt(process.env.JWT_EXPIRE_TIME),
    }
    return jwt.sign(payload, config.tokenKey, options)
}
const createRefreshToken = async (payload) => {
    const options = {
        expiresIn: parseInt(process.env.JWT_REFRESH_EXPIRE_TIME),
    }
    return jwt.sign(payload, config.refreshTokenKey, options)
}
const isTokenExpired = async (token) => {
    return jwt.decode(token).exp < Date.now() / 1000
}
const verifyToken = async (token) => {
    try {
        const verify = jwt.decode(token, config.tokenKey)
        if (verify) {
            const isExpired = await isTokenExpired(token)
            if (isExpired) {
                return false
            }
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
