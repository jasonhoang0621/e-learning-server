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
        method: 'post',
        api: '/api/presentation/:code',
        middleware: [],
    },
    {
        name: 'getAll',
        controller: 'presentation',
        method: 'get',
        api: '/api/presentation',
        middleware: [],
    },
]
module.exports = commands
