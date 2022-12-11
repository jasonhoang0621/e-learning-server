const jwt = require('../utils/token')
const database = require('../utils/database')
const chatCol = require('../dataModel/chatCol')
const messageCol = require('../dataModel/messageCol')
const presentationCol = require('../dataModel/presentationCol')
const e = require('express')
const ObjectID = require('mongodb').ObjectId

const getUserInfo = async (token) => {
    try {
        const verify = await jwt.verifyToken(token)
        let user = []
        user = await database
            .userModel()
            .find({ email: verify?.email })
            .toArray()

        if (user.length == 0 || user.length > 1) {
            return null
        }
        return user[0]
    } catch (error) {
        return null
    }
}
module.exports = (socket) => {
    // socket.on('initPresent', async (data) => {
    //     const token = socket.handshake.headers.token
    //     const user = await getUserInfo(token)
    //     if (!user) {
    //         socket.emit('present', {
    //             errorCode: true,
    //             data: 'System error',
    //         })
    //         return
    //     }

    //     socket.join(`present-${data.presentationId}`, () => {
    //         console.log('client joined the room')
    //     })
    //     // join the client to the "chat" room
    //     socket.join(`chat-${data.presentationId}`, () => {
    //         console.log('client joined the chat room')
    //     })
    // })
    socket.on('chat', async (data) => {
        const token = socket.handshake.headers.token
        const user = await getUserInfo(token)
        const chat = await chatCol.findByPresentationId(data.presentationId)
        let newMessage = {
            id: ObjectID().toString(),
            userId: user.id,
            message: data.message,
            chatId: chat.id,
            createdAt: new Date(),
        }
        const result = await messageCol.create(newMessage)
        delete user.password
        delete user.refreshToken
        newMessage.user = [user]
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
    socket.on('present', async (data) => {
        console.log('present', data)
        const presentation = await presentationCol.findOne(data.presentationId)
        const currentSlide = presentation.slide.filter(
            (item) => item.index === data.index
        )
        socket.broadcast.emit(`present-${data.presentationId}`, currentSlide)
    })
    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
}
