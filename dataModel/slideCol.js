const database = require('../utils/database')
const { dataPagination } = require('../helperFunction/helper')
const createValidation = ['question', 'answer', 'groupId', 'index']
async function create(data) {
    return await database.slideModel().insertOne(data)
}
async function findOne(id) {
    return await database.slideModel().findOne({ id: id })
}

async function getAll(sort, page, limit, match = {}) {
    let pipeline = null

    pipeline = dataPagination(match, sort, page, limit)
    const result = await database.slideModel().aggregate(pipeline).toArray()
    return result
}

module.exports = {
    create,
    // validation,
    createValidation,
    findOne,
    getAll,
}
