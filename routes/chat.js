commands = [
    {
        name: 'getOne',
        controller: 'chat',
        method: 'get',
        api: '/api/chat/:code',
        middleware: [],
    },
]
module.exports = commands
