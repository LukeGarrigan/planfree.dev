<template>
  <div class="tickets-wrapper">
    <div class="tickets-header">
      <span class="tickets-title">Stories</span>
      <button class="close-tickets" aria-label="Close stories" @click="emit('close')">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
              d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z"
              fill="currentColor"/>
        </svg>
      </button>
    </div>
    <PFInput v-model="ticketName" @completed="addedTicket" placeholder="Add story title"></PFInput>
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

const emit = defineEmits(['close']);

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

  /* Make the add-story input fill the panel rather than its fixed 295px width
     so it never overflows the (narrower) panel on small screens. */
  :deep(.input-container) {
    width: 100%;
  }

  :deep(.input) {
    flex: 1;
    width: auto;
    min-width: 0;
  }
}

.tickets-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.tickets-title {
  font-family: "Montserrat", sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
}

.close-tickets {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--text);
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 1;
  }
}

.tickets-container {
  display: flex;
  flex-direction: column;
  overflow: auto;
  height: 70%;
  background: var(--surface);
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
    text-decoration-color: var(--accent);
    text-decoration-thickness: 2px;
  }
}

.ticket h4 span {
  background: var(--accent);
  padding: 5px;
  border-radius: 50%;
  color: var(--accent-text);
  height: 18px;
  display: inline-block;
  text-align: center;
}

@media only screen and (max-width: 700px) {
  /* Full-width bottom sheet instead of a fixed 360px panel off the edge */
  .tickets-wrapper {
    right: 12px;
    left: 12px;
    bottom: 12px;
    top: auto;
    transform: none;
    width: auto;
    height: 50%;
    padding: 12px;
    box-sizing: border-box;
    background: var(--surface);
    border-radius: 16px;
    box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.18);
    z-index: 20;
  }

  .tickets-container {
    height: calc(100% - 100px);
  }

  /* No :hover on touch — keep delete reachable so tickets can be removed */
  .ticket .delete-button {
    visibility: visible;
  }
}
</style>