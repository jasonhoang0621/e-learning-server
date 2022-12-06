commands = [
    {
        name: 'create',
        controller: 'slide',
        method: 'post',
        api: '/api/slide',
        middleware: ['Authorization'],
    },
    {
        name: 'getOne',
        controller: 'slide',
        method: 'post',
        api: '/api/slide/:code',
        middleware: [],
    },
    {
        name: 'getAll',
        controller: 'slide',
        method: 'get',
        api: '/api/slide',
        middleware: [],
    },
]
module.exports = commands
