import {computed, ref} from "vue";
import Player from "@/view-models/player";
import Game from "@/view-models/game";
import Ticket from "@/view-models/tickets";
const players = ref<Player[]>([]);
const socket = ref({});
const showVotes = ref(false);
const countdown = ref(0);
const interval: any = ref(null);
const currentVote: any = ref(null);
const tickets = ref<Ticket[]>([]);
export function useGameEngine() {
    function setSocket(newSocket: any) {
       socket.value = newSocket;
       setupSocketHandlers();
    }
    function setupSocketHandlers() {
        socket.value.on("update", (game: Game) => {
            players.value = game.players;
            tickets.value = game.tickets;
        });

       socket.value.on("show", () => {
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
        });

        socket.value.on("ping", () => {
            socket.value.emit("pong");
        });
    }

    return { socket, players, setSocket, showVotes, countdown, currentVote, interval, tickets };
}