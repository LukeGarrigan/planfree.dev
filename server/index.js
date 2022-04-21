const app = require('express')();
const http = require('http').createServer(app);
const short = require('short-uuid');
require('dotenv').config()
const io = require("socket.io")(http, {
    cors: {
      origin: process.env.ORIGIN || 'http://localhost:8081',
      methods: ["GET", "POST"]
    }
  });

// keeping the connection alive
setInterval(() => {
  io.emit('ping');
  logRooms();
}, 8000);

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

console.log(process.env.ORIGIN);
http.listen(process.env.PORT || 3000, () => {
  console.log('listening on *:3000');
});


let players = [];

io.on('connection', (socket) => {
    console.log('A user connected', socket.id);
    let roomId = socket.handshake.query['roomId'];
    if (!roomId) {
      roomId = short.generate();
      socket.emit('room', roomId);
    }
    socket.join(roomId);

    players.push({id: socket.id, name: '', roomId: roomId});
    socket.on('name', (name) => {
      let player = players.find(p => p.id == socket.id);
      console.log(`User entered name ${name}`);
      if (player) {
        console.log(`Changing name from ${player.name} to ${name}`)
        player.name = name;
      }
      updateClientsInRoom(roomId);
    });

    socket.on('vote', (vote) => {
      let player = players.find(p => p.id == socket.id);
      if (player) {
        player.vote = vote;
      }
      console.log(`Player ${player.name} voted ${player.vote}`);

      const playersInRoom = players.filter(p => p.roomId == roomId);
      if (playersInRoom.every(p => p.vote)) {
        io.to(roomId).emit('show');
      }
      updateClientsInRoom(roomId);
    });

    socket.on('show', () => {
      io.to(roomId).emit('show');
    });

    socket.on('restart', () => {
      restartGame(roomId);
    });

    socket.on('disconnect', () => {
      const player = players.find(player => player.id === socket.id);
      console.log(`Player ${player.name} has disconnected`);
      players = players.filter(player => player.id !== socket.id);
      updateClientsInRoom(roomId);
     });


     // keeping the connection alive
     socket.on('pong', () => {
      let player = players.find(p => p.id == socket.id);
     })

});

function updateClientsInRoom(roomId) {
  const roomPlayers = players.filter(p => p.roomId == roomId);
  io.to(roomId).emit('update', roomPlayers);
}

function restartGame(roomId) {
  const roomPlayers = players.filter(p => p.roomId == roomId);
  roomPlayers.forEach(p => p.vote = undefined);
  console.log(`Restarted game with Players: ${roomPlayers.map(p => p.name).join(", ")}`);
  io.to(roomId).emit('restart');
  io.to(roomId).emit('update', roomPlayers);
}

function logRooms() {
  const rooms = players.map(e => e.roomId);
  if (rooms) {
    for (const room of rooms.filter((val, i, arr) => arr.indexOf(val) == i)) {
      const playersInRoom = players.filter(p => p.roomId == room).map(p => p.name);
      console.log(`Room: ${room} - Players: ${playersInRoom.join(", ")}`);
    }
  }
}



