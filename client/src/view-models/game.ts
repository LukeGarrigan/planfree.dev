import GameFormat from "./gameFormat";
import Ticket from "@/view-models/tickets";
import Player from "./player";

export default interface Game {
    players: Player[];
    tickets: Ticket[];
    gameType: GameFormat;
}