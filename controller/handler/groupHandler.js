const socketController = require('../socket/socketController')

module.exports = async (io, socket) => {
    socket.on('login', async(data) => {
        await socketController.login(io, socket, data)
    });

    socket.on('chat', async(data) => {
        await socketController.chat(io, socket, data)
    });

    socket.on('forceDisconnect', async () => {
        socket.disconnect();
    })

    socket.on('disconnect', async () => {
        console.log('user disconnected: ' + socket.name);
    });
};
