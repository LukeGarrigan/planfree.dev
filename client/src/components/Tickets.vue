<template>
  <div class="tickets-wrapper">
    <PFInput v-model="ticketName" @completed="addedTicket" placeholder="Add issue title"></PFInput>
    <div class="tickets-container">
      <ul>
        <li v-for="ticket in tickets">
          <div class="ticket" @click="voteOn(ticket)">
            <h4 :class="{ voting: ticket.votingOn }">{{ ticket.name }} <span v-if="ticket.score">{{
                ticket.score
              }}</span></h4>
            <PFLittleButton class="delete-button" type="delete" @clicked="deleteTicket(ticket.id)"></PFLittleButton>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">

import PFInput from "@/components/Input.vue";
import {ref} from "vue";
import {v4 as uuidv4} from 'uuid';
import {useTickets} from "@/composables/useTickets";
import Ticket from "@/view-models/tickets";
import PFLittleButton from "@/components/LittleButton.vue";

const {tickets, ticketUpdated} = useTickets();

let ticketName = ref('');

const addedTicket = () => {
  tickets.value.push({
    name: ticketName.value,
    voted: false,
    id: uuidv4(),
    average: '0',
    closest: '0',
    score: '0',
    votingOn: false
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
  overflow-wrap: break-word;
  word-wrap: break-word;
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

  .delete-button {
    visibility: hidden;
  }

  &:hover {
    .delete-button {
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
  height: 18px;
  display: inline-block;
  text-align: center;
}
</style>