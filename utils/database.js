const { MongoClient } = require('mongodb')
const config = require('../config/database.json')

let _userModel = null
let _groupModel = null
let _inviteModel = null
let _presentationModel = null
let _chatModel = null
let _messageModel = null
let _answerModel = null

async function connectDatabase(callback) {
    const client = new MongoClient(config.uri)
    try {
        await client.connect()
        let db = await client.db('login')
        console.log('connect to DB Success', config.uri)

        _userModel = db.collection('user')
        _groupModel = db.collection('group')
        _inviteModel = db.collection('invite')
        _presentationModel = db.collection('presentation')
        _chatModel = db.collection('chat')
        _messageModel = db.collection('message')
        _answerModel = db.collection('answer')

        callback()
    } catch (e) {
        console.error(e)
    }
}

const userModel = function () {
    if (_userModel == null) {
        console.log('Instance is null or undefined')
    } else {
        return _userModel
    }
}
const groupModel = function () {
    if (_groupModel == null) {
        console.log('Instance is null or undefined')
    } else {
        return _groupModel
    }
}

const inviteModel = function () {
    if (_inviteModel == null) {
        console.log('Instance is null or undefined')
    } else {
        return _inviteModel
    }
}

const presentationModel = function () {
    if (_presentationModel == null) {
        console.log('Instance is null or undefined')
    } else {
        return _presentationModel
    }
}

const chatModel = function () {
    if (_chatModel == null) {
        console.log('Instance is null or undefined')
    } else {
        return _chatModel
    }
}

const messageModel = function () {
    if (_messageModel == null) {
        console.log('Instance is null or undefined')
    } else {
        return _messageModel
    }
}
const answerModel = function () {
    if (_answerModel == null) {
        console.log('Instance is null or undefined')
    } else {
        return _answerModel
    }
}
module.exports = {
    userModel,
    groupModel,
    inviteModel,
    chatModel,
    messageModel,
    connectDatabase,
    presentationModel,
    answerModel,
}
