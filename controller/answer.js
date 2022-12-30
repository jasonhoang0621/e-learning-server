const answerCol = require('../dataModel/answerCol')
const messageCol = require('../dataModel/messageCol')
const ObjectID = require('mongodb').ObjectId
const {
    hideUserInfo,
    joinMessageWithUser,
} = require('../helperFunction/helper')

const getAll = async (req, res) => {
    try {
        const sortBy = {
            createdAt: -1,
        }
        const code = req.params.code
        let skip = req.query?.skip ?? 0
        skip = parseInt(skip)
        const limit = Number(req.query?.limit) ?? 20
        match = {
            deletedAt: null,
            presentationId: code,
        }
        const answer = await answerCol.getAll(
            skip,
            limit,
            sortBy,
            match,
            joinMessageWithUser()
        )
        if (!answer) {
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
            metadata: answer[0].metadata[0],
            data: answer[0].data.reverse(),
        })
    } catch (error) {
        return res.json({ errorCode: true, data: 'system error' })
    }
}

module.exports = {
    getAll,
}
