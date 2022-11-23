commands = [
    {
        name: 'getAll',
        controller: 'group',
        method: 'get',
        api: '/api/groups',
        middleware: ['Authorization'],
    },
    {
        name: 'getOne',
        controller: 'group',
        method: 'get',
        api: '/api/group/:code',
        middleware: ['Authorization'],
    },
    {
        name: 'create',
        controller: 'group',
        method: 'post',
        api: '/api/group',
        middleware: ['Authorization'],
    },
]
module.exports = commands
