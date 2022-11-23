const database = require('../utils/database')
const { dataPagination } = require('../helperFunction/helper')
createValidation = ['name']
async function create(data) {
    return await database.groupModel().insertOne(data)
}
async function getAll(sort, page, limit, match) {
    let pipeline = null

    pipeline = dataPagination(match, sort, page, limit)
    const result = await database.groupModel().aggregate(pipeline).toArray()
    const newResult = {
        metadata: result[0].metadata,
        data: result[0].data,
    }
    return newResult
}
async function findOne(id) {
    return await database.groupModel().findOne({ id: id })
}
module.exports = {
    create,
    // validation,
    findOne,
    getAll,
}
