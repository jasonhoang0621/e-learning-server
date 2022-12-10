const { dataPagination } = require('../helperFunction/helper')
const database = require('../utils/database')

async function create(data) {
    return await database.messageModel().insertOne(data)
}
async function getAll(page, limit, sort, match = {}, join = false) {
    let pipeline = null
    pipeline = dataPagination(match, sort, page, limit, join)
    const result = await database.messageModel().aggregate(pipeline).toArray()
    return result
}
module.exports = {
    create,
    getAll,
}
