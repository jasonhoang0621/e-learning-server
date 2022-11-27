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
        const user = req.user
        let match = {
            'members.id': user.id,
        }
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
        const temp = result.members
        for (let i = 0; i < result.user.length; i++) {
            for (let j = 0; j < temp.length; j++) {
                if (temp[j].id === result.user[i].id) {
                    result.user[i].role = temp[j].role
                }
            }
        }
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
        data.members = [{ id: user.id, role: 'owner' }]
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

const assign = async (req, res) => {
    try {
        const user = req.user
        const code = req.params.code
        const body = req.body
        if (user.id === body.userId) {
            return res.json({
                errorCode: true,
                data: 'You cannot assign yourself',
            })
        }
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
                    if (body.role == 'owner') {
                        check = false
                        break
                    }
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
                data: 'You dont have permission to assign this role to this people',
            })
        }
        const temp = group.members.filter((e) => e.id !== body.userId)
        group.members = temp
        group.members.push({
            id: body.userId,
            role: body.role,
        })
        group['updatedAt'] = new Date()
        const updated = await groupCol.update(code, group)
        if (!updated) {
            return res.json({ errorCode: true, data: 'System error' })
        }
        return res.json({ errorCode: null, data: 'Assign success' })
    } catch (error) {
        return res.json({ errorCode: true, data: 'System error' })
    }
}

module.exports = {
    getAll,
    getOne,
    create,
    remove,
    assign,
}
