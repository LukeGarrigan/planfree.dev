<template>
  <div class="tickets-wrapper">
    <div class="tickets-header">
      <span class="tickets-title">Tickets</span>
      <button class="close-tickets" aria-label="Close tickets" @click="emit('close')">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
              d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z"
              fill="currentColor"/>
        </svg>
      </button>
    </div>
    <button v-if="canControl" class="add-ticket-button" type="button" @click="showAddModal = true">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2h6Z"/>
      </svg>
      <span>Add ticket</span>
    </button>
    <div class="tickets-container">
      <ul>
        <li v-for="ticket in tickets" :key="ticket.id">
          <div class="ticket" @click="voteOn(ticket)">
            <div class="ticket-body">
              <h4 :class="{ voting: ticket.votingOn }">
                <span v-if="ticket.ticketId" class="ticket-id">{{ ticket.ticketId }}</span>
                {{ ticket.title }}
                <span v-if="ticket.score" class="ticket-score">{{ ticket.score }}</span>
              </h4>
              <p v-if="ticket.description" class="ticket-description">{{ ticket.description }}</p>
              <a
                  v-if="ticket.link"
                  class="ticket-link"
                  :href="ticket.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  @click.stop
              >Open link</a>
            </div>
            <PFLittleButton v-if="canControl" class="delete-button" type="delete" @clicked="deleteTicket(ticket.id)"></PFLittleButton>
          </div>
        </li>
      </ul>
    </div>
    <AddTicketModal
        v-if="showAddModal"
        @completed="addedTicket"
        @close="showAddModal = false"
    ></AddTicketModal>
  </div>
</template>

<script setup lang="ts">

import {ref} from "vue";
import {useTickets} from "@/composables/useTickets";
import {useGameEngine} from "@/composables/useGameEngine";
import Ticket from "@/view-models/tickets";
import PFLittleButton from "@/components/LittleButton.vue";
import AddTicketModal, {NewTicket} from "@/components/AddTicketModal.vue";

const {tickets, ticketUpdated} = useTickets();
// When a room is locked to the host, only the host edits the ticket list.
const {canControl} = useGameEngine();

const emit = defineEmits(['close']);

const showAddModal = ref(false);

// Short, readable reference used when the user doesn't supply their own ID.
function generateTicketId(): string {
  return `T-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

const addedTicket = (ticket: NewTicket) => {
  tickets.value.push({
    id: crypto.randomUUID(),
    ticketId: ticket.ticketId || generateTicketId(),
    title: ticket.title,
    link: ticket.link,
    description: ticket.description,
    voted: false,
    average: '0',
    closest: '0',
    score: '0',
    votingOn: false
  });
  showAddModal.value = false;
  ticketUpdated();
}

function deleteTicket(id: string) {
  tickets.value = tickets.value.filter(t => t.id !== id);
  ticketUpdated();
}

function voteOn(ticket: Ticket) {
  if (!canControl.value) return;
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

.add-ticket-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 44px;
  margin-bottom: 12px;
  border: none;
  border-radius: 12px;
  background: var(--accent);
  color: var(--accent-text);
  cursor: pointer;
  font-family: "Montserrat", sans-serif;
  transition: opacity 0.1s ease-in-out;

  svg {
    fill: currentColor;
  }

  span {
    font-size: 15px;
    font-weight: 600;
    color: var(--accent-text);
  }

  &:hover {
    opacity: 0.85;
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
  align-items: flex-start;
  word-wrap: break-word;
  overflow-wrap: break-word;
  gap: 10px;
  font-family: "Montserrat", sans-serif;

  .ticket-body {
    flex: 1;
    min-width: 0;
  }

  h4 {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    margin: 0;
  }

  .delete-button {
    visibility: hidden;
    margin-top: 2px;
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

.ticket-id {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  background: var(--surface-input);
  color: var(--text-muted);
}

.ticket-score {
  background: var(--accent);
  padding: 5px;
  border-radius: 50%;
  color: var(--accent-text);
  min-width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.ticket-description {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--text-muted);
  white-space: pre-wrap;
}

.ticket-link {
  display: inline-block;
  margin-top: 4px;
  font-size: 13px;
  color: var(--accent);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
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