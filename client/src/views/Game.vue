<template>
  <div>
    <h1 class="screen-reader-only">Planfree.dev game lobby</h1>
    <Modal
        v-if="modal"
        title="Choose your display name"
        @completed="enteredName"
    ></Modal>
    <Sharing v-if="showShareModal" title='share_modal_title' subTitle='share_modal_subtitle' @share="shareGame"></Sharing>
    <div v-if="!modal && !settings && !showShareModal"   class="home">
      <div class="top-buttons">
        <button class="edit-name-button" @click="modal = true">
          <div>{{ name }}</div>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path
                d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z" />
            </svg>
          </div>
        </button>
        <button v-if="!showCopiedToClipboard" class="button invite" @click="copyToClipboard()">
          <div>{{('invite_players') }}</div>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
              <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
                d="M 11.542969 0 C 10.246094 0 9.027344 0.488281 8.109375 1.371094 C 7.191406 2.253906 6.683594 3.429688 6.683594 4.679688 C 6.683594 5.929688 7.191406 7.105469 8.109375 7.992188 C 9.027344 8.875 10.246094 9.363281 11.542969 9.363281 C 12.839844 9.363281 14.0625 8.875 14.980469 7.992188 C 15.785156 7.214844 16.273438 6.214844 16.378906 5.136719 C 18.875 5.320312 20.832031 7.339844 20.8125 9.773438 L 19.054688 8.078125 C 18.871094 7.898438 18.570312 7.898438 18.386719 8.078125 C 18.203125 8.253906 18.203125 8.539062 18.386719 8.71875 L 20.789062 11.035156 C 20.878906 11.125 21 11.167969 21.121094 11.167969 C 21.242188 11.167969 21.359375 11.121094 21.453125 11.035156 L 23.859375 8.726562 C 24.046875 8.550781 24.046875 8.261719 23.863281 8.085938 C 23.679688 7.90625 23.378906 7.910156 23.195312 8.085938 L 21.75 9.46875 C 21.609375 6.675781 19.292969 4.40625 16.378906 4.226562 C 16.273438 3.148438 15.785156 2.148438 14.980469 1.371094 C 14.0625 0.488281 12.84375 0 11.546875 0 Z M 11.542969 0.910156 C 12.589844 0.910156 13.574219 1.300781 14.3125 2.015625 C 15.050781 2.726562 15.460938 3.675781 15.460938 4.683594 C 15.460938 5.554688 15.15625 6.378906 14.597656 7.042969 C 13.90625 6.738281 13.167969 6.542969 12.417969 6.457031 C 12.445312 6.28125 12.472656 6.097656 12.5 5.921875 C 12.671875 5.8125 12.792969 5.65625 12.804688 5.523438 C 12.824219 5.359375 12.847656 5.195312 12.867188 5.027344 C 12.890625 5.050781 12.921875 5.070312 12.960938 5.074219 L 12.976562 5.074219 C 13.050781 5.074219 13.117188 5.019531 13.125 4.941406 L 13.207031 4.179688 C 13.21875 4.097656 13.15625 4.027344 13.074219 4.019531 L 13.058594 4.019531 C 13.035156 4.019531 13.003906 4.027344 12.984375 4.039062 C 13.003906 3.890625 13.019531 3.746094 13.039062 3.601562 C 13.054688 3.402344 13.15625 2.871094 12.757812 2.527344 C 12.46875 2.253906 12.007812 2.121094 11.542969 2.121094 C 11.082031 2.121094 10.621094 2.253906 10.332031 2.527344 C 9.933594 2.871094 10.035156 3.402344 10.050781 3.601562 C 10.066406 3.746094 10.085938 3.890625 10.105469 4.039062 C 10.082031 4.027344 10.054688 4.019531 10.03125 4.019531 C 10.023438 4.019531 10.019531 4.019531 10.015625 4.019531 C 9.933594 4.027344 9.875 4.097656 9.882812 4.179688 L 9.964844 4.941406 C 9.972656 5.019531 10.039062 5.074219 10.113281 5.074219 L 10.128906 5.074219 C 10.164062 5.074219 10.199219 5.054688 10.222656 5.027344 C 10.242188 5.195312 10.261719 5.359375 10.28125 5.523438 C 10.296875 5.65625 10.417969 5.8125 10.59375 5.921875 C 10.617188 6.097656 10.644531 6.28125 10.671875 6.457031 C 9.921875 6.542969 9.183594 6.738281 8.492188 7.046875 C 7.933594 6.378906 7.628906 5.554688 7.628906 4.683594 C 7.628906 3.675781 8.039062 2.726562 8.777344 2.015625 C 9.515625 1.300781 10.5 0.910156 11.542969 0.910156 Z M 2.460938 4.308594 C 2.257812 4.316406 2.078125 4.445312 2.023438 4.644531 C 1.957031 4.886719 2.105469 5.136719 2.355469 5.199219 L 4.328125 5.714844 C 1.902344 7.21875 1.015625 10.25 2.269531 12.757812 C 1.964844 12.941406 1.683594 13.160156 1.425781 13.410156 C 0.507812 14.292969 0 15.46875 0 16.71875 C 0 17.96875 0.507812 19.144531 1.425781 20.03125 C 2.339844 20.914062 3.5625 21.402344 4.859375 21.402344 C 6.15625 21.402344 7.378906 20.914062 8.296875 20.03125 C 9.214844 19.144531 9.71875 17.96875 9.71875 16.71875 C 9.71875 15.46875 9.214844 14.292969 8.296875 13.410156 C 7.378906 12.527344 6.15625 12.039062 4.859375 12.039062 C 4.253906 12.039062 3.660156 12.144531 3.113281 12.351562 C 2.035156 10.179688 2.875 7.542969 5.066406 6.34375 L 4.417969 8.660156 C 4.351562 8.898438 4.5 9.148438 4.753906 9.214844 C 4.792969 9.222656 4.835938 9.230469 4.875 9.230469 C 5.082031 9.230469 5.273438 9.097656 5.328125 8.894531 L 6.210938 5.734375 C 6.28125 5.492188 6.132812 5.242188 5.878906 5.175781 L 2.601562 4.324219 C 2.554688 4.3125 2.507812 4.308594 2.460938 4.308594 Z M 18.230469 12.039062 C 16.933594 12.039062 15.714844 12.527344 14.796875 13.410156 C 13.875 14.292969 13.371094 15.46875 13.371094 16.71875 C 13.371094 17.96875 13.875 19.144531 14.792969 20.03125 C 15.265625 20.484375 15.816406 20.832031 16.417969 21.066406 C 15.042969 23.171875 12.164062 23.855469 9.929688 22.59375 L 12.335938 21.976562 C 12.585938 21.914062 12.738281 21.664062 12.667969 21.421875 C 12.601562 21.179688 12.347656 21.039062 12.09375 21.101562 L 8.8125 21.945312 C 8.558594 22.007812 8.410156 22.257812 8.476562 22.5 L 9.347656 25.660156 C 9.402344 25.867188 9.59375 26 9.804688 26 C 9.84375 26 9.882812 25.996094 9.925781 25.984375 C 10.175781 25.917969 10.324219 25.671875 10.257812 25.429688 L 9.734375 23.527344 C 10.566406 23.9375 11.457031 24.136719 12.34375 24.136719 C 14.296875 24.136719 16.210938 23.171875 17.285156 21.441406 C 17.308594 21.402344 17.328125 21.363281 17.335938 21.324219 C 17.628906 21.375 17.925781 21.402344 18.230469 21.402344 C 19.527344 21.402344 20.746094 20.914062 21.664062 20.03125 C 22.582031 19.144531 23.089844 17.96875 23.089844 16.71875 C 23.089844 15.46875 22.582031 14.292969 21.664062 13.410156 C 20.746094 12.527344 19.527344 12.039062 18.230469 12.039062 Z M 4.859375 12.949219 C 5.90625 12.949219 6.886719 13.339844 7.628906 14.054688 C 8.367188 14.765625 8.773438 15.710938 8.773438 16.722656 C 8.773438 17.589844 8.472656 18.417969 7.914062 19.082031 C 7.222656 18.777344 6.484375 18.582031 5.734375 18.496094 C 5.757812 18.316406 5.785156 18.136719 5.8125 17.960938 C 5.988281 17.851562 6.109375 17.695312 6.121094 17.5625 C 6.140625 17.398438 6.160156 17.234375 6.183594 17.066406 C 6.207031 17.089844 6.238281 17.109375 6.277344 17.113281 L 6.289062 17.113281 C 6.367188 17.113281 6.433594 17.058594 6.441406 16.980469 L 6.523438 16.21875 C 6.53125 16.136719 6.472656 16.066406 6.386719 16.058594 C 6.382812 16.058594 6.378906 16.058594 6.375 16.058594 C 6.347656 16.058594 6.320312 16.066406 6.300781 16.078125 C 6.316406 15.929688 6.335938 15.785156 6.355469 15.640625 C 6.367188 15.441406 6.472656 14.910156 6.074219 14.566406 C 5.78125 14.292969 5.320312 14.160156 4.859375 14.160156 C 4.398438 14.160156 3.9375 14.292969 3.648438 14.566406 C 3.25 14.910156 3.351562 15.441406 3.367188 15.640625 C 3.382812 15.785156 3.402344 15.929688 3.417969 16.078125 C 3.398438 16.0625 3.371094 16.058594 3.347656 16.058594 L 3.332031 16.058594 C 3.25 16.066406 3.191406 16.136719 3.195312 16.21875 L 3.277344 16.980469 C 3.285156 17.058594 3.351562 17.113281 3.429688 17.113281 L 3.441406 17.113281 C 3.480469 17.113281 3.511719 17.089844 3.539062 17.066406 C 3.558594 17.234375 3.578125 17.398438 3.597656 17.5625 C 3.609375 17.695312 3.734375 17.851562 3.910156 17.960938 C 3.933594 18.136719 3.960938 18.316406 3.984375 18.496094 C 3.238281 18.582031 2.5 18.777344 1.804688 19.082031 C 1.246094 18.414062 0.941406 17.59375 0.941406 16.722656 C 0.941406 15.710938 1.351562 14.765625 2.089844 14.054688 C 2.832031 13.339844 3.8125 12.949219 4.859375 12.949219 Z M 18.230469 12.949219 C 19.277344 12.949219 20.257812 13.339844 21 14.054688 C 21.738281 14.765625 22.148438 15.710938 22.148438 16.722656 C 22.148438 17.589844 21.84375 18.417969 21.285156 19.082031 C 20.59375 18.777344 19.855469 18.582031 19.105469 18.496094 C 19.128906 18.316406 19.15625 18.136719 19.183594 17.960938 C 19.355469 17.851562 19.480469 17.695312 19.492188 17.5625 C 19.511719 17.398438 19.53125 17.234375 19.554688 17.066406 C 19.578125 17.089844 19.609375 17.109375 19.648438 17.113281 L 19.660156 17.113281 C 19.738281 17.113281 19.800781 17.058594 19.808594 16.980469 L 19.890625 16.21875 C 19.902344 16.136719 19.839844 16.066406 19.757812 16.058594 L 19.746094 16.058594 C 19.71875 16.058594 19.691406 16.066406 19.671875 16.078125 C 19.691406 15.929688 19.707031 15.785156 19.722656 15.640625 C 19.738281 15.441406 19.839844 14.910156 19.441406 14.566406 C 19.152344 14.292969 18.691406 14.160156 18.230469 14.160156 C 17.765625 14.160156 17.304688 14.292969 17.019531 14.566406 C 16.621094 14.910156 16.722656 15.441406 16.738281 15.640625 C 16.753906 15.785156 16.773438 15.929688 16.789062 16.078125 C 16.769531 16.0625 16.742188 16.058594 16.714844 16.058594 C 16.710938 16.058594 16.707031 16.058594 16.699219 16.058594 C 16.621094 16.066406 16.558594 16.136719 16.566406 16.21875 L 16.652344 16.980469 C 16.660156 17.058594 16.722656 17.113281 16.800781 17.113281 L 16.816406 17.113281 C 16.851562 17.113281 16.886719 17.089844 16.90625 17.066406 C 16.929688 17.234375 16.949219 17.398438 16.96875 17.5625 C 16.980469 17.695312 17.105469 17.851562 17.28125 17.960938 C 17.304688 18.136719 17.328125 18.316406 17.355469 18.496094 C 16.605469 18.582031 15.867188 18.777344 15.175781 19.085938 C 14.617188 18.414062 14.316406 17.59375 14.316406 16.722656 C 14.316406 15.710938 14.722656 14.765625 15.460938 14.054688 C 16.203125 13.339844 17.1875 12.949219 18.230469 12.949219 Z M 18.230469 12.949219 " />
            </svg>
          </div>
        </button>
        <button v-if="!modal && showCopiedToClipboard" class="button invite copied no-hover">
          <div>{{ ("copy_to_clip") }}</div>
          <div></div>
        </button>
        <button class="fib-button" @click="toggleTickets">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
            <path
              d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h440l200 200v440q0 33-23.5 56.5T760-120H200Zm0-80h560v-400H600v-160H200v560Zm80-80h400v-80H280v80Zm0-320h200v-80H280v80Zm0 160h400v-80H280v80Zm-80-320v160-160 560-560Z" />
          </svg>
        </button>
      </div>

      <div class="top-left">
        <PFLittleButton type="github" popover-text="View repo" @clicked="goToGithub()"></PFLittleButton>
        <PFLittleButton type="pwa" popover-text="Install as app" @clicked="installPWA()"></PFLittleButton>

        <div class="voting-on" v-if="votingOnName">
          <p class="voting-on-label">Voting on: <b>{{ votingOnName }}</b></p>
        </div>
      </div>

      <button v-if="!playerHasVoted() && !showVotes" class="button no-hover">
        <span>Cast your votes</span>
      </button>
      <button v-if="playerHasVoted() && !showVotes" class="button" @click="showVotesClicked()">
        <span>Show votes!</span>
      </button>
      <button
          v-if="showVotes && countdown === 0"
          class="button start"
          @click="startNewGame()"
      >
        <span>{{ startGameMessage }}</span>
      </button>
      <button v-if="showVotes && countdown > 0" class="button no-hover">
        <span>{{ countdown }}</span>
      </button>

      <div class="players" v-for="player in players" :key="player.id">
        <div class="player" :class="{ voted: player.vote }">
          <span v-if="showVotes && countdown === 0">{{ player.vote }}</span>
        </div>
        <div class="name">
          <span>{{ player.name }}</span>
        </div>
      </div>

      <div class="options" v-if="!showVotes || (showVotes && countdown !== 0)">
        <button
            v-for="vote in [
            '0',
            '1',
            '2',
            '3',
            '5',
            '8',
            '13',
            '21',
            '34',
            '55',
            '89',
            '?',
          ]"
            :key="`vote-${vote}`"
            class="fib-button"
            :class="{ current: currentVote === vote }"
            @click="performVote(vote)"
            :disabled="currentVote === vote || countdown > 0"
        >
          <span>{{ vote }}</span>
        </button>
      </div>
      <div class="results-container" v-if="showVotes && countdown === 0">
        <div class="results">
          <div class="average">Average: {{ getAverage() }}</div>
          <div class="popular">Closest: {{ getClosest() }}</div>
        </div>
      </div>
      <div class="tickets" v-show="showTickets">
        <Tickets></Tickets>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Modal from "@/components/Modal.vue";
import Player from "@/view-models/player";
import { io } from "socket.io-client";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import Tickets from "@/components/Tickets.vue";
import { useTickets } from "@/composables/useTickets";
import { useGameEngine } from "@/composables/useGameEngine";
import PFLittleButton from "@/components/PFLittleButton.vue";
import Sharing from "../components/SharingModal.vue";

let showInstallPwa = ref(false);
const modal = ref(true);
const showCopiedToClipboard = ref(false);
const name = ref("");
const showTickets = ref(false);
const {votingOnName, tickets} = useTickets();
const {socket, setSocket, players, showVotes, countdown, currentVote} = useGameEngine();
const showShareModal = ref(false);

let deferredPrompt: any;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallPwa.value = true;
});

async function shareGame(shareType:string) {
  showShareModal.value = false;
}

function installPWA() {
  deferredPrompt.prompt();
}

onMounted(() => {
  if (joiningAGame()) {
    const route = useRoute();
    const newSocket = io(process.env.VUE_APP_SERVER, {
      query: {
        roomId: route.params.id,
      },
    });
    setSocket(newSocket);
  }

  const storedName = localStorage.getItem("name");
  if (storedName) {
    enteredName(storedName);
  }
});

const startGameMessage = computed(() => {
  if (!tickets.value || tickets.value.every(t => t.score)) {
    return 'Start new game!'
  } else {
    return 'Vote next issue!'
  }
});
function showVotesClicked() {
  socket.value.emit("show");
}

function performVote(vote: string) {
  socket.value.emit("vote", vote);
  currentVote.value = vote;
}

function startNewGame() {
  socket.value.emit("restart");
}

function emitName(name: string) {
  socket.value.emit("name", name);
}

function enteredName(updatedName: string) {
  name.value = updatedName;
  emitName(updatedName);
  localStorage.setItem("name", updatedName);
  modal.value = false;
}

function playerHasVoted() {
  return (
    players.value.filter((p: Player) => p.vote !== null && p.vote !== undefined).length > 0
  );
}

function copyToClipboard() {
  showShareModal.value = true;
  // const tempInput = document.createElement("input");
  // tempInput.value = window.location.href;
  // document.body.appendChild(tempInput);
  // tempInput.select();
  // document.execCommand("copy");
  // document.body.removeChild(tempInput);
  // showCopiedToClipboard.value = true;
  // setTimeout(() => (showCopiedToClipboard.value = false), 3000);
}

const average = computed(() => {
  let count = 0;
  let total = 0;
  for (const player of players.value) {
    if (player.vote && player.vote !== "?") {
      total += parseInt(player.vote);
      count++;
    }
  }
  return total / count;
})

function getAverage() {
  return (average.value).toFixed(1).replace(/\.0+$/, "");
}

function getClosest() {
  const fib = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]
  let closest = 0;
  let smallestDiff = Number.MAX_VALUE;
  for (const number of fib) {
    const difference = Math.abs(number - average.value);
    if (difference < smallestDiff) {
      smallestDiff = difference;
      closest = number;
    }
  }
  return closest;
}

function goToGithub() {
  open("https://github.com/LukeGarrigan/planfree.dev");
}

function joiningAGame() {
  const currentState = socket.value;
  return (
    currentState &&
    Object.keys(currentState).length === 0 &&
    currentState.constructor === Object
  );
}


const toggleTickets = () => showTickets.value = !showTickets.value;
</script>

<style scoped lang="scss">
.players {
  user-select: none;
  position: relative;
  top: 5em;
  width: 320px;
  height: 320px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .player {
    border-radius: 26px;
    border: none;
    cursor: default;
    width: 64px;
    height: 80px;
    background: #f3f0f1;
    box-shadow: -6px -6px 10px rgba(255, 255, 255, 0.8),
      6px 6px 10px rgba(0, 0, 0, 0.2);
    color: #161b1f;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .name {
    margin-top: 1em;
    text-align: center;
    font-size: 26px;
  }

  .voted {
    background: #54e8dd;
  }
}

.home {
  display: flex;
  justify-content: center;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}

.button {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 9999;
  top: 45%;
  width: 320px;
  height: 80px;
  background: #f3f0f1;
  border-radius: 32px;
  text-align: center;
  border: none;
  cursor: pointer;
  transition: all 0.1s ease-in-out;
  box-shadow: -6px -6px 10px rgba(255, 255, 255, 0.8),
    6px 6px 10px rgba(0, 0, 0, 0.2);
  color: #161b1f;

  &:hover {
    opacity: 0.3;
    box-shadow: -6px -6px 10px rgba(255, 255, 255, 0.8),
      6px 6px 10px rgba(0, 0, 0, 0.2);
  }

  &:active {
    opacity: 1;
    box-shadow: inset -4px -4px 8px rgba(255, 255, 255, 0.5),
      inset 8px 8px 16px rgba(0, 0, 0, 0.1);
  }

}

.top-left {
  display: flex;
  flex-direction: row;
  left: 20px;
  top: 35px;
  position: absolute;
  gap: 5px;

  .voting-on {
    font-family: "Montserrat", sans-serif;
    margin-left: 20px;
    font-size: 20px;
    display: flex;
    align-items: center;
    word-wrap: break-word;
    white-space: normal;
    overflow: auto;
    max-width: 40vw;
    text-align: left;
  }
}

@media only screen and (max-width: 700px) {
  .top-left {
    visibility: hidden;
  }
}

.top-buttons {
  display: flex;
  flex-direction: row;
  width: 100%;
  position: absolute;
  justify-content: flex-end;
  top: 2%;
  right: 2%;
  gap: 20px;

  .invite {
    position: relative;
    user-select: none;
    gap: 10px;
    width: 300px;
    height: 70px;
    font-size: 26px;

    svg {
      position: relative;
      left: 2px;
      top: 3px;
      fill: #161b1f;
    }
  }

  .edit-name-button {
    position: relative;
    user-select: none;
    height: 70px;
    font-size: 26px;
    background: #f3f0f1;
    border-radius: 32px;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    opacity: 0.5;
    cursor: pointer;

    &:hover {
      opacity: 1;
    }

    &:hover::before {
      transform: scaleX(1);
    }

    &:before {
      content: "";
      position: absolute;
      display: block;
      width: 100%;
      height: 2px;
      bottom: 10px;
      right: 10px;
      background-color: #000;
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }

    svg {
      position: relative;
      left: 2px;
      top: 3px;
    }
  }
}

.screen-reader-only {
  position: absolute;
  width: 0px;
  overflow: hidden;
}

.copied {
  background: #54e8dd;
}

.no-hover {
  pointer-events: none;
}

span {
  font-family: "Montserrat", sans-serif;
  font-size: 26px;
  font-weight: semibold;
  color: #161b1f;
  user-select: none;
}

.results-container {
  display: flex;
  justify-content: center;
  position: absolute;
  flex-wrap: wrap;
  height: 200px;
  gap: 30px;
  width: 90%;
  bottom: 5%;
  font-size: 20px;
  color: #54e8dd;

  .results {
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: #161b1f;
    border-radius: 26px;
    border: none;
    width: 250px;
    height: 100px;
    transition: all 0.1s ease-in-out;
    box-shadow: -6px -6px 10px rgba(255, 255, 255, 0.8),
      6px 6px 10px rgba(0, 0, 0, 0.2);

    user-select: none;
    font-family: "Montserrat", sans-serif;
    font-weight: semibold;

    &:focus {
      outline: none;
    }

    .average {
      padding: 4px;
    }
  }
}

.options {
  display: flex;
  justify-content: center;
  position: absolute;
  flex-wrap: wrap;
  height: 200px;
  gap: 30px;
  width: 90%;
  bottom: 5%;
  user-select: none;
}

.fib-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f0f1;
  border-radius: 26px;
  text-align: center;
  border: none;
  cursor: pointer;
  width: 64px;
  height: 70px;
  transition: all 0.1s ease-in-out;
  box-shadow: -6px -6px 10px rgba(255, 255, 255, 0.8),
    6px 6px 10px rgba(0, 0, 0, 0.2);
  color: #161b1f;

  &:not(.current) {
    &:hover {
      opacity: 0.3;
      box-shadow: -6px -6px 10px rgba(255, 255, 255, 0.8),
        6px 6px 10px rgba(0, 0, 0, 0.2);
    }

    &:active {
      opacity: 1;
      box-shadow: inset -4px -4px 8px rgba(255, 255, 255, 0.5),
        inset 8px 8px 16px rgba(0, 0, 0, 0.1);
    }
  }

  &.current {
    background: #54e8dd;
  }
}
</style>