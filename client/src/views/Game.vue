<template>
  <div>
    <h1 class="screen-reader-only">Planfree.dev game lobby</h1>

    <Modal
        v-if="modal"
        title="Choose your display name"
        @completed="enteredName"
    ></Modal>

    <div v-if="!modal" class="home">
      <div class="top-buttons">


        <button class="edit-name-button" @click="modal = true">
          <div>{{ name }}</div>
          <div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
                fill="#000000"
            >
              <path d="M0 0h24v24H0V0z" fill="none"/>
              <path
                  d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"
              />
            </svg>
          </div>
        </button>
        <button
            v-if="!showCopiedToClipboard"
            class="button invite"
            @click="copyToClipboard()"
        >
          <div>Invite players</div>
          <div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 0 24 24"
                width="24"
            >
              <path d="M0 0h24v24H0V0z" fill="none"/>
              <path
                  d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
              />
            </svg>
          </div>
        </button>
        <button
            v-if="!modal && showCopiedToClipboard"
            class="button invite copied no-hover"
        >
          <div>Copied to clipboard</div>
          <div></div>
        </button>
        <button class="fib-button" @click="toggleTickets">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
            <path
                d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h440l200 200v440q0 33-23.5 56.5T760-120H200Zm0-80h560v-400H600v-160H200v560Zm80-80h400v-80H280v80Zm0-320h200v-80H280v80Zm0 160h400v-80H280v80Zm-80-320v160-160 560-560Z"/>
          </svg>
        </button>
      </div>

      <div class="top-left">
        <button class="star-button" @click="goToGithub()" aria-label="Go to the GitHub repository">
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 24 24">
            <path
                d="M10.9,2.1c-4.6,0.5-8.3,4.2-8.8,8.7c-0.5,4.7,2.2,8.9,6.3,10.5C8.7,21.4,9,21.2,9,20.8v-1.6c0,0-0.4,0.1-0.9,0.1 c-1.4,0-2-1.2-2.1-1.9c-0.1-0.4-0.3-0.7-0.6-1C5.1,16.3,5,16.3,5,16.2C5,16,5.3,16,5.4,16c0.6,0,1.1,0.7,1.3,1c0.5,0.8,1.1,1,1.4,1 c0.4,0,0.7-0.1,0.9-0.2c0.1-0.7,0.4-1.4,1-1.8c-2.3-0.5-4-1.8-4-4c0-1.1,0.5-2.2,1.2-3C7.1,8.8,7,8.3,7,7.6c0-0.4,0-0.9,0.2-1.3 C7.2,6.1,7.4,6,7.5,6c0,0,0.1,0,0.1,0C8.1,6.1,9.1,6.4,10,7.3C10.6,7.1,11.3,7,12,7s1.4,0.1,2,0.3c0.9-0.9,2-1.2,2.5-1.3 c0,0,0.1,0,0.1,0c0.2,0,0.3,0.1,0.4,0.3C17,6.7,17,7.2,17,7.6c0,0.8-0.1,1.2-0.2,1.4c0.7,0.8,1.2,1.8,1.2,3c0,2.2-1.7,3.5-4,4 c0.6,0.5,1,1.4,1,2.3v2.6c0,0.3,0.3,0.6,0.7,0.5c3.7-1.5,6.3-5.1,6.3-9.3C22,6.1,16.9,1.4,10.9,2.1z"></path>
          </svg>
        </button>

        <button v-if="showInstallPwa" class="star-button" @click="installPWA()" aria-label="Add to homescreen">
          <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20">
            <path
                d="M7 17v-2H3.5q-.625 0-1.062-.438Q2 14.125 2 13.5v-9q0-.625.438-1.062Q2.875 3 3.5 3H11v1.5H3.5v9h13V11H18v2.5q0 .625-.438 1.062Q17.125 15 16.5 15H13v2Zm7.479-6L11 7.521l1.062-1.063 1.688 1.688V3h1.5v5.104l1.688-1.687L18 7.479Z"/>
          </svg>
        </button>
        <div class="voting-on" v-if="votingOnName">
          <p class="voting-on-label">Voting on: <b>{{ votingOnName }}</b></p>
        </div>
      </div>

      <button v-if="!playerHasVoted() && !showVotes" class="button no-hover">
        <span>Cast your votes</span>
      </button>
      <button
          v-if="playerHasVoted() && !showVotes"
          class="button"
          @click="showVotesClicked()"
      >
        <span>Show votes!</span>
      </button>
      <button
          v-if="showVotes && countdown === 0"
          class="button start"
          @click="startNewGame()"
      >
        <span>Start new game!</span>
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
            :disabled="currentVote === vote"
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
import {io} from "socket.io-client";
import {computed, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import Tickets from "@/components/Tickets.vue";
import {useTickets} from "@/composables/useTickets";
import {useGameEngine} from "@/composables/useGameEngine";

let showInstallPwa = ref(false);
const modal = ref(true);
const showCopiedToClipboard = ref(false);
const name = ref("");
const showTickets = ref(false);
const {votingOnName} = useTickets();
const {socket, setSocket, players, showVotes, countdown, currentVote} = useGameEngine();

let deferredPrompt: any;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallPwa.value = true;
});

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
  const tempInput = document.createElement("input");
  tempInput.value = window.location.href;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
  showCopiedToClipboard.value = true;
  setTimeout(() => (showCopiedToClipboard.value = false), 3000);
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
  top: 25px;
  position: absolute;
  gap: 5px;

  .star-button {
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
