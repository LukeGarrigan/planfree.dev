import {computed, ref} from "vue";
import Player from "@/view-models/player";
import Game from "@/view-models/game";
import Ticket from "@/view-models/tickets";
import GameFormat from "@/view-models/gameFormat";
import {getUserId} from "@/utils/user";

const players = ref<Player[]>([]);
const socket = ref({} as any);
const showVotes = ref(false);
const countdown = ref(0);
const interval: any = ref(null);
const currentVote: any = ref(null);
const gameFormat = ref<GameFormat>();
const closestValue: any = ref(null);
const averageValue: any = ref(null);
// Per-card tally for the revealed round, e.g. [{ value: '5', count: 3 }].
const distribution = ref<{ value: string; count: number }[]>([]);
const tickets = ref<Ticket[]>([]);
const teamName = ref("");
const autoReveal = ref(true);
// Round timer: seconds left (null when no timer is running) plus the original
// length. We tick `timerRemaining` down locally so the server doesn't have to
// broadcast every second; each `update` re-syncs us to the authoritative value.
const timerRemaining = ref<number | null>(null);
const timerDuration = ref(0);
let timerInterval: any = null;
// Transient emoji reactions floating over the board; each removes itself.
// `offset` (0..1) spreads simultaneous reactions horizontally so they don't
// stack on the same spot.
const reactions = ref<{ id: number; emoji: string; name: string; offset: number }[]>([]);
// Moderator state: the host's userId and whether the room is locked to host-only
// control. `kicked` flips when this user is removed so the view can route home.
const hostUserId = ref<string | null>(null);
const locked = ref(false);
const kicked = ref(false);
const amHost = computed(() => !!hostUserId.value && hostUserId.value === getUserId());
// Everyone may drive an unlocked room; only the host may once it's locked.
const canControl = computed(() => !locked.value || amHost.value);

export function useGameEngine() {
    function setSocket(newSocket: any) {
        socket.value = newSocket;
        setupSocketHandlers();
    }

    // Re-seed the local countdown from the server's `remaining` and tick it down
    // once a second. Re-runs on every update so we never drift from the server.
    function syncTimer(timer: { remaining: number; duration: number } | null) {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        if (!timer) {
            timerRemaining.value = null;
            return;
        }
        timerDuration.value = timer.duration;
        timerRemaining.value = timer.remaining;
        timerInterval = setInterval(() => {
            if (timerRemaining.value === null) return;
            timerRemaining.value = Math.max(0, timerRemaining.value - 1);
            if (timerRemaining.value === 0) {
                clearInterval(timerInterval);
                timerInterval = null;
            }
        }, 1000);
    }

    function setupSocketHandlers() {
        socket.value.on("update", (game: Game) => {
            players.value = game.players;
            tickets.value = game.tickets;
            gameFormat.value = game.gameType;
            teamName.value = game.teamName ?? "";
            autoReveal.value = game.autoReveal ?? true;
            hostUserId.value = game.hostUserId ?? null;
            locked.value = game.locked ?? false;
            syncTimer(game.timer ?? null);
        });

        socket.value.on("kicked", () => {
            kicked.value = true;
        });

        socket.value.on("reaction", (r: { emoji: string; name: string }) => {
            const id = Date.now() + Math.random();
            reactions.value.push({ id, emoji: r.emoji, name: r.name, offset: Math.random() });
            // Drop it once its float-up animation has finished.
            setTimeout(() => {
                reactions.value = reactions.value.filter(x => x.id !== id);
            }, 2500);
        });

        socket.value.on("gameTypes", (gameTypes: []) => {
            // save the game types to the local storage
            localStorage.setItem("gameTypes", JSON.stringify(gameTypes));
        });

        socket.value.on("show", (results: any) => {
            closestValue.value = results.closest;
            averageValue.value = results.average;
            distribution.value = results.distribution ?? [];
            showVotes.value = true;
            clearInterval(interval.value);
            countdown.value = 3;
            interval.value = setInterval(() => {
                countdown.value -= 1;
                if (countdown.value == 0) {
                    clearInterval(interval.value);
                }
            }, 1000);
        });

        socket.value.on("restart", () => {
            showVotes.value = false;
            currentVote.value = null;
            distribution.value = [];
        });

        socket.value.on("ping", () => {
            socket.value.emit("pong");
        });
    }

    return {
        socket,
        players,
        setSocket,
        showVotes,
        countdown,
        currentVote,
        interval,
        tickets,
        gameFormat,
        closestValue,
        averageValue,
        distribution,
        teamName,
        autoReveal,
        timerRemaining,
        timerDuration,
        reactions,
        hostUserId,
        locked,
        amHost,
        canControl,
        kicked
    };
}