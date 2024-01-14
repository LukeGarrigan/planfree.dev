<template>
  <div class="tickets-container">
    <PFInput v-model="ticketName" @completed="addedTicket" placeholder="Issue title"></PFInput>
    <div v-for="(ticket, id) in tickets">
      <div class="ticket" @click="voteOn(ticket)">
        <button class="star-button" aria-label="delete ticket" @click="deleteTicket(ticket.id)">
          <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
        </button>
        <h4>{{ ticket.id === votingOnId ? 'Voting' : 'Issue'}}: {{ ticket.name }} <span v-if="ticket.score">{{ ticket.score }}</span></h4>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import PFInput from "@/components/PFInput.vue";
import {computed, ref} from "vue";
import {v4 as uuidv4} from 'uuid';

interface Ticket {
  id: string;
  name: string,
  score: number,
  voted: boolean
}

let tickets: Ticket[] = ref([]);
let ticketName = ref('');

const addedTicket = () => {
  const newTicket = {
    name: ticketName.value,
    voted: false,
    id: uuidv4()
  } as Ticket;
  tickets.value = [newTicket, ...tickets.value]
  ticketName.value = '';
}

  const votingOnId = computed(() => {
    return tickets.value.find(t => !t.voted)?.id ?? '';
  })

function deleteTicket(id: string ) {
  tickets.value = tickets.value.filter(t => t.id !== id);
}

function voteOn(ticket: Ticket) {
  const index = tickets.value.indexOf(ticket);
  tickets.value.splice(index, 1);
  tickets.value = [ticket, ...tickets.value];
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.tickets-container {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  height: 50%;
  width: 360px;
  text-align: left;
  overflow: auto;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.ticket {
  cursor: pointer;
  display: flex;
  text-align: left;
  justify-content: center;
  align-items: center;
  word-wrap: break-word;
  overflow-wrap: break-word;
  gap: 10px;

  &:hover {
    .star-button {
      visibility: visible;
    }
  }
}

span {
  background: black;
  padding: 5px;
  border-radius: 100%;
  color: #54e8dd;
  width: 10px;
}


.star-button {
  // todo pull into own component
  visibility: hidden;
  background: #f3f0f1;
  border-radius: 32px;
  text-align: center;
  border: none;
  cursor: pointer;
  width: 30px;
  height: 30px;
  box-shadow: -6px -6px 10px rgba(255, 255, 255, 0.8),
  6px 6px 10px rgba(0, 0, 0, 0.2);
  color: #161b1f;

  &:hover {
    opacity: 0.3;
    box-shadow: -6px -6px 10px rgba(255, 255, 255, 0.8),
    6px 6px 10px rgba(0, 0, 0, 0.2);
  }
}
</style>
