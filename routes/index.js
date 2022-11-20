const userCommand = require('./user.js')

const event = [userCommand]
const controllers = {
    user: require('../controller/user.js'),
}

const middleWares = {
    Authorization: controllers.user.userAuthentication,
}
const bindRouter = (app) => {
    for (let i = 0; i < event.length; i++) {
        for (let j = 0; j < event[i].length; j++) {
            let { name, controller, method, api, middleware } = event[i][j]
            if (!name) {
                throw new NotImplementedException()
            }
            let _middleWares = []
            middleware.map((e) => {
                _middleWares.push(middleWares[e])
            })
            if (typeof (controllers[controller] == 'function')) {
                app[method](api, ..._middleWares, controllers[controller][name])
            }
        }
    }
}

module.exports = {
    bindRouter,
}
