// Sentry must be initialised before anything else is required so its
// auto-instrumentation and global uncaught-exception/unhandled-rejection
// handlers are in place. No-ops when SENTRY_DSN is unset (e.g. local dev).
const Sentry = require('@sentry/node');
if (process.env.SENTRY_DSN) {
    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV || 'development',
        tracesSampleRate: 1.0,
        enableLogs: true,
        integrations: [
            Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
        ]
    });
}

const http = require('http').createServer((req, res) => {
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
        // `revealed` gates whether actual vote values are broadcast. While false
        // the server only tells clients *that* a player has voted, never what
        // they picked, so nobody can peek at others' votes before the reveal.
        // `timer*` back the optional round countdown (see startTimer).
        // `hostUserId`/`locked` back the moderator feature: when `locked`, only
        // the host may drive the session. `bannedUserIds` keeps kicked users out.
        room = {
            players: [], tickets: [], gameType: gameTypes[0], teamName: '',
            autoReveal: true, revealed: false,
            timerEndsAt: null, timerDuration: 0, timerHandle: null,
            hostUserId: null, locked: true, bannedUserIds: new Set()
        };
        rooms.set(roomId, room);
    }
    return room;
}

// Voters are everyone who isn't spectating. Auto-reveal and the average only
// ever consider voters, so a watching Scrum Master / PO never blocks a round.
function voters(room) {
    return room.players.filter(p => !p.spectator);
}

// Is this socket's player the room host?
function isHost(room, socket) {
    const player = room.players.find(p => p.id == socket.id);
    return !!player && player.userId === room.hostUserId;
}

// Whether this socket is allowed to drive the session. Everyone can when the
// room is unlocked (today's free-for-all); only the host can once it's locked.
function canControl(room, socket) {
    return !room.locked || isHost(room, socket);
}

// Stop and forget any running round timer. Safe to call when none is set.
function clearRoomTimer(room) {
    if (room.timerHandle) {
        clearTimeout(room.timerHandle);
    }
    room.timerHandle = null;
    room.timerEndsAt = null;
}

// What clients need to render the countdown: seconds left + the original
// length. Clients tick locally from `remaining` so we don't broadcast per
// second. Returns null when no timer is running.
function timerState(room) {
    if (!room.timerEndsAt) return null;
    const remaining = Math.max(0, Math.ceil((room.timerEndsAt - Date.now()) / 1000));
    return { remaining, duration: room.timerDuration };
}

// Fires when a round timer runs out: reveal whatever votes are in (so the timer
// actually forces a reveal), but only if at least one voter has voted —
// otherwise revealing would average over nothing.
function onTimerExpired(roomId) {
    const room = rooms.get(roomId);
    if (!room) return;
    clearRoomTimer(room);
    if (voters(room).some(p => p.vote)) {
        showVotes(roomId);
    }
    updateClientsInRoom(roomId);
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
    const spectator = socket.handshake.query['spectator'] === 'true';

    // A kicked user stays out until the room is gone. Tell them so the client
    // can route home, then drop the socket before they rejoin a player slot.
    if (room.bannedUserIds.has(userId)) {
        socket.emit('kicked');
        socket.disconnect(true);
        return;
    }

    const existingPlayer = userId
        ? room.players.find(p => p.userId === userId)
        : null;
    if (existingPlayer) {
        existingPlayer.id = socket.id;
        existingPlayer.spectator = spectator;
    } else {
        room.players.push({ id: socket.id, userId: userId, name: '', vote: undefined, spectator: spectator });
    }

    // The first person in (the creator), or anyone arriving when the seat is
    // vacant (host left), becomes host.
    if (!room.hostUserId || !room.players.some(p => p.userId === room.hostUserId)) {
        room.hostUserId = userId;
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

        // Auto-reveal once every voter has voted, unless the room has turned it
        // off (in which case a player must hit "Show votes!" manually).
        const roomVoters = voters(room);
        if (room.autoReveal && roomVoters.length > 0 && roomVoters.every(p => p.vote)) {
            showVotes(roomId);
        }
        updateClientsInRoom(roomId);
    });

    socket.on('show', () => {
        const room = rooms.get(roomId);
        if (!room || !canControl(room, socket)) return;
        showVotes(roomId);
        // showVotes only emits the 'show' (average/closest) event; it doesn't
        // broadcast room state. Push an update too so the ticket's freshly-set
        // score reaches clients now, matching the auto-reveal path — otherwise
        // a manual reveal leaves the score stale until the next 'restart'.
        updateClientsInRoom(roomId);
    });

    socket.on('restart', () => {
        const room = rooms.get(roomId);
        if (!room || !canControl(room, socket)) return;
        restartGame(roomId);
    });

    socket.on('gameTypeChanged', (newGameType) => {
        const room = rooms.get(roomId);
        if (!room || !canControl(room, socket)) return;
        room.gameType = newGameType;
        updateClientsInRoom(roomId);
    });

    socket.on('teamNameChanged', (newTeamName) => {
        const room = rooms.get(roomId);
        if (!room || !canControl(room, socket)) return;
        room.teamName = (newTeamName ?? '').trim();
        updateClientsInRoom(roomId);
    });

    socket.on('autoRevealChanged', (autoReveal) => {
        const room = rooms.get(roomId);
        if (!room || !canControl(room, socket)) return;
        room.autoReveal = !!autoReveal;
        // Turning it on while every voter has already voted should reveal now,
        // rather than waiting for the next vote.
        const roomVoters = voters(room);
        if (room.autoReveal && roomVoters.length > 0 && roomVoters.every(p => p.vote)) {
            showVotes(roomId);
        }
        updateClientsInRoom(roomId);
    });

    socket.on('spectatorChanged', (isSpectator) => {
        const room = rooms.get(roomId);
        if (!room) return;
        const player = room.players.find(p => p.id == socket.id);
        if (!player) return;
        player.spectator = !!isSpectator;
        // A spectator has no vote in the round; drop any cast vote so they stop
        // counting toward the average and auto-reveal.
        if (player.spectator) {
            player.vote = undefined;
        }
        // Stepping out of the round may mean the remaining voters are all in,
        // so re-check auto-reveal.
        const roomVoters = voters(room);
        if (room.autoReveal && roomVoters.length > 0 && roomVoters.every(p => p.vote)) {
            showVotes(roomId);
        }
        updateClientsInRoom(roomId);
    });

    socket.on('startTimer', (seconds) => {
        const room = rooms.get(roomId);
        if (!room || !canControl(room, socket)) return;
        // Clamp to a sane range; default to a minute.
        const duration = Math.min(600, Math.max(5, Math.floor(Number(seconds)) || 60));
        clearRoomTimer(room);
        room.timerDuration = duration;
        room.timerEndsAt = Date.now() + duration * 1000;
        room.timerHandle = setTimeout(() => onTimerExpired(roomId), duration * 1000);
        updateClientsInRoom(roomId);
    });

    socket.on('cancelTimer', () => {
        const room = rooms.get(roomId);
        if (!room || !canControl(room, socket)) return;
        clearRoomTimer(room);
        updateClientsInRoom(roomId);
    });

    // Ephemeral, non-stored emoji blasts relayed to the whole room. Allow-listed
    // so a client can't broadcast arbitrary strings to everyone.
    socket.on('reaction', (emoji) => {
        const room = rooms.get(roomId);
        if (!room) return;
        const allowed = ['👍', '👎', '🎉', '😂', '🤔', '❤️'];
        if (!allowed.includes(emoji)) return;
        const player = room.players.find(p => p.id == socket.id);
        io.to(roomId).emit('reaction', { emoji, name: player ? player.name : '' });
    });

    // Re-vote the current ticket: reset votes and hide again, but deliberately
    // do NOT advance to the next ticket the way 'restart' does.
    socket.on('revote', () => {
        const room = rooms.get(roomId);
        if (!room || !canControl(room, socket)) return;
        room.revealed = false;
        clearRoomTimer(room);
        room.players.forEach(p => p.vote = undefined);
        io.to(roomId).emit('restart');
        updateClientsInRoom(roomId);
    });

    socket.on('lockChanged', (locked) => {
        const room = rooms.get(roomId);
        if (!room || !isHost(room, socket)) return;
        room.locked = !!locked;
        updateClientsInRoom(roomId);
    });

    socket.on('transferHost', (targetUserId) => {
        const room = rooms.get(roomId);
        if (!room || !isHost(room, socket)) return;
        if (room.players.some(p => p.userId === targetUserId)) {
            room.hostUserId = targetUserId;
            updateClientsInRoom(roomId);
        }
    });

    socket.on('kick', (targetUserId) => {
        const room = rooms.get(roomId);
        if (!room || !isHost(room, socket)) return;
        if (!targetUserId || targetUserId === room.hostUserId) return; // never kick the host
        const target = room.players.find(p => p.userId === targetUserId);
        if (!target) return;
        room.bannedUserIds.add(targetUserId);
        const targetSocket = io.sockets.sockets.get(target.id);
        if (targetSocket) {
            // Tell them, then drop the socket — its disconnect handler removes
            // the player and broadcasts the updated room.
            targetSocket.emit('kicked');
            targetSocket.disconnect(true);
        } else {
            room.players = room.players.filter(p => p.userId !== targetUserId);
            updateClientsInRoom(roomId);
        }
    });

    socket.on('ticket', (updatedTickets) => {
        const room = rooms.get(roomId);
        if (!room || !canControl(room, socket)) return;
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
                clearRoomTimer(room); // don't leave a setTimeout pointing at a dead room
                rooms.delete(roomId);
            } else {
                // If the host just left, hand the room to the longest-present
                // remaining player (players are kept in join order).
                if (player.userId === room.hostUserId) {
                    room.hostUserId = room.players[0].userId;
                }
                updateClientsInRoom(roomId);
            }
        }
    });

    socket.on('pong', () => {
        // keeping the connection alive
    })
});

// Project a player into what's safe to send to clients. The actual `vote`
// value is only included once the room is revealed; before that clients get a
// `hasVoted` flag so they can show "this person has voted" without leaking the
// value (which a curious player could otherwise read straight off the wire).
function publicPlayer(room, player) {
    return {
        id: player.id,
        userId: player.userId,
        name: player.name,
        spectator: !!player.spectator,
        hasVoted: !!player.vote,
        vote: room.revealed ? player.vote : undefined
    };
}

function updateClientsInRoom(roomId) {
    const room = rooms.get(roomId);
    if (!room) return;
    io.to(roomId).emit('update', {
        players: room.players.map(p => publicPlayer(room, p)),
        tickets: room.tickets,
        gameType: room.gameType ?? gameTypes[0],
        teamName: room.teamName,
        autoReveal: room.autoReveal,
        timer: timerState(room),
        hostUserId: room.hostUserId,
        locked: room.locked
    });
}

function restartGame(roomId) {
    const room = rooms.get(roomId);
    if (!room) return;

    room.revealed = false; // hide votes again for the new round
    clearRoomTimer(room); // a new round starts fresh, without a stale countdown
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
    clearRoomTimer(room); // revealing ends the round, so stop any countdown
    room.revealed = true; // from now on real vote values are broadcast
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
        avg = Math.round(average * 100) / 100;
    }

    if (room.tickets.length > 0) {
        const ticket = room.tickets.find(f => f.votingOn);
        if (ticket) {
            ticket.score = closest;
        }
    }

    io.to(roomId).emit('show', { average: avg, closest: closest, distribution: getDistribution(roomId) });
}

// Tally how many voters picked each card, ordered by the deck so the client can
// render the spread (e.g. three 5s, two 8s) without doing any counting itself.
function getDistribution(roomId) {
    const room = rooms.get(roomId);
    const values = room.gameType.values;
    const counts = new Map();
    for (const player of room.players) {
        if (player.spectator) continue;
        if (player.vote === undefined || player.vote === null) continue;
        counts.set(player.vote, (counts.get(player.vote) || 0) + 1);
    }
    return [...counts.entries()]
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => values.indexOf(a.value) - values.indexOf(b.value));
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
