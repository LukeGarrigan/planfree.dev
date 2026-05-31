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

      <div class="heading">Settings</div>
      <p class="subheading">Choose your estimation deck</p>

      <div class="options">
        <button
            v-for="format in gameFormats"
            :key="format.name"
            class="option"
            :class="{ active: format.name === current }"
            @click="() => saveSettings(format)"
        >
          <div class="option-top">
            <span class="option-name">{{ format.name }}</span>
            <span v-if="format.name === current" class="badge">Selected</span>
          </div>
          <div class="option-values">
            <span v-for="value in format.values" :key="`${format.name}-${value}`" class="chip">
              {{ value }}
            </span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import GameFormat from '@/view-models/gameFormat';
import {onMounted, onUnmounted} from 'vue';

defineProps<{
  current?: string;
}>();

const gameFormats = JSON.parse(localStorage.getItem('gameTypes') || '[]');

const emit = defineEmits(['saveSettings', 'close']);

function saveSettings(format: GameFormat) {
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
  width: 90%;
  max-width: 460px;
  padding: 32px 28px;
  border-radius: 20px;
  background: var(--surface);
  color: var(--text);
  box-shadow: var(--shadow-modal);
  font-family: "Montserrat", sans-serif;
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
  margin-bottom: 6px;
}

.subheading {
  font-size: 15px;
  opacity: 0.6;
  margin: 0 0 20px;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  padding: 16px;
  border: 2px solid transparent;
  border-radius: 16px;
  background: var(--surface-sunken);
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s ease, background 0.15s ease;

  &:hover {
    background: var(--surface-sunken-hover);
  }

  &.active {
    border-color: var(--accent);
    background: var(--surface-input);
  }
}

.option-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.option-name {
  font-family: "Montserrat", sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: var(--text);
}

.badge {
  font-size: 12px;
  font-weight: 600;
  color: var(--accent-text);
  background: var(--accent);
  border-radius: 10px;
  padding: 2px 10px;
}

.option-values {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  height: 26px;
  padding: 0 7px;
  border-radius: 8px;
  background: var(--surface);
  color: var(--text);
  font-family: "Montserrat", sans-serif;
  font-size: 13px;
  font-weight: 500;
  box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.08);
}
</style>
