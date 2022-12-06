const presentationCol = require('../dataModel/presentationCol')
const ObjectID = require('mongodb').ObjectId
const groupCol = require('../dataModel/groupCol')
const recordPerPage = 100
const defaultPage = 1
async function create(req, res) {
    try {
        let data = req.body
        data.id = ObjectID().toString()

        const user = req.user
        const group = await groupCol.findOne(data.groupId)
        if (!group) {
            return res.json({ errorCode: true, data: 'Cannot find this group' })
        }
        let check = false
        for (let i = 0; i < group.members.length; i++) {
            if (
                group.members[i].id == user.id &&
                group.members[i].role == 'owner'
            ) {
                check = true
                break
            }
        }
        if (!check) {
            return res.json({
                errorCode: true,
                data: `You don't have permission to create slide in this group`,
            })
        }
        for (property of presentationCol.createValidation) {
            if (data[property] === undefined) {
                return res.json({
                    errorCode: true,
                    data: `Please input ${property}`,
                })
            }
        }
        data.createdBy = user.id
        const slide = await presentationCol.create(data)
        if (!slide) {
            return res.json({ errorCode: true, data: 'System error' })
        }
        return res.json({ errorCode: null, data: data })
    } catch (error) {
        return res.json({ errorCode: true, data: 'system error' })
    }
}

const getOne = async (req, res) => {
    try {
        const id = req.params.code
        let result = await presentationCol.findOne(id)
        if (!result) {
            return res.json({
                errorCode: true,
                data: 'Cannot find this presentation',
            })
        }
        return res.json({ errorCode: null, data: result })
    } catch (error) {
        return res.json({ errorCode: true, data: 'system error' })
    }
}
const getAll = async (req, res) => {
    try {
        const sortBy = {
            createdAt: -1,
        }
        const page = req.query.page ?? defaultPage
        const limit = req.query.limit ?? recordPerPage
        match['deletedAt'] = null
        const data = await presentationCol.getAll(page, limit, sortBy, match)
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
            data: data,
        })
    } catch (error) {
        return res.json({ errorCode: true, data: 'system error' })
    }
}
module.exports = {
    create,
    getOne,
    getAll,
}
