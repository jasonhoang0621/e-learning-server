const jwt = require('../utils/token')
const database = require('../utils/database')
const chatCol = require('../dataModel/chatCol')
const messageCol = require('../dataModel/messageCol')
const e = require('express')
const ObjectID = require('mongodb').ObjectId

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
    socket.on('present', async (data) => {
        const token = socket.handshake.headers.token
        const user = await getUserInfo(token)
        const chat = await chatCol.findByPresentationId(data.presentationId)
        socket.on(`present-${data.presentationId}`, (data) => {
            socket.broadcast.emit(`present-${data.presentationId}`, data)
        })
        socket.on(`chat-${chat.id}`, async (data) => {
            const newMessage = {
                id: ObjectID().toString(),
                userId: user.id,
                message: data.message,
                chatId: chat.id,
            }
            const result = await messageCol.create(newMessage)
            if (!result) {
                socket.broadcast.emit(`chat-${chat.id}`, {
                    errorCode: true,
                    data: 'System error',
                })
            }
            socket.broadcast.emit(`chat-${chat.id}`, {
                errorCode: null,
                data: newMessage,
            })
        })
    })
    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
}
