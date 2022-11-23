function dataPagination(match, sort, page = 1, limit = 10, join = false) {
    const aggregate = [{ $match: match }]
    let data = []
    data.push({ $sort: sort })

    if (page > 1) {
        let skip = (page - 1) * limit
        data.push({ $skip: skip })
    }
    data.push({ $limit: parseInt(limit) })
    if (join) {
        join.forEach((item) => data.push(item))
    }
    let facet = {
        metadata: [
            { $count: 'recordTotal' },
            { $addFields: { pageCurrent: page, recordPerPage: limit } },
        ],
        data: data,
    }
    aggregate.push({ $facet: facet })
    return aggregate
}
module.exports = {
    dataPagination,
}
