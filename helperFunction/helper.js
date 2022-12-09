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
function joinUser(aggregate = []) {
    aggregate.push({
        $lookup: {
            from: 'user',
            localField: 'members.id',
            foreignField: 'id',
            as: 'user',
        },
    })
    return aggregate
}

function joinSlide(aggregate = []) {
    const project = {
        id: 1,
        groupId: 1,
        name: 1,
        presentationId: 1,
        createdAt: 1,
        index: 1,
        question: 1,
        answer: 1,
    }
    aggregate.push({
        $lookup: {
            from: 'slide',
            localField: 'id',
            foreignField: 'presentationId',
            pipeline: [{ $project: project }, { $sort: { index: 1 } }],
            as: 'slide',
        },
    })
    return aggregate
}

function hideUserInfo(users) {
    for (let i = 0; i < users.length; i++) {
        delete users[i].password
        delete users[i].refreshToken
    }
    return users
}
module.exports = {
    dataPagination,
    joinUser,
    hideUserInfo,
    joinSlide,
}
