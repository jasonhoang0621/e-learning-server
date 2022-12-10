const database = require('../utils/database')

async function create(data) {
    return await database.chatModel().insertOne(data)
}
async function findByPresentationId(id) {
    return await database.chatModel().findOne({ presentationId: id })
}
async function getOne(id) {
    return await database.chatModel().findOne({ id })
}
async function destroy(id) {
    return await database.chatModel().findOneAndUpdate(
        { id },
        {
            $set: {
                deletedAt: new Date(),
            },
        }
    )
}
module.exports = {
    create,
    findByPresentationId,
    destroy,
    getOne,
}
