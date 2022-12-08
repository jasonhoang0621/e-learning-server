const database = require('../utils/database')

async function create(data) {
    return await database.messageModel().insertOne(data)
}
module.exports = {
    create,
}
