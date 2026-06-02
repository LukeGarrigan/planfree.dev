<template>
  <div class="modal-overlay">
    <div class="modal" @click.stop>
      <label for="selectNameInput" class="heading">Name your team</label>
      <p class="subheading">Everyone in this session will see this</p>

      <div class="input-container" :class="{ 'needs-name': !canStart }">
        <PFInput
            v-model="teamName"
            @completed="completed"
            :max-length="30"
            placeholder="e.g. The Avengers"
        ></PFInput>
      </div>

      <p class="section-label">Estimation deck</p>
      <DeckPicker
          :formats="gameFormats"
          :selected="selected?.name"
          :deletable="customDeckNames"
          @select="selected = $event"
          @delete="onDeleteDeck"
      ></DeckPicker>
      <CustomDeckEditor @created="onCustomDeckCreated"></CustomDeckEditor>

      <div class="start-wrapper">
        <button
            class="start-button"
            type="button"
            :disabled="!canStart"
            :title="canStart ? '' : 'Enter a team name first'"
            @click="completed"
        >
          <span>Start planning</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import PFInput from "@/components/Input.vue";
import DeckPicker from "@/components/DeckPicker.vue";
import CustomDeckEditor from "@/components/CustomDeckEditor.vue";
import {useDecks} from "@/composables/useDecks";
import GameFormat from "@/view-models/gameFormat";

const {decks: gameFormats, customDeckNames, removeCustomDeck} = useDecks();

const emit = defineEmits<{
  (e: 'completed', payload: { teamName: string; gameType: GameFormat }): void
}>();

const teamName = ref('');
const selected = ref<GameFormat>(gameFormats.value[0]);

// A team name is required — everyone in the session sees it, and the button
// stays disabled until one is entered so clicking it never silently no-ops.
const canStart = computed(() => teamName.value.trim().length > 0);

// A new custom deck is selected immediately so "Start planning" uses it.
function onCustomDeckCreated(deck: GameFormat) {
  selected.value = deck;
}

function onDeleteDeck(name: string) {
  removeCustomDeck(name);
  // If we just removed the deck that was selected, fall back to the first one.
  if (selected.value?.name === name) {
    selected.value = gameFormats.value[0];
  }
}

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
  /* Cap to the viewport and scroll within when the deck list + custom-deck
     editor make the modal taller than the screen. */
  max-height: 90vh;
  overflow-y: auto;
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
  flex: none;
  border-radius: 10px;
  transition: box-shadow 0.15s ease;
}

/* While no name is entered, ring the field in the accent colour so it's clear
   that's the thing to fill in before "Start planning" works. */
.input-container.needs-name {
  box-shadow: 0 0 0 2px var(--accent);
}

.section-label {
  align-self: flex-start;
  font-family: "Montserrat", sans-serif;
  font-size: 15px;
  font-weight: 600;
  opacity: 0.6;
  margin: 24px 0 12px;
}

.start-wrapper {
  /* Don't let the button block shrink when the modal scrolls — as a flex child
     it would otherwise squish below its 56px height. */
  flex: none;
  width: 100%;
  margin-top: 24px;
}

.start-button {
  display: flex;
  align-items: center;
  justify-content: center;
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

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  span {
    font-family: "Montserrat", sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: var(--accent-text);
  }
}
</style>
