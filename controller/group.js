const groupCol = require('../dataModel/groupCol')
const ObjectID = require('mongodb').ObjectId
const { joinUser } = require('../helperFunction/helper')
const recordPerPage = 100
const defaultPage = 1
const getAll = async (req, res) => {
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
}
const getOne = async (req, res) => {
    const result = await groupCol.findOne(req.params.code, joinUser())
    if (!result) {
        return res.json({ errorCode: true, data: 'System error' })
    }
    return res.json({ errorCode: null, data: result })
}

async function create(req, res) {
    try {
        let data = req.body
        data.id = ObjectID().toString()
        console.log(data)

        const user = req.user
        console.log(user)
        console.log(groupCol.createValidation)
        for (property of groupCol.createValidation) {
            console.log(property)
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
        console.log('data', data)
        const group = await groupCol.create(data)
        if (!group) {
            return res.json({ errorCode: true, data: 'System error' })
        }
        return res.json({ errorCode: null, data: data })
    } catch (error) {
        return res.json({ errorCode: true, data: 'system error' })
    }
}

module.exports = {
    getAll,
    getOne,
    create,
}
