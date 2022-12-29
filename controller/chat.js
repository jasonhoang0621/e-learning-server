const chatCol = require('../dataModel/chatCol')
const messageCol = require('../dataModel/messageCol')
const ObjectID = require('mongodb').ObjectId
const {
    hideUserInfo,
    joinMessageWithUser,
} = require('../helperFunction/helper')

const getOne = async (req, res) => {
    try {
        const sortBy = {
            createdAt: -1,
        }
        const code = req.params.code
        let skip = req.query?.skip ?? 0
        skip = parseInt(skip)
        const limit = Number(req.query?.limit) ?? 20

        const chat = await chatCol.getOneByPresentationId(code)
        if (!chat) {
            return res.json({ errorCode: true, data: 'Cannot find this chat' })
        }
        let match = {
            chatId: chat.id,
        }
        match['deletedAt'] = null

        const message = await messageCol.getAll(
            skip,
            limit,
            sortBy,
            match,
            joinMessageWithUser()
        )
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
            data: message[0].data.reverse(),
        })
    } catch (error) {
        return res.json({ errorCode: true, data: 'system error' })
    }
}

module.exports = {
    getOne,
}
