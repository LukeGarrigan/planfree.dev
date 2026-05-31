const http = require('http').createServer((req, res) => {
    // Tiny health-check route (replaces the former single Express route).
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('<h1>Hello world</h1>');
});
const {randomBytes} = require('node:crypto');
const io = require("socket.io")(http, {
    cors: {
        origin: process.env.ORIGIN || 'http://localhost:8080',
        methods: ["GET", "POST"]
    }
});

setInterval(() => {
    io.emit('ping');
    logRooms();
}, 20000);

http.listen(process.env.PORT || 3000, () => {
    console.log(`listening on *:${process.env.PORT || 3000}`);
});

// All room state lives here, keyed by roomId. Each entry is a self-contained
// room: { players, tickets, gameType, teamName }. A room is created on first
// connect and deleted when its last player disconnects, so nothing leaks.
const rooms = new Map();

let gameTypes = [
    { name: 'Fibonacci', values: [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, '?'] },
    { name: 'T-Shirt', values: ['XXS', 'XS', 'S', 'M', 'L', 'XL', '?'] },
    { name: 'Powers of 2', values: [0, 1, 2, 4, 8, 16, 32, 64, '?'] },
]

function getOrCreateRoom(roomId) {
    let room = rooms.get(roomId);
    if (!room) {
        room = { players: [], tickets: [], gameType: gameTypes[0], teamName: '' };
        rooms.set(roomId, room);
    }
    return room;
}

io.on('connection', (socket) => {
    console.log('A user connected', socket.id);
    let roomId = socket.handshake.query['roomId'];
    if (!roomId) {
        roomId = randomBytes(8).toString('hex');
        const room = getOrCreateRoom(roomId);
        const teamName = socket.handshake.query['teamName'];
        if (teamName) {
            room.teamName = teamName;
        }
        // The room creator picks a deck on the "Name your team" screen. Look it
        // up by name so the server stays the source of truth for deck values.
        const chosenGameType = gameTypes.find(g => g.name === socket.handshake.query['gameType']);
        if (chosenGameType) {
            room.gameType = chosenGameType;
        }
        socket.emit('room', roomId);
    }
    const room = getOrCreateRoom(roomId);
    socket.emit('gameTypes', gameTypes)
    socket.join(roomId);

    // Recognise a returning user (reconnect/refresh/another tab) by their
    // persistent userId and reattach them to their existing player slot,
    // preserving their name and vote, instead of creating a duplicate.
    const userId = socket.handshake.query['userId'];
    const existingPlayer = userId
        ? room.players.find(p => p.userId === userId)
        : null;
    if (existingPlayer) {
        existingPlayer.id = socket.id;
    } else {
        room.players.push({ id: socket.id, userId: userId, name: '', vote: undefined });
    }

    socket.on('name', (name) => {
        const room = rooms.get(roomId);
        if (!room) return;
        const player = room.players.find(p => p.id == socket.id);
        if (player) {
            console.log(`Changing name from ${player.name} to ${name}`)
            player.name = name;
        }
        updateClientsInRoom(roomId);
    });

    socket.on('vote', (vote) => {
        const room = rooms.get(roomId);
        if (!room) return;
        const player = room.players.find(p => p.id == socket.id);
        if (player) {
            player.vote = vote;
            console.log(`Player ${player.name} voted ${player.vote}`);
        }

        if (room.players.every(p => p.vote)) {
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
        const room = rooms.get(roomId);
        if (!room) return;
        room.gameType = newGameType;
        updateClientsInRoom(roomId);
    });

    socket.on('teamNameChanged', (newTeamName) => {
        const room = rooms.get(roomId);
        if (!room) return;
        room.teamName = (newTeamName ?? '').trim();
        updateClientsInRoom(roomId);
    });

    socket.on('ticket', (updatedTickets) => {
        const room = rooms.get(roomId);
        if (!room) return;
        if (updatedTickets.length === 1) {
            updatedTickets[0].votingOn = true;
        }
        room.tickets = updatedTickets;
        updateClientsInRoom(roomId);
    });

    socket.on('disconnect', () => {
        // Only remove the player if this socket is still the one attached to
        // them. If they've already reconnected on a new socket, their player
        // slot now points at that socket and should be left intact.
        const room = rooms.get(roomId);
        if (!room) return;
        const player = room.players.find(player => player.id === socket.id);
        if (player) {
            console.log(`Player ${player.name} has disconnected`);
            room.players = room.players.filter(p => p.id !== socket.id);
            // Drop the whole room once the last player leaves so room state
            // (players, tickets, deck) doesn't accumulate forever.
            if (room.players.length === 0) {
                rooms.delete(roomId);
            } else {
                updateClientsInRoom(roomId);
            }
        }
    });

    socket.on('pong', () => {
        // keeping the connection alive
    })
});

function updateClientsInRoom(roomId) {
    const room = rooms.get(roomId);
    if (!room) return;
    io.to(roomId).emit('update', {
        players: room.players,
        tickets: room.tickets,
        gameType: room.gameType ?? gameTypes[0],
        teamName: room.teamName
    });
}

function restartGame(roomId) {
    const room = rooms.get(roomId);
    if (!room) return;

    room.players.forEach(p => p.vote = undefined); // reset all the player's votes

    const ticketVotingOn = room.tickets.find(f => f.votingOn);
    if (!(ticketVotingOn && !ticketVotingOn.score)) {
        room.tickets.forEach(p => p.votingOn = false);
        const ticketToVoteOn = room.tickets.find(t => !t.score);
        if (ticketToVoteOn) {
            ticketToVoteOn.votingOn = true;
        }
    }
    console.log(`Restarted game with Players: ${room.players.map(p => p.name).join(", ")}`);
    io.to(roomId).emit('restart');
    updateClientsInRoom(roomId);
}

function logRooms() {
    for (const [roomId, room] of rooms) {
        const playerNames = room.players.map(p => p.name);
        console.log(`Room: ${roomId} - Players: ${playerNames.join(", ")}`);
    }
}

function showVotes(roomId) {
    const room = rooms.get(roomId);
    if (!room) return;
    // find the text in the gametype where the index is the closest
    let closest = 0;
    let avg;
    const average = getAverage(roomId);
    const values = room.gameType.values;
    let upwards = Math.abs(values.find(p => p >= average) - average);
    let downWards = Math.abs(values.findLast(p => p <= average) - average);
    // the game type is not numeric use indexes instead
    if (isNaN(upwards)) {
        upwards = values.find((v, k) => k >= average);
        downWards = values.findLast((v, k) => k <= average);
        if (upwards < downWards) {
            closest = values.find((v, k) => k >= average);
        }
        else {
            closest = values.findLast((v, k) => k <= average);
        }
        avg = values[Math.floor(average)];
    }
    else {
        if (upwards < downWards) {
            closest = values.find(p => p >= average);
        }
        else {
            closest = values.findLast(p => p <= average);
        }
        avg = average;
    }

    if (room.tickets.length > 0) {
        const ticket = room.tickets.find(f => f.votingOn);
        if (ticket) {
            ticket.score = closest;
        }
    }

    io.to(roomId).emit('show', { average: avg, closest: closest });
}

function getAverage(roomId) {
    const room = rooms.get(roomId);
    const roomGameType = room.gameType;
    let count = 0;
    let total = 0;
    for (const player of room.players) {
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
