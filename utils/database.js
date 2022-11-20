const { MongoClient } = require('mongodb')
const config = require('../config/database.json')

let _userModel = null

async function connectDatabase(callback) {
    const client = new MongoClient(config.uri)
    try {
        await client.connect()
        let db = await client.db('login')
        console.log('connect to DB Success', config.uri)

        _userModel = db.collection('user')

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

module.exports = {
    userModel,
    connectDatabase,
}
