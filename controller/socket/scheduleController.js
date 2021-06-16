exports.chat = async(io, socket, data, scheduleNamespace) => {
    console.log('message from client: ', data);

    var name = socket.name = data.name;
    var room = socket.room = data.room;

    // room에 join한다
    socket.join(room);
    // room에 join되어 있는 클라이언트에게 메시지를 전송한다
    scheduleNamespace.to(room).emit('chat message', data.msg);
}