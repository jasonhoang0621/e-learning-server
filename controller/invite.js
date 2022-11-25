const inviteCol = require('../dataModel/inviteCol')
const groupCol = require('../dataModel/groupCol')
const ObjectID = require('mongodb').ObjectId
const emailCol = require('../utils/email.js')
const userCol = require('../dataModel/userCol')

async function create(req, res) {
    try {
        let data = req.body
        const groupId = req.params.code
        data.id = ObjectID().toString()
        data.groupId = groupId

        const user = req.user
        for (property of inviteCol.createValidation) {
            console.log(property)
            if (data[property] === undefined) {
                return res.json({
                    errorCode: true,
                    data: `Please input ${property}`,
                })
            }
        }
        if (data.isEmail && !data.memberId) {
            return res.json({
                errorCode: true,
                data: `Please input memberId`,
            })
        }
        const checkOwner = await groupCol.findOne(groupId)
        let check = false
        checkOwner.members.map((item) => {
            if (item.id === user.id && item.role.includes('owner')) {
                check = true
            }
        })
        if (check === false) {
            return res.json({
                errorCode: true,
                data: `You don't have permission to invite people to this group`,
            })
        }
        data.createdBy = user.id
        data.createdAt = new Date()
        let member = null
        if (data.isEmail) {
            member = await userCol.findOneById(data.memberId)
            console.log('member', member)
            await emailCol.sendEmailInvite(member.email, data.id, data.memberId)
        } else {
            data.member = null
        }
        const invite = await inviteCol.create(data)
        if (!invite) {
            return res.json({ errorCode: true, data: 'System error' })
        }
        return res.json({ errorCode: null, data: data })
    } catch (error) {
        return res.json({ errorCode: true, data: 'system error' })
    }
}

const joinGroup = async (req, res) => {
    try {
        const user = req.user
        const data = {
            id: user.id,
            role: 'member',
        }
        const invite = await inviteCol.findOne(req.params.code)
        if (!invite) {
            return res.json({
                errorCode: true,
                data: 'Cannot find the invitation',
            })
        }
        let result = await groupCol.addGroup(invite.groupId, data)
        result.members.push(data)
        return res.json({ errorCode: null, data: result })
    } catch (error) {
        return res.json({ errorCode: true, data: 'system error' })
    }
}
const joinGroupByEmail = async (req, res) => {
    try {
        if (!req.query.userId) {
            return res.json({ errorCode: true, data: 'Error System' })
        }
        const userId = req.query.userId
        const data = {
            id: userId,
            role: 'member',
        }
        const invite = await inviteCol.findOne(req.params.code)
        if (!invite) {
            return res.json({
                errorCode: true,
                data: 'Cannot find the invitation',
            })
        }
        let result = await groupCol.addGroup(invite.groupId, data)
        result.members.push(data)
        return res.redirect('https://group-user.onrender.com/')
    } catch (error) {
        return res.json({ errorCode: true, data: 'system error' })
    }
}

module.exports = {
    create,
    joinGroup,
    joinGroupByEmail,
}
