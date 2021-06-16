let serverFunc = require('./config/serverFunc');
let createError = require('http-errors');
let logger = require('morgan');
let app = require('express')();
let server = require('http').createServer(app);
let socketHandler = require('./controller/socket/socketHandler')
let env = process.env.NODE_ENV || 'development'
let pTimeout = env === 'production' ? 60000 : 10000
let pInterval = env === 'production' ? 25000 : 10000
let io = require('socket.io')(server, {
  'pingTimeout': pTimeout,
  'pingInterval': pInterval,
  reconnetion: true
});

io.on('connection', async (socket) => {
  await socketHandler(io, socket)
})

var chat = io.of('/chat').on('connection', function (socket) {
  socket.on('chat message', function (data) {
      console.log('message from client: ', data);

      var name = socket.name = data.name;
      var room = socket.room = data.room;

      // room에 join한다
      socket.join(room);
      // room에 join되어 있는 클라이언트에게 메시지를 전송한다
      chat.to(room).emit('chat message', data.msg);
  });
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

server.listen(3000, function () {
  console.log('Socket IO server listening on port 3000');
});

server.on('error', async (error) => {
  await serverFunc.onError(error)
});

server.on('listening', async () => {
  await serverFunc.onListening(server)
});

app.use(logger('dev'));
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});
app.use(function (req, res, next) {
  next(createError(404));
});

exports.server = server;