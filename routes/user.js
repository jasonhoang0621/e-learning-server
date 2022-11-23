commands = [
    {
        name: 'login',
        controller: 'user',
        method: 'post',
        api: '/api/login',
        middleware: [],
    },
    {
        name: 'register',
        controller: 'user',
        method: 'post',
        api: '/api/register',
        middleware: [],
    },
    {
        name: 'profile',
        controller: 'user',
        method: 'get',
        api: '/api/profile',
        middleware: ['Authorization'],
    },
    {
        name: 'refreshToken',
        controller: 'user',
        method: 'post',
        api: '/api/refreshToken',
        middleware: [],
    },
    {
        name: 'googleOauth',
        controller: 'user',
        method: 'get',
        api: '/api/loginGoogle',
        middleware: [],
    },
    {
        name: 'verifyGoogle',
        controller: 'user',
        method: 'get',
        api: '/api/oauth/google',
        middleware: [],
    },
    {
        name: 'verifyEmail',
        controller: 'user',
        method: 'get',
        api: '/api/verifyEmail/:code',
        middleware: [],
    },
    {
        name: 'changePass',
        controller: 'user',
        method: 'patch',
        api: '/api/changePass',
        middleware: ['Authorization'],
    },
]
module.exports = commands
