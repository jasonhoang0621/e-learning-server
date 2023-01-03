const {
    dataPagination,
    dataPaginationSkip,
} = require('../helperFunction/helper')
const database = require('../utils/database')

async function create(data) {
    return await database.answerModel().insertOne(data)
}
async function getAll(
    skip,
    limit,
    sort,
    match = {},
    join = false,
    group = false,
    addFields = false
) {
    let newSort = {
        _id: -1,
        ...sort,
    }
    let pipeline = null
    pipeline = dataPaginationSkip(
        match,
        newSort,
        skip,
        limit,
        join,
        group,
        addFields
    )
    const result = await database.answerModel().aggregate(pipeline).toArray()
    return result
}

async function destroy(presentationId) {
    return await database.answerModel().findOneAndUpdate(
        { presentationId: presentationId },
        {
            $set: {
                deletedAt: new Date(),
            },
        }
    )
}
module.exports = {
    create,
    getAll,
    destroy,
}
