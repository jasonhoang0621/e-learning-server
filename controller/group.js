const groupCol = require('../dataModel/groupCol')
const ObjectID = require('mongodb').ObjectId
const { joinUser, hideUserInfo } = require('../helperFunction/helper')
const recordPerPage = 100
const defaultPage = 1
const getAll = async (req, res) => {
    try {
        const sortBy = {
            createdAt: -1,
        }
        const page = req.query.page ?? defaultPage
        const limit = req.query.limit ?? recordPerPage
        let match = {}
        match['deletedAt'] = null
        const data = await groupCol.getAll(page, limit, sortBy, match)
        if (!data) {
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
            data: data.data,
            metadata: data.metadata[0] ?? {
                recordTotal: 0,
                pageCurrent: page,
                recordPerPage: limit,
            },
        })
    } catch (error) {
        return res.json({ errorCode: true, data: 'system error' })
    }
}
const getOne = async (req, res) => {
    try {
        let result = await groupCol.findOne(req.params.code, joinUser())

        if (!result) {
            return res.json({ errorCode: true, data: 'System error' })
        }
        result.user = await hideUserInfo(result.user)
        result.user.forEach((item, index) => {
            item.role = result.members[index].role
        })
        delete result.members
        return res.json({ errorCode: null, data: result })
    } catch (error) {
        return res.json({ errorCode: true, data: 'system error' })
    }
}

async function create(req, res) {
    try {
        let data = req.body
        data.id = ObjectID().toString()

        const user = req.user
        for (property of groupCol.createValidation) {
            if (!data[property]) {
                return res.json({
                    errorCode: true,
                    data: `Please input ${property}`,
                })
            }
        }
        data.createdBy = user.id
        data.createdAt = new Date()
        data.members = [user.id]
        const group = await groupCol.create(data)
        if (!group) {
            return res.json({ errorCode: true, data: 'System error' })
        }
        return res.json({ errorCode: null, data: data })
    } catch (error) {
        return res.json({ errorCode: true, data: 'system error' })
    }
}
const addMember = (req, res) => {
    const code = req.params.code
}

module.exports = {
    getAll,
    getOne,
    create,
    addMember,
}
