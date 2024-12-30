import {computed, ref} from "vue";
import Ticket from "@/view-models/tickets";
import {useGameEngine} from "@/composables/useGameEngine";
let votingOnId = ref('');
const { tickets, socket } = useGameEngine();
export function useTickets() {
    const votingOnName = computed(() => tickets.value.find((f: Ticket) => f.votingOn === true)?.name);
    function ticketUpdated() {
        socket.value.emit('ticket', tickets.value);
    }
    return {tickets, votingOnId, votingOnName, ticketUpdated};
}