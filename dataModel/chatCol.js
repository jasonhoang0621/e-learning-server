const database = require('../utils/database')

async function create(data) {
    return await database.chatModel().insertOne(data)
}
module.exports = {
    create,
}
