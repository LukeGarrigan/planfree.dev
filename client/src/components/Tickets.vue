<template>
  <div class="tickets-wrapper">

    <PFInput v-model="ticketName" @completed="addedTicket" placeholder="Add issue title"></PFInput>
    <div class="tickets-container">
      <ul>
        <li v-for="ticket in tickets">
          <div class="ticket" @click="voteOn(ticket)">
            <h4 :class="{ voting : ticket.votingOn }">{{ ticket.name }} <span v-if="ticket.score">{{ ticket.score }}</span></h4>
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
import Ticket from "@/view-models/tickets";
import {useGameEngine} from "@/composables/useGameEngine";

const { tickets, votingOnId, ticketUpdated } = useTickets();
const { countdown } = useGameEngine();

let ticketName = ref('');

const addedTicket = () => {
  tickets.value.push({
    name: ticketName.value,
    voted: false,
    id: uuidv4()
  });
  ticketName.value = '';
  ticketUpdated();
}

function deleteTicket(id: string) {
  tickets.value = tickets.value.filter(t => t.id !== id);
  ticketUpdated();
}

function voteOn(ticket: Ticket) {
  for (const value of tickets.value) {
    value.votingOn = false;
  }

  ticket.votingOn = true;
  ticketUpdated();
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
  background: #f3f0f1;
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
  background: #54e8dd;
  padding: 5px;
  border-radius: 50%;
  color: black;
  width: 18px;
  height: 18px;
  display: inline-block;
  text-align: center;
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
