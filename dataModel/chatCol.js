const database = require('../utils/database')

async function create(data) {
    return await database.chatModel().insertOne(data)
}
async function findByPresentationId(id) {
    return await database.chatModel().findOne({ presentationId: id })
}
module.exports = {
    create,
    findByPresentationId,
}
