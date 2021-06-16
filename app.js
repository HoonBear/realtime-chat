/* import custom modules */
let serverFunc = require('./config/server');
let socketHandler = require('./controller/handler/socketHandler');
let scheduleHandler = require('./controller/handler/scheduleHandler');
let groupHandler = require('./controller/handler/groupHandler');
/* import node modules */
let createError = require('http-errors');
let logger = require('morgan');
let app = require('express')();
let server = require('http').createServer(app);
/* setting socket.io */
let env = process.env.NODE_ENV || 'development';
let pTimeout = env === 'production' ? 60000 : 10000;
let pInterval = env === 'production' ? 25000 : 10000;
let io = require('socket.io')(server, {
  'pingTimeout': pTimeout,
  'pingInterval': pInterval,
  reconnetion: true
});

const commonNamespace = io.on('connection', async (socket) => {
  await socketHandler(io, socket, commonNamespace)
})

const scheduleNamespace = io.of('/schedule').on('connection', async(socket) => {
  await scheduleHandler(io, socket, scheduleNamespace);
});

const groupNamespace = io.of('/group').on('connection', async(socket) => {
  await groupHandler(io, socket, groupNamespace);
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