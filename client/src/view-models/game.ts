import Player from "@/view-models/player";
import Ticket from "@/view-models/tickets";

export default interface Game {
    players: Player[];
    tickets: Ticket[];
}