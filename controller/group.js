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
        console.log(match)
        const data = await groupCol.getAll(page, limit, sortBy, match)
        console.log('data', data)
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
const getOne = async (req, res) => {
    try {
        let result = await groupCol.findOne(req.params.code, joinUser())

        if (!result) {
            return res.json({ errorCode: true, data: 'Cannot find this group' })
        }
        result.user = await hideUserInfo(result.user)
        result.user.forEach((item, index) => {
            item.role = result.members[index].role
        })
        delete result.members
        return res.json({ errorCode: null, data: result })
    } catch (error) {
        return res.json({ errorCode: true, data: 'System error' })
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
const remove = async (req, res) => {
    try {
        const user = req.user
        const code = req.params.code
        const body = req.body
        let group = await groupCol.findOne(code)
        if (!group) {
            return res.json({ errorCode: true, data: 'Cannot find this group' })
        }
        let check = true
        for (let i = 0; i < group.members.length; i++) {
            if (group.members[i].id == user.id) {
                if (group.members[i].role == 'owner') {
                    check = true
                    break
                } else if (group.members[i].role == 'member') {
                    check = false
                    break
                } else if (group.members[i].role == 'co-owner') {
                    for (let j = 0; j < group.members.length; j++) {
                        if (
                            group.members[j].role == 'owner' &&
                            group.members[j].id == body.userId
                        ) {
                            check = false
                            break
                        }
                    }
                }
            }
        }
        if (!check) {
            return res.json({
                errorCode: true,
                data: 'You dont have permission to remove this people',
            })
        }
        const temp = group.members.filter((e) => e.id !== body.userId)
        group.members = temp
        group['updatedAt'] = new Date()
        const updated = await groupCol.update(code, group)
        if (!updated) {
            return res.json({ errorCode: true, data: 'System error' })
        }
        return res.json({ errorCode: null, data: 'Remove success' })
    } catch (error) {
        return res.json({ errorCode: true, data: 'system error' })
    }
}

module.exports = {
    getAll,
    getOne,
    create,
    remove,
}
