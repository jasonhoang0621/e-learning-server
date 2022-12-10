const {
    dataPagination,
    dataPaginationSkip,
} = require('../helperFunction/helper')
const database = require('../utils/database')

async function create(data) {
    return await database.messageModel().insertOne(data)
}
async function getAll(skip, limit, sort, match = {}, join = false) {
    let pipeline = null
    pipeline = dataPaginationSkip(match, sort, skip, limit, join)
    const result = await database.messageModel().aggregate(pipeline).toArray()
    return result
}
module.exports = {
    create,
    getAll,
}
