const {
    dataPagination,
    dataPaginationSkip,
} = require('../helperFunction/helper')
const database = require('../utils/database')

async function getAll(skip, limit, sort, match = {}, join = false) {
    let pipeline = null
    let addFields = {
        upVoteLength: { $size: '$upVote' },
    }
    let newSort = {
        upVoteLength: -1,
        ...sort,
    }
    pipeline = dataPaginationSkip(
        match,
        newSort,
        skip,
        limit,
        join,
        false,
        addFields
    )
    const result = await database.questionModel().aggregate(pipeline).toArray()
    return result
}
async function create(data) {
    return await database.questionModel().insertOne(data)
}
async function update(id, data) {
    data['updateAt'] = new Date()
    const result = await database.questionModel().findOneAndUpdate(
        { id: id },
        {
            $set: data,
        }
    )
    return result.value
}

module.exports = {
    getAll,
    create,
    update,
}
