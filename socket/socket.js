const jwt = require('../utils/token')
const database = require('../utils/database')
const chatCol = require('../dataModel/chatCol')
const messageCol = require('../dataModel/messageCol')
const presentationCol = require('../dataModel/presentationCol')
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
        const presentation = await presentationCol.findOne(data.presentationId)
        console.log(presentation)
        socket.on(`present-${data.presentationId}`, (data) => {
            console.log(data)
            socket.broadcast.emit(`present-${data.presentationId}`, data)
        })
        socket.on(`chat-${data.presentationId}`, async (data) => {
            const newMessage = {
                id: ObjectID().toString(),
                userId: user.id,
                message: data.message,
                chatId: chat.id,
            }
            const result = await messageCol.create(newMessage)
            if (!result) {
                socket.broadcast.emit(`chat-${data.presentationId}`, {
                    errorCode: true,
                    data: 'System error',
                })
            }
            socket.broadcast.emit(`chat-${data.presentationId}`, {
                errorCode: null,
                data: newMessage,
            })
        })
    })
    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
}
