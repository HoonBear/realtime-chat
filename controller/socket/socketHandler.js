module.exports = async (io, socket) => {
    socket.on('login', function (data) {
        console.log('Client logged-in:\n name:' + data.name + '\n userid: ' + data.userid);
        socket.name = data.name;
        socket.userid = data.userid;
        io.emit('login', data.name);
    });

    socket.on('chat', function (data) {
        console.log('Message from %s: %s', socket.name, data.msg);
        var msg = {
            from: {
                name: socket.name,
                userid: socket.userid
            },
            msg: data.msg
        };

        socket.broadcast.emit('chat', msg);
    });

    socket.on('forceDisconnect', function () {
        socket.disconnect();
    })

    socket.on('disconnect', function () {
        console.log('user disconnected: ' + socket.name);
    });
};
