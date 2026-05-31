<template>
  <div class="options">
    <button
        v-for="format in formats"
        :key="format.name"
        class="option"
        :class="{ active: format.name === selected }"
        type="button"
        @click="emit('select', format)"
    >
      <div class="option-top">
        <span class="option-name">{{ format.name }}</span>
        <span v-if="format.name === selected" class="badge">Selected</span>
      </div>
      <div class="option-values">
        <span v-for="value in format.values" :key="`${format.name}-${value}`" class="chip">
          {{ value }}
        </span>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import GameFormat from '@/view-models/gameFormat';

defineProps<{
  formats: GameFormat[];
  selected?: string;
}>();

const emit = defineEmits<{
  (e: 'select', format: GameFormat): void
}>();
</script>

<style scoped lang="scss">
.options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
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
