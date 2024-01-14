import {computed, ref} from "vue";

interface Ticket {
    id: string;
    name: string,
    score: number,
    voted: boolean
}

const tickets = ref<Ticket[]>([]);
let votingOnId = ref('');

export function useTickets() {

    const votingOnName = computed(() => tickets.value.find(f => f.id === votingOnId.value)?.name);

    return {tickets, votingOnId, votingOnName};
}