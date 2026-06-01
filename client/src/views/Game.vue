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
        :team-name="teamName"
        :auto-reveal="autoReveal"
        :spectator="spectator"
        @saveSettings="saveSettings"
        @saveTeamName="saveTeamName"
        @saveAutoReveal="saveAutoReveal"
        @saveSpectator="saveSpectator"
        @close="settings = false"
    ></Settings>
    <Sharing v-if="showShareModal" @dismissModal="dismissModal"></Sharing>
    <div v-if="!modal" class="home">

      <div class="top-bar">
      <div class="top-left">
        <div class="menu-wrapper">
          <button class="menu-trigger" aria-label="Menu" @click="menuOpen = !menuOpen">
            <svg xmlns="http://www.w3.org/2000/svg" height="26" width="26" viewBox="0 0 24 24" fill="currentColor">
              <path
                  d="M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
            </svg>
          </button>
          <div v-if="menuOpen" class="menu-backdrop" @click="menuOpen = false"></div>
          <div v-if="menuOpen" class="menu" role="menu">
            <button class="menu-item" role="menuitem" @click="toggleTheme()">
              <svg v-if="isDark" class="menu-item-icon" xmlns="http://www.w3.org/2000/svg" height="18" width="18"
                   viewBox="0 0 24 24" fill="currentColor">
                <path
                    d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0-5a1 1 0 0 1 1 1v1.5a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1Zm0 16.5a1 1 0 0 1 1 1V21a1 1 0 1 1-2 0v-1.5a1 1 0 0 1 1-1ZM3 11h1.5a1 1 0 1 1 0 2H3a1 1 0 1 1 0-2Zm16.5 0H21a1 1 0 1 1 0 2h-1.5a1 1 0 1 1 0-2ZM5.05 5.05a1 1 0 0 1 1.41 0l1.06 1.06a1 1 0 1 1-1.41 1.41L5.05 6.46a1 1 0 0 1 0-1.41Zm11.43 11.43a1 1 0 0 1 1.41 0l1.06 1.06a1 1 0 1 1-1.41 1.41l-1.06-1.06a1 1 0 0 1 0-1.41Zm2.47-11.43a1 1 0 0 1 0 1.41l-1.06 1.06a1 1 0 1 1-1.41-1.41l1.06-1.06a1 1 0 0 1 1.41 0ZM7.52 16.48a1 1 0 0 1 0 1.41l-1.06 1.06a1 1 0 0 1-1.41-1.41l1.06-1.06a1 1 0 0 1 1.41 0Z"/>
              </svg>
              <svg v-else class="menu-item-icon" xmlns="http://www.w3.org/2000/svg" height="18" width="18"
                   viewBox="0 0 24 24" fill="currentColor">
                <path
                    d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.39 5.39 0 0 1-4.4 2.26 5.4 5.4 0 0 1-5.4-5.4c0-1.86.94-3.5 2.36-4.46-.44-.06-.9-.1-1.36-.1Z"/>
              </svg>
              <span>{{ isDark ? 'Light mode' : 'Dark mode' }}</span>
            </button>
            <button class="menu-item" role="menuitem" @click="editName()">Change name</button>
            <button class="menu-item" role="menuitem" @click="openSettings()">Settings</button>
            <button v-if="tickets && tickets.length" class="menu-item" role="menuitem" @click="exportResults()">Export results</button>
            <button v-if="showInstallPwa" class="menu-item" role="menuitem" @click="installPWA()">Install app</button>
            <button class="menu-item" role="menuitem" @click="goToGithub()">View on GitHub</button>
          </div>
        </div>
        <div v-if="teamName" class="team-name">{{ teamName }}</div>
        <div class="voting-on" v-if="votingOnName">
          <p class="voting-on-label">Voting on: <b>{{ votingOnName }}</b></p>
        </div>
      </div>

      <div class="top-buttons">
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
        <button class="button issues-button" @click="toggleTickets">
          <div>Tickets</div>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
              <path
                  d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h440l200 200v440q0 33-23.5 56.5T760-120H200Zm0-80h560v-400H600v-160H200v560Zm80-80h400v-80H280v80Zm0-320h200v-80H280v80Zm0 160h400v-80H280v80Zm-80-320v160-160 560-560Z"/>
            </svg>
          </div>
        </button>
      </div>

      </div>

      <button v-if="spectator && !showVotes" class="button no-hover">
        <span>You're spectating 👀</span>
      </button>
      <button v-if="!spectator && !playerHasVoted() && !showVotes" class="button no-hover">
        <span>Cast your votes</span>
      </button>
      <button v-if="!spectator && playerHasVoted() && !showVotes" class="button" @click="showVotesClicked()">
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

      <div class="players-row">
        <div class="players" v-for="player in players" :key="player.id">
          <div class="player" :class="{ voted: player.hasVoted, spectator: player.spectator }">
            <span v-if="player.spectator" class="spectator-icon" aria-label="Spectator" title="Spectator">
              <svg xmlns="http://www.w3.org/2000/svg" height="26" width="26" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7Zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
              </svg>
            </span>
            <span v-else-if="showVotes && countdown === 0">{{ player.vote }}</span>
          </div>
          <div class="name">
            <span>{{ player.name }}</span>
          </div>
        </div>
      </div>

      <div class="options" v-if="!spectator && (!showVotes || (showVotes && countdown !== 0))">
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
        <div class="results-card">
          <div class="distribution" v-if="distribution.length">
            <div class="dist-item" v-for="d in distribution" :key="`dist-${d.value}`">
              <div class="dist-count">{{ d.count }}</div>
              <div class="dist-bar-track">
                <div class="dist-bar" :style="{ height: barHeight(d.count) }"></div>
              </div>
              <div class="dist-value">{{ d.value }}</div>
            </div>
          </div>
          <div class="results-summary">
            <div class="stat">
              <span class="stat-label">Average</span>
              <span class="stat-value">{{ averageValue }}</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat">
              <span class="stat-label">Closest</span>
              <span class="stat-value">{{ closestValue }}</span>
            </div>
          </div>
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
import Settings from "../components/SettingsModal.vue";
import Sharing from "../components/SharingModal.vue";
import GameFormat from "@/view-models/gameFormat";
import { getUserId } from "@/utils/user";

let showInstallPwa = ref(false);
// Skip the name modal (start closed) if we already know this user's name.
const modal = ref(!localStorage.getItem("name"));
const settings = ref(false)
const menuOpen = ref(false);
const showCopiedToClipboard = ref(false);
// Pre-fill with any previously used name so the modal opens populated. Read
// synchronously here (not in onMounted) so the value exists before the Modal
// child mounts and captures it.
const name = ref(localStorage.getItem("name") ?? "");
const showTickets = ref(false);
// Persisted per-user preference: a spectator watches without voting. Sent to
// the server on connect (handshake query) and whenever toggled in Settings.
const spectator = ref(localStorage.getItem("spectator") === "true");
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
  distribution,
  teamName,
  autoReveal
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

function saveTeamName(newTeamName: string) {
  socket.value.emit("teamNameChanged", newTeamName);
}

function saveAutoReveal(value: boolean) {
  socket.value.emit("autoRevealChanged", value);
}

function saveSpectator(value: boolean) {
  spectator.value = value;
  localStorage.setItem("spectator", String(value));
  // Stepping out of voting clears our local card highlight; the server drops
  // the server-side vote too.
  if (value) {
    currentVote.value = null;
  }
  socket.value.emit("spectatorChanged", value);
}

async function dismissModal() {
  showShareModal.value = false;
}

function editName() {
  modal.value = true;
  menuOpen.value = false;
}

function openSettings() {
  settings.value = true;
  menuOpen.value = false;
}

function installPWA() {
  menuOpen.value = false;
  deferredPrompt.prompt();
}

onMounted(() => {
  if (joiningAGame()) {
    const route = useRoute();
    const newSocket = io(import.meta.env.VITE_SERVER, {
      query: {
        roomId: route.params.id,
        userId: getUserId(),
        spectator: spectator.value,
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
  // Votes are hidden until reveal, so rely on the server's `hasVoted` flag
  // rather than the (absent) vote value to decide if "Show votes!" is offered.
  return players.value.filter((p: Player) => p.hasVoted).length > 0;
}

// Scale each distribution bar against the tallest column so the spread reads at
// a glance regardless of room size.
function barHeight(count: number) {
  const max = Math.max(1, ...distribution.value.map(d => d.count));
  return `${Math.round((count / max) * 56) + 4}px`;
}

function copyToClipboard() {
  showShareModal.value = true;
}

function goToGithub() {
  menuOpen.value = false;
  open("https://github.com/LukeGarrigan/planfree.dev");
}

// Download the room's tickets and their agreed scores as a CSV the team can
// keep — the only durable output of a session, since rooms are in-memory.
function exportResults() {
  menuOpen.value = false;
  const cell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const header = ["Ticket ID", "Title", "Score", "Link", "Description"];
  const rows = tickets.value.map(t => [
    t.ticketId,
    t.title,
    t.score && t.score !== "0" ? t.score : "",
    t.link,
    t.description,
  ].map(cell).join(","));
  const csv = [header.map(cell).join(","), ...rows].join("\r\n");

  const blob = new Blob([csv], {type: "text/csv;charset=utf-8;"});
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const slug = (teamName.value || "planfree").replace(/\s+/g, "-");
  link.download = `${slug}-estimates-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
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
.players-row {
  /* Fills the space under the top bar and centres the player cards, so the
     board flows below the header instead of sitting under an absolute bar. */
  flex: 1 1 auto;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  align-content: center;
  gap: 0 1em;
}

.players {
  user-select: none;
  position: relative;
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
    /* Cap to the player cell and break long names so they wrap inside their own
       card instead of overlapping neighbours. */
    max-width: 100%;
    overflow-wrap: anywhere;

    span {
      /* Override the global 26px span rule so the name follows the cell's
         font-size (including the smaller mobile size). */
      font-size: inherit;
    }
  }

  .voted {
    background: var(--accent);
  }

  .player.spectator {
    background: var(--surface-sunken-hover);
    color: var(--text-muted);
  }

  .spectator-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
  }
}

.home {
  display: flex;
  flex-direction: column;
  /* Centres children on the cross (horizontal) axis. The absolute .button /
     .options / .results have no `left`, so they rely on this for centring —
     the column equivalent of the old `justify-content: center`. */
  align-items: center;
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

/* Single top bar: menu on the left, Invite/Stories on the right, all on one
   flex baseline so the two groups always line up. Wraps the right-hand group
   onto a second line (kept right-aligned) when there isn't room for one row.
   It's an in-flow header (not absolute), so when it grows the board below
   flows down to make room instead of being covered. */
.top-bar {
  flex: none;
  width: 100%;
  box-sizing: border-box;
  padding: 2% 2% 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
}

.top-left {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;

  .menu-wrapper {
    position: relative;
    display: flex;
  }

  .menu-trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 70px;
    height: 70px;
    border: none;
    border-radius: 32px;
    background: var(--surface);
    color: var(--text);
    box-shadow: var(--shadow-raised);
    cursor: pointer;
    transition: all 0.1s ease-in-out;

    &:hover {
      opacity: 0.3;
    }

    &:active {
      opacity: 1;
      box-shadow: var(--shadow-pressed);
    }
  }

  .menu-backdrop {
    position: fixed;
    inset: 0;
    z-index: 10;
  }

  .menu {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    z-index: 11;
    display: flex;
    flex-direction: column;
    min-width: 170px;
    padding: 8px;
    gap: 2px;
    background: var(--surface);
    border-radius: 16px;
    box-shadow: var(--shadow-modal);

    .menu-item {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 11px 14px;
      background: transparent;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      text-align: left;
      font-family: "Montserrat", sans-serif;
      font-size: 16px;
      color: var(--text);

      &:hover {
        background: var(--surface-sunken-hover);
      }

      /* Override the global `span { font-size: 26px }` used for vote text. */
      span {
        font-size: 16px;
        font-weight: 500;
      }

      .menu-item-icon {
        flex: none;
        width: 18px;
        height: 18px;
        fill: currentColor;
      }
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
  /* Tighten the single top bar and keep it pinned while the board scrolls on
     crowded mobile rooms. */
  .top-bar {
    position: sticky;
    top: 0;
    z-index: 5;
    background: var(--surface);
    gap: 8px;
  }

  /* The board scrolls as a whole when players + button outgrow the screen;
     reserve space so the last content clears the pinned voting cards. */
  .home {
    overflow-y: auto;
    padding-bottom: 220px;
  }

  /* Compact top toolbar that can't overflow the viewport */
  .top-buttons {
    gap: 8px;
    min-width: 0;

    .invite,
    .issues-button {
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

    .fib-button {
      width: 46px;
      height: 46px;
    }
  }

  /* Overflow menu (theme / Settings / Install / GitHub) stays reachable on
     mobile; the "Voting on" label is dropped to save horizontal room. */
  .top-left {
    gap: 8px;

    .menu-trigger {
      width: 46px;
      height: 46px;

      svg {
        width: 22px;
        height: 22px;
      }
    }

    .voting-on {
      display: none;
    }
  }

  /* Smaller team name to fit the compact bar; wraps with the rest when tight */
  .team-name {
    height: 46px;
    line-height: 46px;
    font-size: 18px;
  }

  /* Size the player grid to its contents and pack from the top, so the action
     button that follows it gets pushed further down as more players join. */
  .players-row {
    order: 1;
    flex: 0 0 auto;
    align-content: flex-start;
    padding-top: 1em;
  }

  .players {
    width: 33vw;
    min-width: 88px;
    /* Grow for multi-line wrapped names rather than clipping/overlapping. */
    min-height: 150px;
    height: auto;

    .player {
      width: 56px;
      height: 72px;
    }

    .name {
      margin-top: 0.5em;
      font-size: 18px;
    }
  }

  /* Flow the action button in below the player grid (order keeps it after the
     grid even though it's earlier in the DOM), so players push it down rather
     than an absolutely-centred button being painted over. Drop the hover fade. */
  .button {
    position: static;
    order: 2;
    width: 88vw;
    max-width: 320px;
    margin: 12px 0;

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

@media only screen and (max-width: 600px) {
  /* On smaller screens shrink the invite + issues controls to their icons */
  .top-buttons .invite > div:first-child,
  .top-buttons .issues-button > div:first-child {
    display: none;
  }

  .top-buttons .invite,
  .top-buttons .issues-button {
    padding: 0 12px;
  }
}

.top-buttons {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  /* Stay pinned right even when there's no team name filling the middle. */
  margin-left: auto;
  gap: 20px;

  .invite {
    position: relative;
    user-select: none;
    gap: 10px;
    width: auto;
    padding: 0 28px;
    height: 70px;
    font-size: 26px;

    svg {
      position: relative;
      left: 2px;
      top: 3px;
    }
  }

  .issues-button {
    position: relative;
    top: auto;
    user-select: none;
    gap: 10px;
    width: auto;
    padding: 0 28px;
    height: 70px;
    font-size: 26px;

    svg {
      position: relative;
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
  /* Sits in the left group, directly beside the menu trigger. Sized to its
     content (capped so long names ellipsise rather than push the menu away). */
  max-width: 30vw;
  height: 70px;
  line-height: 70px;
  font-family: "Montserrat", sans-serif;
  font-size: 26px;
  font-weight: 400;
  color: var(--text);
  user-select: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  /* Accent underline, matching the "Voting on" ticket styling. */
  text-decoration: underline;
  text-decoration-color: var(--accent);
  text-decoration-thickness: 2px;
  text-underline-offset: 6px;
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
  width: 90%;
  bottom: 5%;
  user-select: none;
  font-family: "Montserrat", sans-serif;
}

.results-card {
  display: flex;
  flex-direction: column;
  background: var(--inverse-surface);
  border-radius: 26px;
  box-shadow: var(--shadow-raised);
  padding: 18px 22px;
  min-width: 250px;
  max-width: 90vw;
}

.distribution {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 14px;
  padding: 4px 4px 16px;

  .dist-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    gap: 6px;
    min-width: 28px;
  }

  .dist-count {
    font-size: 14px;
    font-weight: 600;
    color: var(--inverse-text);
    opacity: 0.6;
  }

  .dist-bar-track {
    display: flex;
    align-items: flex-end;
    height: 60px;
  }

  .dist-bar {
    width: 22px;
    border-radius: 6px;
    background: var(--accent);
  }

  .dist-value {
    font-size: 15px;
    font-weight: 600;
    color: var(--inverse-text);
  }
}

.results-summary {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 8px;

  /* Only show the top divider when a distribution chart sits above it. */
  .distribution + & {
    border-top: 1px solid rgba(255, 255, 255, 0.12);
    padding-top: 14px;
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    flex: 1;
  }

  .stat-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--inverse-text);
    opacity: 0.6;
  }

  .stat-value {
    font-size: 26px;
    font-weight: 600;
    color: var(--inverse-text);
  }

  .stat-divider {
    width: 1px;
    align-self: stretch;
    background: rgba(255, 255, 255, 0.12);
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