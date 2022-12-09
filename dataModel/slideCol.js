const database = require('../utils/database')
const { dataPagination } = require('../helperFunction/helper')
const createValidation = ['question', 'answer', 'presentationId', 'index']
async function create(data) {
    return await database.slideModel().insertOne(data)
}
async function findOne(id) {
    return await database.slideModel().findOne({ id: id })
}

async function getAll(page, limit, sort, match = {}) {
    let pipeline = null

    pipeline = dataPagination(match, sort, page, limit)
    const result = await database.slideModel().aggregate(pipeline).toArray()
    return result
}
async function answer(id, index) {
    const result = await database.slideModel().findOneAndUpdate(
        { id: id },
        {
            $inc: {
                [`answer.${index}.amount`]: 1,
            },
            $set: {
                updatedAt: new Date(),
            },
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
    answer,
}
