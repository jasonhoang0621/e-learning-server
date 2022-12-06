const database = require('../utils/database')
const { dataPagination } = require('../helperFunction/helper')
const createValidation = ['groupId', 'name']
async function create(data) {
    return await database.presentationModel().insertOne(data)
}
async function findOne(id) {
    return await database.presentationModel().findOne({ id: id })
}

async function getAll(sort, page, limit, match = {}) {
    let pipeline = null

    pipeline = dataPagination(match, sort, page, limit)
    const result = await database
        .presentationModel()
        .aggregate(pipeline)
        .toArray()
    return result
}

module.exports = {
    create,
    // validation,
    createValidation,
    findOne,
    getAll,
}
