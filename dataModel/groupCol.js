const database = require('../utils/database')
const { dataPagination } = require('../helperFunction/helper')
const createValidation = ['name']
async function create(data) {
    return await database.groupModel().insertOne(data)
}
async function getAll(sort, page, limit, match = {}) {
    let pipeline = null

    pipeline = dataPagination(match, sort, page, limit)
    const result = await database.groupModel().aggregate(pipeline).toArray()
    return result
}
async function findOne(id, join = []) {
    const result = await database
        .groupModel()
        .aggregate([{ $match: { id: id } }, ...join])
        .toArray()
    return result[0]
}
async function addGroup(id, user) {
    const result = await database
        .groupModel()
        .findOneAndUpdate({ id: id }, { $push: { members: user } })
    return result.value
}
async function update(code, data) {
    const result = await database.groupModel().findOneAndUpdate(
        { id: code },
        {
            $set: data,
        }
    )
    return result.value
}
module.exports = {
    create,
    // validation,
    findOne,
    createValidation,
    getAll,
    addGroup,
    update,
}
