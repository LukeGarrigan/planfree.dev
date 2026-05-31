<template>
  <div class="modal-overlay">
    <div class="modal" @click.stop>
      <label for="selectNameInput" class="heading">Name your team</label>
      <p class="subheading">Everyone in this session will see this</p>

      <div class="input-container">
        <PFInput
            v-model="teamName"
            @completed="completed"
            :max-length="30"
            placeholder="e.g. The Avengers"
        ></PFInput>
      </div>

      <p class="section-label">Estimation deck</p>
      <DeckPicker :formats="gameFormats" :selected="selected.name" @select="selected = $event"></DeckPicker>

      <button class="start-button" type="button" @click="completed">
        <span>Start planning</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import PFInput from "@/components/Input.vue";
import DeckPicker from "@/components/DeckPicker.vue";
import GameFormat from "@/view-models/gameFormat";

// Decks come from the list the server last pushed (cached in localStorage). For
// a first-time visitor with no cache, fall back to a list that mirrors the
// server's hardcoded gameTypes so the picker is never empty.
const DEFAULT_GAME_TYPES: GameFormat[] = [
  {name: 'Fibonacci', values: ['1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '?']},
  {name: 'T-Shirt', values: ['XXS', 'XS', 'S', 'M', 'L', 'XL', '?']},
  {name: 'Powers of 2', values: ['0', '1', '2', '4', '8', '16', '32', '64', '?']},
];

const cached = JSON.parse(localStorage.getItem('gameTypes') || '[]') as GameFormat[];
const gameFormats: GameFormat[] = cached.length ? cached : DEFAULT_GAME_TYPES;

const emit = defineEmits<{
  (e: 'completed', payload: { teamName: string; gameType: GameFormat }): void
}>();

const teamName = ref('');
const selected = ref<GameFormat>(gameFormats[0]);

onMounted(() => {
  const input = document.getElementById('selectNameInput') as HTMLInputElement | null;
  if (input) {
    input.focus();
    input.select();
  }
});

function completed() {
  if (teamName.value && teamName.value.trim()) {
    emit('completed', {teamName: teamName.value, gameType: selected.value});
  }
}
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
  width: 90%;
  max-width: 440px;
  padding: 32px 28px;
  border-radius: 20px;
  background: var(--surface);
  box-shadow: var(--shadow-modal);
  color: var(--text);
  display: flex;
  align-items: center;
  flex-direction: column;
}

.heading {
  font-family: "Montserrat", sans-serif;
  font-size: 22px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 6px;
}

.subheading {
  font-family: "Montserrat", sans-serif;
  font-size: 14px;
  opacity: 0.6;
  text-align: center;
  margin: 0 0 20px;
}

.input-container {
  display: flex;
}

.section-label {
  align-self: flex-start;
  font-family: "Montserrat", sans-serif;
  font-size: 15px;
  font-weight: 600;
  opacity: 0.6;
  margin: 24px 0 12px;
}

.start-button {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
  width: 100%;
  height: 56px;
  background: var(--accent);
  border-radius: 16px;
  border: none;
  cursor: pointer;
  transition: opacity 0.1s ease-in-out;

  &:hover {
    opacity: 0.85;
  }

  span {
    font-family: "Montserrat", sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: var(--accent-text);
  }
}
</style>
