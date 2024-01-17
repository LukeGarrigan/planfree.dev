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
let tickets = [];


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
            showVotes(roomId);
        }
        updateClientsInRoom(roomId);
    });

    socket.on('show', () => {
        showVotes(roomId);
    });

    socket.on('restart', () => {
        restartGame(roomId);
    });

    socket.on('ticket', (updatedTickets) => {
        tickets = tickets.filter(ticket => ticket.roomId !== roomId);
        for (const ticket of updatedTickets) {
            ticket.roomId = roomId;
        }
        if (updatedTickets.length === 1) {
            updatedTickets[0].votingOn = true;
        }

        tickets.push(...updatedTickets)
        updateClientsInRoom(roomId);
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
    const roomTickets = tickets.filter(p => p.roomId == roomId);
    io.to(roomId).emit('update', {
        players: roomPlayers,
        tickets: roomTickets
    });
}

function restartGame(roomId) {
    const roomPlayers = players.filter(p => p.roomId == roomId);
    const roomTickets = tickets.filter(p => p.roomId == roomId);
    roomPlayers.forEach(p => p.vote = undefined);

    const ticketVotingOn = roomTickets.find(f => f.votingOn);
    if (!(ticketVotingOn && !ticketVotingOn.score)) { // they haven't chosen a new ticket in wrapup
        roomTickets.forEach(p => p.votingOn = false);
        const ticketToVoteOn = roomTickets.find(t => !t.score);
        if (ticketToVoteOn) {
            ticketToVoteOn.votingOn = true;
        }
    }
    console.log(`Restarted game with Players: ${roomPlayers.map(p => p.name).join(", ")}`);
    io.to(roomId).emit('restart');
    io.to(roomId).emit('update', {
        players: roomPlayers,
        tickets: roomTickets
    });
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

function showVotes(roomId) {
    const roomTickets = tickets.filter(p => p.roomId == roomId);

    if (roomTickets) {
        const average = getAverage(roomId);
        const fib = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]
        let closest = 0;
        let smallestDiff = Number.MAX_VALUE;
        for (const number of fib) {
            const difference = Math.abs(number - average);
            if (difference < smallestDiff) {
                smallestDiff = difference;
                closest = number;
            }
        }

        const ticket = roomTickets.find(f => f.votingOn);
        if (ticket) {
            ticket.score = closest;
        }
    }

    io.to(roomId).emit('show');
}

function getAverage(roomId) {
    const roomPlayers = players.filter(p => p.roomId == roomId);
    let count = 0;
    let total = 0;
    for (const player of players) {
        if (player.vote && player.vote !== "?") {
            total += parseInt(player.vote);
            count++;
        }
    }
    return total / count;
}
