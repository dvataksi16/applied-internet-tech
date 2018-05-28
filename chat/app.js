const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

// view engine setup

app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function(socket){
  console.log(socket.id, " connected");
  socket.on('chat', function(data){
    io.sockets.emit('chat',data);
  });
  socket.on('typing', function(data){
    socket.broadcast.emit('typing',data);
  });
});
server.listen(3000);
