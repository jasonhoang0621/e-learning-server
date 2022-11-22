const database = require('../utils/database')
const userProperties = ['email', 'password', 'refreshToken']
const validation = ['email', 'password']
const qs = require('querystring')
const { default: axios } = require('axios')
async function create(data) {
    return await database.userModel().insertOne(data)
}

async function getDetailByEmail(email) {
    const result = await database.userModel().find({ email }).toArray()
    return result[0]
}

async function getGoogleToken(code) {
    const url = 'https://oauth2.googleapis.com/token'
    const values = {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT,
        grant_type: 'authorization_code',
    }
    try {
        const res = await axios.post(url, qs.stringify(values), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
        return res.data
    } catch (error) {
        return null
    }
}
async function findOne(email) {
    return await database.userModel().findOne({ email: email })
}
module.exports = {
    create,
    getDetailByEmail,
    validation,
    userProperties,
    getGoogleToken,
    findOne,
}
