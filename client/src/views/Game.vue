<template>
  <div>
    <h1 class="screen-reader-only">Planfree.dev game lobby</h1>
    <Modal
        v-if="modal"
        title="Choose your display name"
        @completed="enteredName"
    ></Modal>
    <Settings
        v-if="settings"
        title="Settings"
        @saveSettings="saveSettings"
        @close="settings = false"
    ></Settings>
    <Sharing v-if="showShareModal" title='share_modal_title' subTitle='share_modal_subtitle'
             @dismissModal="dismissModal"></Sharing>
    <div v-if="!modal && !settings && !showShareModal" class="home">

      <div class="top-buttons">
        <button class="edit-name-button" @click="modal = true">
          <div>{{ name }}</div>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
              <path d="M0 0h24v24H0V0z" fill="none"/>
              <path
                  d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"/>
            </svg>
          </div>
        </button>
        <button v-if="!showCopiedToClipboard" class="button invite" @click="copyToClipboard()">
          <div>{{ "Invite players" }}</div>
          <div>
            <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M9 12C9 13.3807 7.88071 14.5 6.5 14.5C5.11929 14.5 4 13.3807 4 12C4 10.6193 5.11929 9.5 6.5 9.5C7.88071 9.5 9 10.6193 9 12Z"
                  stroke="#1C274C" stroke-width="1.5"/>
              <path d="M14 6.5L9 10" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M14 17.5L9 14" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
              <path
                  d="M19 18.5C19 19.8807 17.8807 21 16.5 21C15.1193 21 14 19.8807 14 18.5C14 17.1193 15.1193 16 16.5 16C17.8807 16 19 17.1193 19 18.5Z"
                  stroke="#1C274C" stroke-width="1.5"/>
              <path
                  d="M19 5.5C19 6.88071 17.8807 8 16.5 8C15.1193 8 14 6.88071 14 5.5C14 4.11929 15.1193 3 16.5 3C17.8807 3 19 4.11929 19 5.5Z"
                  stroke="#1C274C" stroke-width="1.5"/>
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
                d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h440l200 200v440q0 33-23.5 56.5T760-120H200Zm0-80h560v-400H600v-160H200v560Zm80-80h400v-80H280v80Zm0-320h200v-80H280v80Zm0 160h400v-80H280v80Zm-80-320v160-160 560-560Z"/>
          </svg>
        </button>
      </div>

      <div class="top-left">
        <PFLittleButton type="github" popover-text="Open repo" @clicked="goToGithub()"></PFLittleButton>
        <PFLittleButton type="pwa" popover-text="Install as app" @clicked="installPWA()"></PFLittleButton>
        <PFLittleButton type="settings" popover-text="Settings" @clicked="()=>{settings = true;}"></PFLittleButton>
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
            v-for="vote in gameFormat?.values"
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
          <div class="average">Average: {{ averageValue }}</div>
          <div class="popular">Closest: {{ closestValue }}</div>
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
import PFLittleButton from "@/components/LittleButton.vue";
import Settings from "../components/SettingsModal.vue";
import Sharing from "../components/SharingModal.vue";
import GameFormat from "@/view-models/gameFormat";

let showInstallPwa = ref(false);
const modal = ref(true);
const settings = ref(false)
const showCopiedToClipboard = ref(false);
const name = ref("");
const showTickets = ref(false);
const {votingOnName, tickets} = useTickets();
const {
  socket,
  setSocket,
  players,
  showVotes,
  countdown,
  currentVote,
  gameFormat,
  closestValue,
  averageValue
} = useGameEngine();
const showShareModal = ref(false);

let deferredPrompt: any;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallPwa.value = true;
});

function saveSettings(gameType: GameFormat) {
  settings.value = false;
  socket.value.emit("gameTypeChanged", gameType);
}

async function dismissModal() {
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