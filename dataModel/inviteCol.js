const database = require('../utils/database')
const { dataPagination } = require('../helperFunction/helper')
const createValidation = ['isEmail']
async function create(data) {
    return await database.inviteModel().insertOne(data)
}
async function findOne(id) {
    return await database.inviteModel().findOne({ id: id })
}

module.exports = {
    create,
    // validation,
    createValidation,
    findOne,
}
