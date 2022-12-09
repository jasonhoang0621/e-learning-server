module.exports = (socket) => {
    socket.on('chatInit', (data) => {
        const token = socket.handshake.headers.token
        console.log('token ne ', token)
        console.log('data ne ', data)
    })
    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
}
