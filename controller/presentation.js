const presentationCol = require('../dataModel/presentationCol')
const chatCol = require('../dataModel/chatCol')
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
                (group.members[i].id == user.id &&
                    group.members[i].role == 'owner') ||
                group.members[i].role == 'co-owner'
            ) {
                check = true
                break
            }
        }
        if (!check) {
            return res.json({
                errorCode: true,
                data: `You don't have permission to create presentation in this group`,
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
        data.slide = []
        data.createdBy = user.id
        data.createdAt = new Date()
        const presentation = await presentationCol.create(data)
        if (!presentation) {
            return res.json({
                errorCode: true,
                data: 'Cannot create presentation',
            })
        }
        const chatData = {
            id: ObjectID().toString(),
            presentationId: data.id,
            groupId: data.groupId,
            createdBy: user.id,
            createdAt: new Date(),
        }
        const chat = await chatCol.create(chatData)
        if (!chat) {
            return res.json({ errorCode: true, data: 'Cannot create chat' })
        }
        return res.json({ errorCode: null, data: data })
    } catch (error) {
        return res.json({ errorCode: true, data: 'system error' })
    }
}

const getOne = async (req, res) => {
    try {
        const id = req.params.code
        const user = req.user
        let result = await presentationCol.findOne(id)
        if (!result) {
            return res.json({
                errorCode: true,
                data: 'Cannot find this presentation',
            })
        }
        const group = await groupCol.findOne(result.groupId)
        let check = false
        for (let i = 0; i < group.members.length; i++) {
            if (group.members[i].id == user.id) {
                check = true
                break
            }
        }
        if (!check) {
            return res.json({
                errorCode: true,
                data: `You don't have permission to view this group`,
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
        const page = req.query?.page ?? defaultPage
        const limit = req.query?.limit ?? recordPerPage
        const user = req.user
        let match = {
            groupId: '',
        }

        match['deletedAt'] = null
        if (req.query.filters) {
            filters = req.query.filters
            if (filters['groupId']) {
                const groupId = filters['groupId']
                const group = await groupCol.findOne(groupId)
                let check = false
                for (let i = 0; i < group.members.length; i++) {
                    if (group.members[i].id == user.id) {
                        check = true
                        break
                    }
                }
                if (!check) {
                    return res.json({
                        errorCode: true,
                        data: `You don't have permission to view this group`,
                    })
                }
                match['groupId'] = filters['groupId']
            }
        }
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
            metadata: data[0].metadata[0],
            data: data[0].data,
        })
    } catch (error) {
        return res.json({ errorCode: true, data: 'system error' })
    }
}

async function update(req, res) {
    try {
        let data = req.body
        const code = req.params.code
        const user = req.user
        if (!data.groupId) {
            return res.json({ errorCode: true, data: 'Please input groupId' })
        }
        const group = await groupCol.findOne(data?.groupId ?? '')
        if (!group) {
            return res.json({ errorCode: true, data: 'Cannot find this group' })
        }
        if (group.presenting && group.presenting === code) {
            return res.json({
                errorCode: true,
                data: 'You cannot edit this presentation while presenting',
            })
        }
        let check = false
        for (let i = 0; i < group.members.length; i++) {
            if (
                (group.members[i].id == user.id &&
                    group.members[i].role == 'owner') ||
                group.members[i].role == 'co-onwer'
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

        data['updatedAt'] = new Date()
        const presentation = await presentationCol.update(code, data)
        if (!presentation) {
            return res.json({ errorCode: true, data: 'System error' })
        }
        return res.json({ errorCode: null, data: data })
    } catch (error) {
        return res.json({ errorCode: true, data: 'system error' })
    }
}

async function destroy(req, res) {
    try {
        let data = req.body
        const code = req.params.code
        const user = req.user
        if (!data.groupId) {
            return res.json({ errorCode: true, data: 'Please input groupId' })
        }
        const group = await groupCol.findOne(data?.groupId ?? '')
        if (!group) {
            return res.json({ errorCode: true, data: 'Cannot find this group' })
        }
        let check = false
        for (let i = 0; i < group.members.length; i++) {
            if (
                (group.members[i].id == user.id &&
                    group.members[i].role == 'owner') ||
                group.members[i].role == 'co-owner'
            ) {
                check = true
                break
            }
        }
        if (!check) {
            return res.json({
                errorCode: true,
                data: `You don't have permission to delete slide in this group`,
            })
        }
        data['deletedAt'] = new Date()
        const presentation = await presentationCol.update(code, data)
        if (!presentation) {
            return res.json({ errorCode: true, data: 'System error' })
        }
        await chatCol.destroy(presentation.id)
        return res.json({ errorCode: null, data: data })
    } catch (error) {
        return res.json({ errorCode: true, data: 'system error' })
    }
}
async function present(req, res) {
    try {
        const code = req.body.presentationId
        const user = req.user
        let presentation = await presentationCol.findOne(code)
        if (!presentation) {
            return res.json({
                errorCode: true,
                data: 'Cannot find this presentation',
            })
        }
        let group = await groupCol.findOne(presentation.groupId)
        if (group.presenting) {
            return res.json({
                errorCode: true,
                data: 'There is another presentation showing in this group',
            })
        }
        group.presenting = code
        presentation.slideIndex = 0
        await groupCol.update(group.id, group)
        await presentationCol.update(presentation.id, presentation)
        return res.json({ errorCode: null, data: presentation })
    } catch (error) {
        return res.json({ errorCode: true, data: 'System error' })
    }
}

async function exitPresent(req, res) {
    try {
        const code = req.body.presentationId
        const user = req.user
        let presentation = await presentationCol.findOne(code)
        if (!presentation) {
            return res.json({
                errorCode: true,
                data: 'Cannot find this presentation',
            })
        }
        let group = await groupCol.findOne(presentation.groupId)
        if (group.presenting) {
            group.presenting = null
            presentation.slideIndex = null
            await groupCol.update(group.id, group)
            await presentationCol.update(presentation.id, presentation)
        }
        return res.json({
            errorCode: null,
            data: 'End presentation successfully',
        })
    } catch (error) {
        return res.json({ errorCode: true, data: 'System error' })
    }
}

async function join(req, res) {
    try {
        const code = req.params.code
        const user = req.user
        const presentation = await presentationCol.findOne(code)
        if (!presentation) {
            return res.json({
                errorCode: true,
                data: 'Cannot find this presentation',
            })
        }
        let group = await groupCol.findOne(present.groupId)
        return res.json({
            errorCode: null,
            data: presentation.slide[group.slideIndex],
        })
    } catch (error) {
        return res.json({ errorCode: true, data: 'System error' })
    }
}

module.exports = {
    create,
    getOne,
    getAll,
    update,
    destroy,
    present,
    join,
    exitPresent,
}
