const scheduleController = require('../socket/scheduleController')

module.exports = async (io, socket, scheduleNamespace) => {
    socket.on('chat message', async(data) => {
        await scheduleController.chat(io, socket, data, scheduleNamespace)
    });
};
