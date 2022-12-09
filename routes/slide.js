commands = [
    {
        name: 'create',
        controller: 'slide',
        method: 'post',
        api: '/api/slide',
        middleware: ['Authorization'],
    },
    {
        name: 'answer',
        controller: 'slide',
        method: 'post',
        api: '/api/slide/:code',
        middleware: ['Authorization'],
    },
    {
        name: 'getOne',
        controller: 'slide',
        method: 'get',
        api: '/api/slide/:code',
        middleware: ['Authorization'],
    },
    {
        name: 'getAll',
        controller: 'slide',
        method: 'get',
        api: '/api/slide',
        middleware: ['Authorization'],
    },
]
module.exports = commands
