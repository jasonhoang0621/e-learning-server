const jwt = require('../utils/token')
const database = require('../utils/database')

const getUserInfo = async (token) => {
    const verify = await jwt.verifyToken(token)
    let user = []
    user = await database.userModel().find({ email: verify?.email }).toArray()

    if (user.length == 0 || user.length > 1) {
        return null
    }
    return user[0]
}
module.exports = (socket) => {
    socket.on('chatInit', async (data) => {
        const token = socket.handshake.headers.token
        const user = await getUserInfo(token)
        console.log('token ne ', token)
        console.log('data ne ', user)
    })
    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
}
