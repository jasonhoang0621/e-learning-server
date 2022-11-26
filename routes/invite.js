commands = [
    {
        name: 'create',
        controller: 'invite',
        method: 'post',
        api: '/api/invite/:code',
        middleware: ['Authorization'],
    },
    {
        name: 'joinGroupByEmail',
        controller: 'invite',
        method: 'get',
        api: '/api/emailInvited/:code',
        middleware: [],
    },
    {
        name: 'joinGroup',
        controller: 'invite',
        method: 'post',
        api: '/api/invite/:code',
        middleware: ['Authorization'],
    },
]
module.exports = commands
