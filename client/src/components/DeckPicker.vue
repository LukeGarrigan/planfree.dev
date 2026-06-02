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
        <span
            v-if="deletable?.includes(format.name)"
            class="option-delete"
            role="button"
            tabindex="0"
            :aria-label="`Delete ${format.name} deck`"
            @click.stop="emit('delete', format.name)"
            @keydown.enter.stop.prevent="emit('delete', format.name)"
            @keydown.space.stop.prevent="emit('delete', format.name)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
                d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z"
                fill="currentColor"/>
          </svg>
        </span>
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
  // Names of decks that show a delete affordance (the user's custom decks).
  deletable?: string[];
}>();

const emit = defineEmits<{
  (e: 'select', format: GameFormat): void
  (e: 'delete', name: string): void
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
  gap: 8px;
}

.option-name {
  /* Push the badge / delete button over to the right edge. */
  margin-right: auto;
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

.option-delete {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.15s ease, background 0.15s ease;

  &:hover {
    opacity: 1;
    background: var(--surface);
  }
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
