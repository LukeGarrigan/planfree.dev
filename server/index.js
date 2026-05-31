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

setInterval(() => {
    io.emit('ping');
    logRooms();
}, 20000);

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

http.listen(process.env.PORT || 3000, () => {
    console.log(`listening on *:${process.env.PORT || 3000}`);
});

let players = [];
let tickets = [];
let gameType = [];
let teams = [];

let gameTypes = [
    { name: 'Fibonacci', values: [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, '?'] },
    { name: 'T-Shirt', values: ['XXS', 'XS', 'S', 'M', 'L', 'XL', '?'] },
    { name: 'Powers of 2', values: [0, 1, 2, 4, 8, 16, 32, 64, '?'] },
]

io.on('connection', (socket) => {
    console.log('A user connected', socket.id);
    let roomId = socket.handshake.query['roomId'];
    if (!roomId) {
        roomId = short.generate();
        const teamName = socket.handshake.query['teamName'];
        if (teamName) {
            teams.push({ roomId: roomId, name: teamName });
        }
        socket.emit('room', roomId);
    }
    socket.emit('gameTypes', gameTypes)
    socket.join(roomId);

    // Recognise a returning user (reconnect/refresh/another tab) by their
    // persistent userId and reattach them to their existing player slot,
    // preserving their name and vote, instead of creating a duplicate.
    const userId = socket.handshake.query['userId'];
    const existingPlayer = userId
        ? players.find(p => p.userId === userId && p.roomId === roomId)
        : null;
    if (existingPlayer) {
        existingPlayer.id = socket.id;
    } else {
        players.push({ id: socket.id, userId: userId, name: '', roomId: roomId });
    }
    gameType.push({ id: socket.id, gameType: gameTypes[0], roomId: roomId });

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

    socket.on('gameTypeChanged', (newGameType) => {
        gameType.find(p => p.roomId == roomId).gameType = newGameType;
        updateClientsInRoom(roomId);
    });

    socket.on('teamNameChanged', (newTeamName) => {
        const name = (newTeamName ?? '').trim();
        const team = teams.find(t => t.roomId == roomId);
        if (team) {
            team.name = name;
        } else {
            // Room was created without a team name — create the entry now.
            teams.push({ roomId: roomId, name: name });
        }
        updateClientsInRoom(roomId);
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
        // Only remove the player if this socket is still the one attached to
        // them. If they've already reconnected on a new socket, their player
        // slot now points at that socket and should be left intact.
        const player = players.find(player => player.id === socket.id);
        if (player) {
            console.log(`Player ${player.name} has disconnected`);
            players = players.filter(p => p.id !== socket.id);
            updateClientsInRoom(roomId);
        }
    });

    socket.on('pong', () => {
        let player = players.find(p => p.id == socket.id);
        // keeping the connection alive
    })
});

function updateClientsInRoom(roomId) {
    const roomPlayers = players.filter(p => p.roomId == roomId);
    const roomTickets = tickets.filter(p => p.roomId == roomId);
    const roomGameType = gameType.find(p => p.roomId == roomId).gameType ?? gameTypes[0];
    io.to(roomId).emit('update', {
        players: roomPlayers,
        tickets: roomTickets,
        gameType: roomGameType,
        teamName: getTeamName(roomId)
    });
}

function getTeamName(roomId) {
    return teams.find(t => t.roomId == roomId)?.name ?? '';
}

function restartGame(roomId) {
    const roomPlayers = players.filter(p => p.roomId == roomId);
    const roomTickets = tickets.filter(p => p.roomId == roomId);
    const roomGameType = gameType.find(p => p.roomId == roomId).gameType ?? gameTypes[0];

    roomPlayers.forEach(p => p.vote = undefined); // reset all the player's votes

    const ticketVotingOn = roomTickets.find(f => f.votingOn);
    if (!(ticketVotingOn && !ticketVotingOn.score)) {
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
        tickets: roomTickets,
        gameType: roomGameType,
        teamName: getTeamName(roomId)
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
    // find the text in the gametype where the index is the closest
    let closest = 0;
    const average = getAverage(roomId);
    const fib = gameType.find(p => p.roomId == roomId).gameType.values
    let upwards = Math.abs(fib.find(p => p >= average)- average);
    let downWards = Math.abs(fib.findLast(p => p <= average) - average);
    // the game type is not numeric use indexes instead
    if(isNaN(upwards)){
        upwards = fib.find((v, k) => k >= average);
        downWards = fib.findLast((v, k) => k <= average);
        if(upwards < downWards){
            closest = fib.find((v,k) => k >= average);
        }
        else{
            closest = fib.findLast((v,k) => k <= average);
        }  
        avg = fib[Math.floor(average)];  
    }
    else
    {
        if(upwards < downWards){
            closest = fib.find(p => p >= average);
        }
        else{
            closest = fib.findLast(p => p <= average);
        }
        avg = average;
    }
    
    if (roomTickets.length>0) {
        const ticket = roomTickets.find(f => f.votingOn);
        if (ticket) { 
            ticket.score = closest;
        }
    }

    io.to(roomId).emit('show', { average: avg, closest: closest });
}

function getAverage(roomId) {
    const roomPlayers = players.filter(p => p.roomId == roomId);
    const roomGameType = gameType.find(p => p.roomId == roomId).gameType
    let count = 0;
    let total = 0;
    for (const player of roomPlayers) {
        if (player.vote && player.vote !== "?") {
            // get the current index of the vote
            const index = roomGameType.values.indexOf(player.vote);
            let numberValue = Number(player.vote);
            if (isNaN(numberValue)) {
                numberValue = index;
            }

            total += parseInt(numberValue);
            count++;
        }
    }
    return total / count;
}
