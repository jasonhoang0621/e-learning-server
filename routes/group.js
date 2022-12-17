commands = [
    {
        name: 'create',
        controller: 'group',
        method: 'post',
        api: '/api/group',
        middleware: ['Authorization'],
    },
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
        name: 'remove',
        controller: 'group',
        method: 'patch',
        api: '/api/group/:code',
        middleware: ['Authorization'],
    },
    {
        name: 'assign',
        controller: 'group',
        method: 'patch',
        api: '/api/group/assign/:code',
        middleware: ['Authorization'],
    },
    {
        name: 'destroy',
        controller: 'group',
        method: 'patch',
        api: '/api/group/destroy/:code',
        middleware: ['Authorization'],
    },
]
module.exports = commands
