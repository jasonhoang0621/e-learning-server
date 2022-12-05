module.exports = (socket) => {
    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
}
