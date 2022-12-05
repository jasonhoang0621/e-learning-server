const database = require('../utils/database')
const { dataPagination } = require('../helperFunction/helper')
const createValidation = ['header', 'question', 'answer', 'groupId']
async function create(data) {
    return await database.slideModel().insertOne(data)
}
async function findOne(id) {
    return await database.slideModel().findOne({ id: id })
}

module.exports = {
    create,
    // validation,
    createValidation,
    findOne,
}
