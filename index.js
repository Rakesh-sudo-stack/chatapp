const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const port = process.env.PORT || 3000;
const io = require('socket.io')(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname+'/index.html');
});


const users = {};
io.on('connection',(socket)=>{
    socket.on('new-user',(name)=>{
        users[socket.id] = name;
        socket.broadcast.emit('user-joined',name);
    });

    socket.on('send',(message)=>{
        socket.broadcast.emit('receive',{"user":users[socket.id],"message":message});
    });

    socket.on('disconnect', () => {
      userleft = users[socket.id];
      socket.broadcast.emit('left',userleft);
      delete users[socket.id];
    });
})

server.listen(port, () => {
  console.log('listening on *:3000');
});