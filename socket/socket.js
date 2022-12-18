const jwt = require('../utils/token')
const database = require('../utils/database')
const chatCol = require('../dataModel/chatCol')
const answerCol = require('../dataModel/answerCol')
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
        const presentation = await presentationCol.findOne(data.presentationId)
        const currentSlide = presentation.slide.filter(
            (item) => item.index === data.index
        )
        socket.broadcast.emit(`present-${data.presentationId}`, currentSlide)
    })
    socket.on('answer', async (data) => {
        const token = socket.handshake.headers.token
        const user = await getUserInfo(token)
        let presentation = await presentationCol.findOne(data.presentationId)
        if (!presentation) {
            socket.broadcast.emit(`answer-${data.presentationId}`, {
                errorCode: true,
                data: 'System error',
            })
        }
        const answer = {
            id: ObjectID().toString(),
            presentationId: data.presentationId,
            userId: user.id,
            choice: presentation.slide.answer[data.answerIndex],
            slideIndex: data.index,
            createdAt: new Date(),
        }
        const result = await answerCol.create(answer)
        presentation.map((item) => {
            if (item.index === data.index) {
                item.answer[data.answerIndex].amount += 1
            }
        })
        const currentSlide = presentation.slide.filter(
            (item) => item.index === data.index
        )
        await presentationCol.update(data.presentationId, presentation)
        socket.broadcast.emit(`answer-${data.presentationId}`, currentSlide)
    })
    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
}
