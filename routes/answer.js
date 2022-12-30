commands = [
    {
        name: 'getAll',
        controller: 'answer',
        method: 'get',
        api: '/api/history/:code',
        middleware: ['Authorization'],
    },
]
module.exports = commands
