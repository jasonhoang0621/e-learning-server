const userCommand = require('./user.js')
const groupCommand = require('./group.js')
const inviteCommand = require('./invite.js')
const presentationCommand = require('./presentation.js')
const chatCommand = require('./chat.js')

const event = [
    userCommand,
    groupCommand,
    inviteCommand,
    presentationCommand,
    chatCommand,
]
const controllers = {
    user: require('../controller/user.js'),
    group: require('../controller/group.js'),
    invite: require('../controller/invite.js'),
    presentation: require('../controller/presentation.js'),
    chat: require('../controller/chat.js'),
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
