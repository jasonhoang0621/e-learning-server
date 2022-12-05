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
]
module.exports = commands
