const {
    dataPagination,
    dataPaginationSkip,
} = require('../helperFunction/helper')
const database = require('../utils/database')

async function getAll(skip, limit, sort, match = {}, join = false) {
    let pipeline = null
    pipeline = dataPaginationSkip(match, sort, skip, limit, join)
    const result = await database.questionModel().aggregate(pipeline).toArray()
    return result
}
async function create(data) {
    return await database.questionModel().insertOne(data)
}
module.exports = {
    getAll,
    create,
}
