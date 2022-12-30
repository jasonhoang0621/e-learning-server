commands = [
    {
        name: 'getAll',
        controller: 'question',
        method: 'get',
        api: '/api/question/:code',
        middleware: [],
    },
]
module.exports = commands
