<template>
  <form class="custom-deck" @submit.prevent="submit">
    <input
        v-model="name"
        class="cd-input"
        type="text"
        autocomplete="off"
        data-1p-ignore
        data-lpignore="true"
        maxlength="20"
        placeholder="Deck name (optional)"
    />
    <div class="cd-row">
      <input
          v-model="raw"
          class="cd-input"
          type="text"
          autocomplete="off"
          data-1p-ignore
          data-lpignore="true"
          maxlength="120"
          placeholder="Values, e.g. 1, 2, 3, 5, 8, ?"
          @keypress.enter.prevent="submit"
      />
      <button class="cd-add" type="submit" :disabled="preview.length < 2">Add</button>
    </div>
    <div v-if="preview.length" class="cd-preview">
      <span v-for="(value, i) in preview" :key="`${value}-${i}`" class="cd-chip">{{ value }}</span>
    </div>
    <p v-else class="cd-hint">Separate cards with commas. Add at least two.</p>
  </form>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import {useDecks} from '@/composables/useDecks';
import GameFormat from '@/view-models/gameFormat';

const {parseValues, addCustomDeck} = useDecks();

const emit = defineEmits<{
  (e: 'created', deck: GameFormat): void
}>();

const name = ref('');
const raw = ref('');

// Live preview of the cards as they'll be parsed (trimmed, de-duped).
const preview = computed(() => parseValues(raw.value));

function submit() {
  if (preview.value.length < 2) {
    return;
  }
  const deck = addCustomDeck(name.value, preview.value);
  name.value = '';
  raw.value = '';
  emit('created', deck);
}
</script>

<style scoped lang="scss">
.custom-deck {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
}

.cd-row {
  display: flex;
  gap: 8px;
}

.cd-input {
  box-sizing: border-box;
  flex: 1;
  min-width: 0;
  height: 42px;
  padding: 8px 12px;
  border: 2px solid transparent;
  border-radius: 12px;
  background: var(--surface-input);
  color: var(--text);
  font-family: "Plus Jakarta Sans Variable", sans-serif;
  font-size: 15px;
  outline: none;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: var(--accent);
  }

  &::placeholder {
    color: var(--text-muted);
  }
}

.cd-add {
  flex: none;
  height: 42px;
  padding: 0 18px;
  border: none;
  border-radius: 12px;
  background: var(--accent);
  color: var(--accent-text);
  font-family: "Plus Jakarta Sans Variable", sans-serif;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.1s ease-in-out;

  &:hover {
    opacity: 0.85;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.cd-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.cd-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  height: 26px;
  padding: 0 7px;
  border-radius: 8px;
  background: var(--surface);
  color: var(--text);
  font-family: "Plus Jakarta Sans Variable", sans-serif;
  font-size: 13px;
  font-weight: 500;
  box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.08);
}

.cd-hint {
  margin: 0;
  font-family: "Plus Jakarta Sans Variable", sans-serif;
  font-size: 13px;
  color: var(--text-muted);
}
</style>
