const questionCol = require('../dataModel/questionCol')
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
        const question = await questionCol.getAll(skip, limit, sortBy, match)
        if (!question) {
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
            metadata: question[0].metadata[0],
            data: question[0].data,
        })
    } catch (error) {
        return res.json({ errorCode: true, data: 'system error' })
    }
}

module.exports = {
    getAll,
}
