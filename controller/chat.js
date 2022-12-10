const chatCol = require('../dataModel/chatCol')
const messageCol = require('../dataModel/messageCol')

const ObjectID = require('mongodb').ObjectId
const {
    hideUserInfo,
    joinMessageWithUser,
} = require('../helperFunction/helper')
const recordPerPage = 10
const defaultPage = 1
const getOne = async (req, res) => {
    try {
        const sortBy = {
            createdAt: -1,
        }
        const code = req.params.code
        const page = req.query?.page ?? defaultPage
        const limit = req.query?.limit ?? recordPerPage
        const user = req.user
        let match = {
            chatId: code,
        }

        match['deletedAt'] = null
        const chat = await chatCol.getOne(code)
        if (!chat) {
            return res.json({ errorCode: true, data: 'Cannot find this chat' })
        }
        const message = await messageCol.getAll(
            page,
            limit,
            sortBy,
            match,
            joinMessageWithUser()
        )
        console.log(message[0].data[0].user)
        for (let i = 0; i < message[0].data.length; i++) {
            message[0].data[i].user = await hideUserInfo(
                message[0].data[i].user
            )
        }
        if (!message) {
            return res.json({
                errorCode: true,
                data: 'System error',
                metadata: {
                    recordTotal: 0,
                    pageCurrent: page,
                    recordPerPage: limit,
                },
            })
        }
        return res.json({
            errorCode: null,
            metadata: message[0].metadata[0],
            data: message[0].data,
        })
    } catch (error) {
        return res.json({ errorCode: true, data: 'system error' })
    }
}

module.exports = {
    getOne,
}
