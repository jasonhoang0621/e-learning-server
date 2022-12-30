commands = [
    {
        name: 'getOne',
        controller: 'question',
        method: 'get',
        api: '/api/question/:code',
        middleware: [],
    },
]
module.exports = commands
