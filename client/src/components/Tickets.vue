<template>
  <div class="tickets-container">
    <PFInput v-model="ticketName" @completed="addedTicket" placeholder="Issue title"></PFInput>
    <div v-for="(ticket, id) in tickets">
      <div class="ticket">
        <h4>Issue {{id + 1}}: {{ticket.name}} <span>{{ticket.score}}</span></h4>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import PFInput from "@/components/PFInput.vue";
import {ref} from "vue";


interface Ticket {
  id: string;
  name: string,
  score: number,
  voted: boolean
}

let tickets: Ticket[] = [];
let ticketName = ref('');

const addedTicket = () => {
  console.log('Added ticket name');

  tickets.push({
    name: ticketName.value,
    voted: false,
    score: 5
  } as Ticket)
  ticketName.value = '';
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
  width: 350px; // Corrected width with unit
  text-align: left;
  overflow: auto;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.ticket {
  word-wrap: break-word;
  overflow-wrap: break-word;
}

span {
  background: black;
  padding:  5px;
  border-radius: 100%;
  color: #54e8dd;
  width: 10px;
}

</style>
