exports.login = async (io, socket, data) => {
    console.log('Client logged-in:\n name:' + data.name + '\n userid: ' + data.userid);
    socket.name = data.name;
    socket.userid = data.userid;
    io.emit('login', data.name);
}

exports.chat = async (io, socket, data) => {
    console.log('Message from %s: %s', socket.name, data.msg);
    var msg = {
        from: {
            name: socket.name,
            userid: socket.userid
        },
        msg: data.msg
    };

    socket.broadcast.emit('chat', msg);
}