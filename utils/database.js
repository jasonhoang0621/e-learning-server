const { MongoClient } = require('mongodb')
const config = require('../config/database.json')

let _userModel = null
let _groupModel = null

async function connectDatabase(callback) {
    const client = new MongoClient(config.uri)
    try {
        await client.connect()
        let db = await client.db('login')
        console.log('connect to DB Success', config.uri)

        _userModel = db.collection('user')
        _groupModel = db.collection('group')

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

module.exports = {
    userModel,
    groupModel,
    connectDatabase,
}
