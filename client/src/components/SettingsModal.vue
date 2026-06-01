<template>
  <div class="modal-overlay" @click="close">
    <div class="modal" @click.stop>
      <button class="close-x" @click="close" aria-label="Close">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
              d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z"
              fill="currentColor"/>
        </svg>
      </button>

      <div class="modal-scroll">
      <div class="heading">Settings</div>

      <div class="section">
        <label class="section-label" for="teamNameInput">Team name</label>
        <input
            id="teamNameInput"
            v-model="teamNameDraft"
            class="team-input"
            type="text"
            autocomplete="off"
            data-1p-ignore
            data-lpignore="true"
            maxlength="30"
            placeholder="e.g. The Avengers"
            :disabled="controlsDisabled"
            @keypress.enter="commitTeamName"
            @blur="commitTeamName"
        />
      </div>

      <div class="section">
        <p class="section-label">Estimation deck</p>
        <div :class="{ 'is-locked': controlsDisabled }">
          <DeckPicker :formats="gameFormats" :selected="current" @select="saveSettings"></DeckPicker>
        </div>
      </div>

      <div class="section">
        <p class="section-label">Voting</p>
        <div class="toggle-row">
          <div class="toggle-text">
            <span class="toggle-label">Auto-reveal votes</span>
            <span class="toggle-hint">Show votes automatically once everyone has voted</span>
          </div>
          <button
              type="button"
              class="toggle"
              :class="{ on: autoRevealDraft, disabled: controlsDisabled }"
              role="switch"
              :aria-checked="autoRevealDraft"
              aria-label="Auto-reveal votes"
              :disabled="controlsDisabled"
              @click="toggleAutoReveal"
          >
            <span class="knob"></span>
          </button>
        </div>
        <div class="toggle-row">
          <div class="toggle-text">
            <span class="toggle-label">Spectator mode</span>
            <span class="toggle-hint">Watch the round without voting - you won't hold up the reveal</span>
          </div>
          <button
              type="button"
              class="toggle"
              :class="{ on: spectatorDraft }"
              role="switch"
              :aria-checked="spectatorDraft"
              aria-label="Spectator mode"
              @click="toggleSpectator"
          >
            <span class="knob"></span>
          </button>
        </div>
      </div>

      <div class="section">
        <p class="section-label">Host</p>

        <template v-if="amHost">
          <div class="toggle-row">
            <div class="toggle-text">
              <span class="toggle-label">Lock controls to host</span>
              <span class="toggle-hint">Only you can reveal, change the deck, manage tickets and the timer</span>
            </div>
            <button
                type="button"
                class="toggle"
                :class="{ on: locked }"
                role="switch"
                :aria-checked="locked"
                aria-label="Lock controls to host"
                @click="emit('saveLock', !locked)"
            >
              <span class="knob"></span>
            </button>
          </div>

          <ul v-if="otherPlayers.length" class="player-admin">
            <li v-for="p in otherPlayers" :key="p.userId">
              <span class="player-admin-name">{{ p.name || 'Anonymous' }}</span>
              <span class="player-admin-actions">
                <button type="button" class="mini-button" @click="emit('transferHost', p.userId)">Make host</button>
                <button type="button" class="mini-button danger" @click="emit('kick', p.userId)">Remove</button>
              </span>
            </li>
          </ul>
        </template>

        <p v-else class="host-note">
          <span class="host-name">👑 {{ hostName || 'The host' }}</span> is running this room.
          <template v-if="locked"><br>Controls are limited to the host.</template>
        </p>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import GameFormat from '@/view-models/gameFormat';
import Player from '@/view-models/player';
import {computed, onMounted, onUnmounted, ref} from 'vue';
import DeckPicker from '@/components/DeckPicker.vue';

const props = defineProps<{
  current?: string;
  teamName?: string;
  autoReveal?: boolean;
  spectator?: boolean;
  players?: Player[];
  hostUserId?: string | null;
  myUserId?: string;
  amHost?: boolean;
  locked?: boolean;
  canControl?: boolean;
}>();

const gameFormats = JSON.parse(localStorage.getItem('gameTypes') || '[]');

const emit = defineEmits([
  'saveSettings', 'saveTeamName', 'saveAutoReveal', 'saveSpectator',
  'saveLock', 'kick', 'transferHost', 'close'
]);

const teamNameDraft = ref(props.teamName ?? '');
const autoRevealDraft = ref(props.autoReveal ?? true);
const spectatorDraft = ref(props.spectator ?? false);

// Session controls are read-only for non-hosts once the room is locked.
const controlsDisabled = computed(() => props.canControl === false);
// Everyone but me — the host's kick / hand-off targets.
const otherPlayers = computed(() => (props.players ?? []).filter(p => p.userId && p.userId !== props.myUserId));
const hostName = computed(() => (props.players ?? []).find(p => p.userId === props.hostUserId)?.name);

function toggleAutoReveal() {
  if (controlsDisabled.value) return;
  autoRevealDraft.value = !autoRevealDraft.value;
  emit('saveAutoReveal', autoRevealDraft.value);
}

function toggleSpectator() {
  spectatorDraft.value = !spectatorDraft.value;
  emit('saveSpectator', spectatorDraft.value);
}

function commitTeamName() {
  if (controlsDisabled.value) return;
  const next = teamNameDraft.value.trim();
  // Only broadcast when it actually changed, so a blur with no edit is a no-op.
  if (next && next !== (props.teamName ?? '')) {
    emit('saveTeamName', next);
  }
}

function saveSettings(format: GameFormat) {
  if (controlsDisabled.value) return;
  emit('saveSettings', format);
}

function close() {
  emit('close');
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') close();
}

onMounted(() => window.addEventListener('keydown', onKeydown));
onUnmounted(() => window.removeEventListener('keydown', onKeydown));
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--overlay);
  backdrop-filter: blur(2px);
}

.modal {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 460px;
  max-height: 90vh;
  padding: 32px 28px;
  border-radius: 20px;
  background: var(--surface);
  color: var(--text);
  box-shadow: var(--shadow-modal);
  font-family: "Montserrat", sans-serif;
}

/* The frame (.modal) stays put — close button pinned — while the content
   scrolls when it outgrows the viewport. Negative margins let the scrollbar sit
   at the modal edge; the padding keeps content clear of it. */
.modal-scroll {
  overflow-y: auto;
  margin: 0 -28px;
  padding: 0 28px;
}

.close-x {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
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

.heading {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
}

.section {
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-label {
  display: block;
  font-size: 15px;
  font-weight: 600;
  opacity: 0.6;
  margin: 0 0 12px;
}

.team-input {
  box-sizing: border-box;
  width: 100%;
  height: 48px;
  padding: 8px 14px;
  border: 2px solid transparent;
  border-radius: 12px;
  background: var(--surface-input);
  color: var(--text);
  font-family: "Montserrat", sans-serif;
  font-size: 17px;
  outline: none;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: var(--accent);
  }

  &::placeholder {
    color: var(--text-muted);
  }
}

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  /* Space consecutive toggles (auto-reveal / spectator) apart so they don't
     read as one cramped block. */
  & + .toggle-row {
    margin-top: 18px;
  }
}

.toggle-text {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: 4px;
}

.toggle-label {
  font-size: 16px;
  font-weight: 500;
}

.toggle-hint {
  font-size: 13px;
  opacity: 0.6;
}

.toggle {
  flex: none;
  position: relative;
  width: 52px;
  height: 30px;
  padding: 0;
  border: none;
  border-radius: 15px;
  background: var(--surface-input);
  cursor: pointer;
  transition: background-color 0.15s ease;

  &.on {
    background: var(--accent);
  }

  .knob {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #fff;
    box-shadow: var(--shadow-raised);
    transition: transform 0.15s ease;
  }

  &.on .knob {
    transform: translateX(22px);
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

/* Greys out and blocks interaction with the deck picker for non-hosts when the
   room is locked. */
.is-locked {
  opacity: 0.5;
  pointer-events: none;
}

.player-admin {
  list-style: none;
  margin: 16px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
}

.player-admin-name {
  font-size: 15px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.player-admin-actions {
  flex: none;
  display: flex;
  gap: 8px;
}

.mini-button {
  border: none;
  border-radius: 10px;
  padding: 6px 12px;
  background: var(--surface-input);
  color: var(--text);
  font-family: "Montserrat", sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.1s ease;

  &:hover {
    opacity: 0.8;
  }

  &.danger {
    background: #e5484d;
    color: #fff;
  }
}

.host-note {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-muted);

  .host-name {
    color: var(--text);
    font-weight: 600;
  }
}

</style>
