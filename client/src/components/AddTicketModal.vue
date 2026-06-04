<template>
  <div class="modal-overlay" @click="emit('close')">
    <div class="modal" @click.stop>
      <label class="heading">Add a ticket</label>
      <p class="subheading">Everyone in this session will see this</p>

      <div class="fields">
        <div class="field">
          <label for="ticketTitle" class="field-label">Title</label>
          <input
              id="ticketTitle"
              v-model="title"
              class="field-input"
              type="text"
              autocomplete="off"
              data-1p-ignore
              data-lpignore="true"
              maxlength="100"
              placeholder="e.g. Add dark mode toggle"
              @keypress.enter="submit"
          />
        </div>

        <div class="field">
          <label for="ticketId" class="field-label">ID</label>
          <input
              id="ticketId"
              v-model="ticketId"
              class="field-input"
              type="text"
              autocomplete="off"
              data-1p-ignore
              data-lpignore="true"
              maxlength="40"
              placeholder="Auto-generated if left blank"
              @keypress.enter="submit"
          />
        </div>

        <div class="field">
          <label for="ticketLink" class="field-label">Link</label>
          <input
              id="ticketLink"
              v-model="link"
              class="field-input"
              type="url"
              autocomplete="off"
              data-1p-ignore
              data-lpignore="true"
              maxlength="500"
              placeholder="https://..."
              @keypress.enter="submit"
          />
        </div>

        <div class="field">
          <label for="ticketDescription" class="field-label">Description</label>
          <textarea
              id="ticketDescription"
              v-model="description"
              class="field-input field-textarea"
              maxlength="1000"
              rows="3"
              placeholder="What needs estimating?"
          ></textarea>
        </div>
      </div>

      <div class="actions">
        <button class="cancel-button" type="button" @click="emit('close')">
          <span>Cancel</span>
        </button>
        <button class="add-button" type="button" :disabled="!title.trim()" @click="submit">
          <span>Add ticket</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';

export interface NewTicket {
  title: string;
  ticketId: string;
  link: string;
  description: string;
}

const emit = defineEmits<{
  (e: 'completed', payload: NewTicket): void
  (e: 'close'): void
}>();

const title = ref('');
const ticketId = ref('');
const link = ref('');
const description = ref('');

onMounted(() => {
  const input = document.getElementById('ticketTitle') as HTMLInputElement | null;
  input?.focus();
});

function submit() {
  if (!title.value.trim()) {
    return;
  }
  emit('completed', {
    title: title.value.trim(),
    ticketId: ticketId.value.trim(),
    link: link.value.trim(),
    description: description.value.trim(),
  });
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
  font-family: "Plus Jakarta Sans Variable", sans-serif;
  font-size: 22px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 6px;
}

.subheading {
  font-family: "Plus Jakarta Sans Variable", sans-serif;
  font-size: 14px;
  opacity: 0.6;
  text-align: center;
  margin: 0 0 20px;
}

.fields {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-family: "Plus Jakarta Sans Variable", sans-serif;
  font-size: 14px;
  font-weight: 600;
  opacity: 0.7;
}

.field-input {
  box-sizing: border-box;
  width: 100%;
  height: 45px;
  border: none;
  outline: none;
  font-size: 18px;
  font-family: "Plus Jakarta Sans Variable", sans-serif;
  border-radius: 10px;
  background: var(--surface-input);
  color: var(--text);
  padding: 8px 12px;

  &::placeholder {
    color: var(--text-muted);
    font-size: 16px;
  }
}

.field-textarea {
  height: auto;
  resize: vertical;
  min-height: 70px;
  line-height: 1.4;
}

.actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  width: 100%;
  margin-top: 24px;
}

.cancel-button,
.add-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  padding: 0 22px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  transition: opacity 0.1s ease-in-out;

  span {
    font-family: "Plus Jakarta Sans Variable", sans-serif;
    font-size: 16px;
    font-weight: 600;
  }

  &:hover {
    opacity: 0.85;
  }
}

.cancel-button {
  background: var(--surface-input);

  span {
    color: var(--text);
  }
}

.add-button {
  background: var(--accent);

  span {
    color: var(--accent-text);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}
</style>
