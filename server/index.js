const app = require('express')();
const http = require('http').createServer(app);
const io = require("socket.io")(http, {
    cors: {
      origin: "http://localhost:8081",
      methods: ["GET", "POST"]
    }
  });

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});


let players = [];

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    players.push({id: socket.id, name: ''});

    socket.on('name', (name) => {
      let player = players.find(p => p.id == socket.id);
      if (player) {
        player.name = name;
      }
      updateClients();
    })

    socket.on('disconnect', () => {
      players = players.filter(player => player.id !== socket.id);
      updateClients();
     });
});

function updateClients() {
  io.sockets.emit('update', players);
}


