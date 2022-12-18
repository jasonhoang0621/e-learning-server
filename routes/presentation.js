commands = [
    {
        name: 'create',
        controller: 'presentation',
        method: 'post',
        api: '/api/presentation',
        middleware: ['Authorization'],
    },
    {
        name: 'getOne',
        controller: 'presentation',
        method: 'get',
        api: '/api/presentation/:code',
        middleware: ['Authorization'],
    },
    {
        name: 'getAll',
        controller: 'presentation',
        method: 'get',
        api: '/api/presentation',
        middleware: ['Authorization'],
    },
    {
        name: 'update',
        controller: 'presentation',
        method: 'patch',
        api: '/api/presentation/:code',
        middleware: ['Authorization'],
    },
    {
        name: 'destroy',
        controller: 'presentation',
        method: 'patch',
        api: '/api/destroy/presentation/:code',
        middleware: ['Authorization'],
    },
    {
        name: 'present',
        controller: 'presentation',
        method: 'patch',
        api: '/api/present/presentation/:code',
        middleware: ['Authorization'],
    },
]
module.exports = commands
