const { MongoClient } = require('mongodb')
const config = require('../config/database.json')

let _userModel = null
let _groupModel = null
let _inviteModel = null
let _slideModel = null
let _presentationModel = null

async function connectDatabase(callback) {
    const client = new MongoClient(config.uri)
    try {
        await client.connect()
        let db = await client.db('login')
        console.log('connect to DB Success', config.uri)

        _userModel = db.collection('user')
        _groupModel = db.collection('group')
        _inviteModel = db.collection('invite')
        _slideModel = db.collection('slide')
        _presentationModel = db.collection('presentation')

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

const slideModel = function () {
    if (_slideModel == null) {
        console.log('Instance is null or undefined')
    } else {
        return _slideModel
    }
}

const presentationModel = function () {
    if (_presentationModel == null) {
        console.log('Instance is null or undefined')
    } else {
        return _presentationModel
    }
}

module.exports = {
    userModel,
    groupModel,
    inviteModel,
    slideModel,
    connectDatabase,
    presentationModel,
}
