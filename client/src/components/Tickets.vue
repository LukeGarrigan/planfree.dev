<template>
  <div class="tickets-wrapper">

    <PFInput v-model="ticketName" @completed="addedTicket" placeholder="Add issue title"></PFInput>
    <div class="tickets-container">
      <ul>
        <li v-for="ticket in tickets">
          <div class="ticket" @click="voteOn(ticket.id)">
            <h4 :class="{ voting : votingOnId === ticket.id }">{{ ticket.name }} <span v-if="ticket.score">{{ ticket.score }}</span></h4>
            <button class="star-button" aria-label="delete ticket" @click="voteOn(ticket.id)">
              <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="m438-426 198-198-57-57-141 141-56-56-57 57 113 113Zm42 240q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/></svg>
            </button>
            <button class="star-button" aria-label="delete ticket" @click="deleteTicket(ticket.id)">
              <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20">
                <path
                    d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
              </svg>
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">

import PFInput from "@/components/PFInput.vue";
import {computed, ref, watch} from "vue";
import {v4 as uuidv4} from 'uuid';
import {useTickets} from "@/composables/useTickets";

const { tickets, votingOnId } = useTickets();

let ticketName = ref('');

const addedTicket = () => {
  tickets.value.push({
    name: ticketName.value,
    voted: false,
    id: uuidv4()
  });
  ticketName.value = '';
}

watch(tickets.value, () => {
  if (!votingOnId.value) {
    votingOnId.value = tickets.value.find(t => !t.voted)?.id;
  }
})

function deleteTicket(id: string) {
  tickets.value = tickets.value.filter(t => t.id !== id);
}

function voteOn(ticketId: string) {
  votingOnId.value = ticketId;
}
</script>

<style scoped lang="scss">
.tickets-wrapper {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  height: 50%;
  width: 360px;
  text-align: left;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.tickets-container {
  display: flex;
  flex-direction: column;
  overflow: auto;
  height: 70%;
}

.ticket {
  cursor: pointer;
  display: flex;
  text-align: left;
  align-items: center;
  word-wrap: break-word;
  overflow-wrap: break-word;
  gap: 10px;
  font-family: "Montserrat", sans-serif;
  &:hover {
    .star-button {
      visibility: visible;
    }
  }

  .voting {
    text-decoration: underline;
    text-decoration-color: #54e8dd;
    text-decoration-thickness: 2px;
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
