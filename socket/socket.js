const jwt = require('../utils/token')
const database = require('../utils/database')
const chatCol = require('../dataModel/chatCol')
const answerCol = require('../dataModel/answerCol')
const messageCol = require('../dataModel/messageCol')
const questionCol = require('../dataModel/questionCol')
const presentationCol = require('../dataModel/presentationCol')
const groupCol = require('../dataModel/groupCol')
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
module.exports = (socket, io) => {
    socket.on('presentStatus', async (data) => {
        const presentation = await presentationCol.findOne(data.presentationId)
        socket.broadcast.emit(`presentStatus-${data.presentationId}`, {
            status: data.status, //true = present, false = stop
            data: presentation,
        })
    })
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
    socket.on('question', async (data) => {
        const token = socket.handshake.headers.token
        const user = await getUserInfo(token)

        let newQuestion = {
            id: ObjectID().toString(),
            userId: user.id,
            presentationId: data.presentationId,
            userName: user.name,
            question: data.question,
            answer: [],
            upVote: [],
            isLock: false,
            createdAt: new Date(),
        }
        const result = await questionCol.create(newQuestion)
        if (!result) {
            io.emit(`question-${data.presentationId}`, {
                errorCode: true,
                data: 'System error',
            })
        }
        io.emit(`question-${data.presentationId}`, {
            errorCode: null,
            data: newQuestion,
        })
    })
    socket.on('present', async (data) => {
        const presentation = await presentationCol.findOne(data.presentationId)
        const currentSlide = presentation.slide.filter(
            (item) => item.index === data.index
        )
        await groupCol.update(presentation.groupId, {
            presenting: data.presentationId,
        })
        await presentationCol.update(data.presentationId, {
            slideIndex: data.index,
        })
        if (currentSlide.length == 0) {
            socket.broadcast.emit(`present-${data.presentationId}`, {
                errorCode: true,
                data: 'Cannot find this slide',
            })
        }
        socket.broadcast.emit(`present-${data.presentationId}`, {
            errorCode: null,
            data: currentSlide[0],
        })
    })
    socket.on('answer', async (data) => {
        const token = socket.handshake.headers.token
        const user = await getUserInfo(token)
        if (!user) {
            socket.broadcast.emit(
                `answer-${data.presentationId}-${data.index}`,
                {
                    errorCode: true,
                    data: 'System error',
                }
            )
            return
        }
        let presentation = await presentationCol.findOne(data.presentationId)
        if (!presentation) {
            socket.broadcast.emit(
                `answer-${data.presentationId}-${data.index}`,
                {
                    errorCode: true,
                    data: 'System error',
                }
            )
        }
        const answer = {
            id: ObjectID().toString(),
            presentationId: data.presentationId,
            userId: user.id,
            name: user.name || user.username,
            question: presentation.slide[data.index].question,
            answer:
                presentation.slide[data.index].answer[data.answerIndex]
                    ?.value ??
                presentation.slide[data.index].answer[data.answerIndex]?.type,
            content:
                `${user.name} chose ` +
                `${
                    presentation.slide[data.index].answer[data.answerIndex]
                        ?.value ??
                    presentation.slide[data.index].answer[data.answerIndex]
                        ?.type
                } for question ${
                    presentation.slide[data.index].question
                } at presentation ${presentation.name}`,
            createdAt: new Date(),
        }
        await answerCol.create(answer)
        presentation.slide.map((item) => {
            if (item.index === data.index) {
                item.answer[data.answerIndex].amount += 1
            }
        })
        await presentationCol.update(data.presentationId, presentation)
        io.emit(`answer-${data.presentationId}-${data.index}`, {
            errorCode: true,
            data: presentation,
        })
    })
    socket.on('update-question', async (data) => {
        let token = null
        token = socket.handshake.headers.token ?? null
        let user
        if (token) {
            user = await getUserInfo(token)
        } else {
            user.id = data?.uid
            user.name = data?.name
        }
        const updated = await questionCol.update(data.questionId, data.question)
        if (!updated) {
            io.emit(`update-question-${data.presentationId}`, {
                errorCode: true,
                data: 'System error',
            })
        } else {
            io.emit(`update-question-${data.presentationId}`, {
                errorCode: null,
                data: data.question,
            })
        }
    })
    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
}
