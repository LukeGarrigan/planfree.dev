<template>
  <div>
    <h1 class="screen-reader-only">Planfree.dev game lobby</h1>
    <Modal
        v-if="modal"
        title="Choose your display name"
        :initial-value="name"
        @completed="enteredName"
    ></Modal>
    <Settings
        v-if="settings"
        :current="gameFormat?.name"
        @saveSettings="saveSettings"
        @close="settings = false"
    ></Settings>
    <Sharing v-if="showShareModal" @dismissModal="dismissModal"></Sharing>
    <div v-if="!modal" class="home">

      <div v-if="teamName" class="team-name">{{ teamName }}</div>


      <div class="top-buttons">
        <button class="edit-name-button" @click="modal = true">
          <div>{{ name }}</div>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
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
                  stroke="currentColor" stroke-width="1.5"/>
              <path d="M14 6.5L9 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M14 17.5L9 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <path
                  d="M19 18.5C19 19.8807 17.8807 21 16.5 21C15.1193 21 14 19.8807 14 18.5C14 17.1193 15.1193 16 16.5 16C17.8807 16 19 17.1193 19 18.5Z"
                  stroke="currentColor" stroke-width="1.5"/>
              <path
                  d="M19 5.5C19 6.88071 17.8807 8 16.5 8C15.1193 8 14 6.88071 14 5.5C14 4.11929 15.1193 3 16.5 3C17.8807 3 19 4.11929 19 5.5Z"
                  stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </div>
        </button>
        <button v-if="!modal && showCopiedToClipboard" class="button invite copied no-hover">
          <div>{{ ("copy_to_clip") }}</div>
          <div></div>
        </button>
        <button class="fib-button" @click="toggleTickets">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
            <path
                d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h440l200 200v440q0 33-23.5 56.5T760-120H200Zm0-80h560v-400H600v-160H200v560Zm80-80h400v-80H280v80Zm0-320h200v-80H280v80Zm0 160h400v-80H280v80Zm-80-320v160-160 560-560Z"/>
          </svg>
        </button>
      </div>

      <div class="top-left">
        <PFLittleButton type="github" popover-text="Open repo" @clicked="goToGithub()"></PFLittleButton>
        <PFLittleButton type="pwa" popover-text="Install as app" @clicked="installPWA()"></PFLittleButton>
        <PFLittleButton type="settings" popover-text="Settings" @clicked="()=>{settings = true;}"></PFLittleButton>
        <PFLittleButton
            :type="isDark ? 'sun' : 'moon'"
            :popover-text="isDark ? 'Light mode' : 'Dark mode'"
            @clicked="toggleTheme()"
        ></PFLittleButton>
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
        <Tickets @close="showTickets = false"></Tickets>
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
import {useTheme} from "@/composables/useTheme";
import PFLittleButton from "@/components/LittleButton.vue";
import Settings from "../components/SettingsModal.vue";
import Sharing from "../components/SharingModal.vue";
import GameFormat from "@/view-models/gameFormat";
import { getUserId } from "@/utils/user";

let showInstallPwa = ref(false);
// Skip the name modal (start closed) if we already know this user's name.
const modal = ref(!localStorage.getItem("name"));
const settings = ref(false)
const showCopiedToClipboard = ref(false);
// Pre-fill with any previously used name so the modal opens populated. Read
// synchronously here (not in onMounted) so the value exists before the Modal
// child mounts and captures it.
const name = ref(localStorage.getItem("name") ?? "");
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
  averageValue,
  teamName
} = useGameEngine();
const showShareModal = ref(false);
const {isDark, toggleTheme} = useTheme();

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
        userId: getUserId(),
      },
    });
    setSocket(newSocket);
  }

  // Already know who this is — send the stored name and skip the modal.
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
    background: var(--surface);
    box-shadow: var(--shadow-raised);
    color: var(--text);
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
    background: var(--accent);
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
  background: var(--surface);
  border-radius: 32px;
  text-align: center;
  border: none;
  cursor: pointer;
  transition: all 0.1s ease-in-out;
  box-shadow: var(--shadow-raised);
  color: var(--text);

  &:hover {
    opacity: 0.3;
    box-shadow: var(--shadow-raised);
  }

  &:active {
    opacity: 1;
    box-shadow: var(--shadow-pressed);
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
  /* Compact top toolbar that can't overflow the viewport */
  .top-buttons {
    gap: 8px;
    top: 8px;
    right: 8px;
    left: 8px;
    width: auto;
    justify-content: flex-end;
    align-items: center;

    .invite {
      width: auto;
      min-width: 0;
      height: 46px;
      font-size: 15px;
      padding: 0 14px;
      gap: 6px;

      svg {
        left: 0;
        top: 0;
        width: 20px;
        height: 20px;
      }
    }

    .edit-name-button {
      height: 46px;
      font-size: 15px;
      padding: 0 12px;
      max-width: 30vw;

      /* truncate long names instead of pushing siblings off-screen */
      & > div:first-child {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .fib-button {
      width: 46px;
      height: 46px;
    }
  }

  /* Keep PWA-install and Settings reachable on mobile (was hidden). GitHub is
     the least useful control on a phone, so drop it to make room. */
  .top-left {
    top: 12px;
    left: 12px;
    z-index: 5;
    gap: 8px;

    .little-button:first-child {
      display: none;
    }

    .voting-on {
      display: none;
    }
  }

  /* Team name sits on its own line just below the toolbar row */
  .team-name {
    top: 62px;
    height: auto;
    font-size: 18px;
    max-width: 80vw;
  }

  /* Let player cards wrap into rows instead of overflowing sideways */
  .home {
    flex-wrap: wrap;
    align-content: flex-start;
  }

  .players {
    top: 7em;
    width: 33vw;
    min-width: 88px;
    height: 150px;

    .player {
      width: 56px;
      height: 72px;
    }

    .name {
      margin-top: 0.5em;
      font-size: 18px;
    }
  }

  /* Central action button fits narrow screens; drop sticky tap-hover fade */
  .button {
    width: 88vw;
    max-width: 320px;

    &:hover {
      opacity: 1;
    }
  }

  /* Tighter voting options so more fit per row */
  .options {
    gap: 12px;
    bottom: 3%;
  }

  .options .fib-button {
    width: 60px;
    height: 64px;

    &:not(.current):hover {
      opacity: 1;
    }
  }

  .results-container {
    bottom: 3%;
  }
}

@media only screen and (max-width: 400px) {
  /* On very small screens shrink the invite control to its icon */
  .top-buttons .invite > div:first-child {
    display: none;
  }

  .top-buttons .invite {
    padding: 0 12px;
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
    background: var(--surface);
    color: var(--text);
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
      background-color: var(--text);
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

.team-name {
  position: absolute;
  top: 2%;
  left: 50%;
  transform: translateX(-50%);
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 40vw;
  font-family: "Montserrat", sans-serif;
  font-size: 26px;
  font-weight: 400;
  color: var(--text);
  user-select: none;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.copied {
  background: var(--accent);
}

.no-hover {
  pointer-events: none;
}

span {
  font-family: "Montserrat", sans-serif;
  font-size: 26px;
  font-weight: semibold;
  color: var(--text);
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
  color: var(--accent);

  .results {
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: var(--inverse-surface);
    border-radius: 26px;
    border: none;
    width: 250px;
    height: 100px;
    transition: all 0.1s ease-in-out;
    box-shadow: var(--shadow-raised);

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
  background: var(--surface);
  border-radius: 26px;
  text-align: center;
  border: none;
  cursor: pointer;
  width: 64px;
  height: 70px;
  transition: all 0.1s ease-in-out;
  box-shadow: var(--shadow-raised);
  color: var(--text);

  &:not(.current) {
    &:hover {
      opacity: 0.3;
      box-shadow: var(--shadow-raised);
    }

    &:active {
      opacity: 1;
      box-shadow: var(--shadow-pressed);
    }
  }

  &.current {
    background: var(--accent);
  }
}
</style>