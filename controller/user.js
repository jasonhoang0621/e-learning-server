const userCol = require('../dataModel/userCol')
const database = require('../utils/database')
const jwt = require('../utils/token')
const bcrypt = require('bcrypt')
const ObjectID = require('mongodb').ObjectId
const emailCol = require('../utils/email.js')
const saltRounds = 10
async function login(req, res) {
    try {
        const user = await database
            .userModel()
            .findOne({ email: req.body.email, loginService: false })
        if (!user) {
            return res
                .status(400)
                .json({ errorCode: true, data: 'Wrong email or password' })
        }
        const checkPass = await bcrypt.compare(req.body.password, user.password)
        if (!checkPass) {
            return res
                .status(400)
                .json({ errorCode: true, data: 'Wrong email or password' })
        }
        user.token = await jwt.createSecretKey({ email: req.body.email })
        user.refreshToken = await jwt.createRefreshToken({
            email: req.body.email,
        })
        await database
            .userModel()
            .updateOne(
                { email: req.body.email },
                { $set: { refreshToken: user.refreshToken } }
            )
        delete user.password
        return res.json({ errorCode: null, data: user })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ errorCode: true, data: error })
    }
}
async function register(req, res) {
    try {
        const validation = req.body
        for (property of userCol.validation) {
            if (validation[property] === null || validation[property] === '') {
                return res
                    .res(400)
                    .json({ errorCode: true, data: `Lack of ${property}` })
            }
        }
        const user = await database
            .userModel()
            .findOne({ email: req.body.email })
        if (user) {
            return res
                .status(400)
                .json({ errorCode: true, data: 'Existing email' })
        }
        if (req.body.rePassword) {
            const checkPass = req.body.password == req.body.rePassword
            if (!checkPass) {
                return res
                    .res(400)
                    .json({ errorCode: true, data: 'Wrong retype password' })
            }
        }
        const password = await bcrypt.hash(req.body.password, saltRounds)
        const data = {
            id: ObjectID().toString(),
            name: req.body.name,
            email: req.body.email,
            password: password,
            createdAt: new Date(),
            loginService: false,
            email_verified: false,
        }
        await userCol.create(data)
        delete data.password
        const resultEmail = await emailCol.sendEmail(data.email)
        if (!resultEmail) {
            return res.json({ errorCode: true, data: 'Error send email' })
        }
        return res.json({ errorCode: null, data: data })
    } catch (error) {
        return res.status(400).json({ errorCode: true, data: 'System error' })
    }
}

async function profile(req, res) {
    try {
        const user = await database
            .userModel()
            .findOne({ email: req.user.email })
        if (!user) {
            return res.status(401).json({ errorCode: true, data: 'No User' })
        }
        delete user.password
        return res.json({ errorCode: null, data: user })
    } catch (error) {
        return res.status(400).json({ errorCode: true, data: error })
    }
}

async function refreshToken(req, res) {
    try {
        const user = await database.userModel().findOne({
            email: req.body.email,
            refreshToken: req.body.refreshToken,
        })
        if (!user) {
            return res.status(401).json({ errorCode: true, data: 'No User' })
        }
        user.token = await jwt.createSecretKey({ email: req.body.email })
        user.refreshToken = await jwt.createRefreshToken({
            email: req.body.email,
        })
        delete user.password
        await database
            .userModel()
            .updateOne(
                { email: req.body.email },
                { $set: { refreshToken: user.refreshToken } }
            )
        return res.json({ errorCode: null, data: user })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ errorCode: true, data: error })
    }
}

async function userAuthentication(req, res, next) {
    try {
        let token = req.headers['authorization']
        if (!token) {
            return res.status(401).json({
                errorCode: true,
                data: 'No token provided',
            })
        }

        let verify = false
        try {
            verify = await jwt.verifyToken(token)
        } catch (e) {
            res.status(401)
            return res.json({
                errorCode: true,
                data: 'Invalid token',
            })
        }
        if (!verify) {
            return res.status(403).json({
                errorCode: true,
                data: 'Expired token',
            })
        }

        let user = []
        user = await database
            .userModel()
            .find({ email: verify?.email })
            .toArray()

        if (user.length == 0 || user.length > 1) {
            return res.status(401).json({
                errorCode: true,
                data: 'No user found',
            })
        }

        req.user = (({ id, email }) => ({
            id,
            email,
        }))(user[0])

        return next()
    } catch (error) {
        return res.json({ errorCode: true, data: 'system error' })
    }
}
const googleOauth = async (req, res) => {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
    const options = {
        redirect_uri: process.env.GOOGLE_REDIRECT,
        client_id: process.env.GOOGLE_CLIENT_ID,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
        ].join(' '),
    }
    const qs = new URLSearchParams(options)
    return res.redirect(`${rootUrl}?${qs.toString()}`)
}
const verifyGoogle = async (req, res) => {
    try {
        const code = req.query.code
        const data = await userCol.getGoogleToken(code)
        const googleUser = await jwt.decodeToken(data.id_token)
        let user = await userCol.findOne(googleUser.email)
        if (!user) {
            let data = {
                id: ObjectID().toString(),
                name: googleUser.name,
                email: googleUser.email,
                password: null,
                createdAt: new Date(),
                loginService: false,
                email_verified: true,
            }
            await userCol.create(data)
            data.token = await jwt.createSecretKey({ email: googleUser.email })
            data.refreshToken = await jwt.createRefreshToken({
                email: googleUser.email,
            })
            delete data.password
            await database
                .userModel()
                .updateOne(
                    { email: googleUser.email },
                    { $set: { refreshToken: data.refreshToken } }
                )
            return res.json({ errorCode: null, data: data })
        }
        user.token = await jwt.createSecretKey({ email: googleUser.email })
        user.refreshToken = await jwt.createRefreshToken({
            email: googleUser.email,
        })
        delete user.password
        await database
            .userModel()
            .updateOne(
                { email: googleUser.email },
                { $set: { refreshToken: user.refreshToken } }
            )
        return res.json({ errorCode: null, data: user })
    } catch (error) {
        return res.redirect('http://localhost:4000/')
    }
}
const verifyEmail = async (req, res) => {
    const email = req.params.code
    console.log(email)
    const user = await userCol.updateStatus(email)
    return res.redirect('http://localhost:4000/')
}
module.exports = {
    login,
    register,
    profile,
    refreshToken,
    userAuthentication,
    googleOauth,
    verifyGoogle,
    verifyEmail,
}
