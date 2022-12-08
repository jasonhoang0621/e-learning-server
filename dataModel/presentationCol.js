const database = require('../utils/database')
const { dataPagination } = require('../helperFunction/helper')
const createValidation = ['groupId', 'name']
async function create(data) {
    return await database.presentationModel().insertOne(data)
}
async function findOne(id, join = []) {
    const result = await database
        .presentationModel()
        .aggregate([{ $match: { id: id } }, ...join])
        .toArray()
    return result[0]
}

async function getAll(page, limit, sort, match = {}, join = false) {
    let pipeline = null
    pipeline = dataPagination(match, sort, page, limit, join)

    const result = await database
        .presentationModel()
        .aggregate(pipeline)
        .toArray()
    return result
}

async function update(code, data) {
    const result = await database.presentationModel().findOneAndUpdate(
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
    createValidation,
    findOne,
    getAll,
    update,
}
