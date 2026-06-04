<template>
  <div class="modal-overlay">
    <div class="modal" @click.stop>
      <label for="selectNameInput" class="heading">{{ title }}</label>
      <p class="subheading">{{ subheading }}</p>
      <div class="input-container">
        <PFInput v-model="name" @completed="completed" :max-length="maxLength" :placeholder="placeholder"></PFInput>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import PFInput from "@/components/Input.vue";

const props = withDefaults(defineProps<{
  title: string
  subheading?: string
  placeholder?: string
  maxLength?: number
  initialValue?: string
}>(), {
  subheading: 'This is how your teammates will see you',
  placeholder: 'e.g. Alex',
  maxLength: 25,
  initialValue: ''
})

const emit = defineEmits(['completed'])

const name = ref(props.initialValue);
onMounted(() => {
  const input = document.getElementById('selectNameInput') as HTMLInputElement | null;
  if (input) {
    input.focus();
    input.select();
  }
})

function completed() {
  if (name.value && name.value.trim()) {
    emit('completed', name.value);
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
  max-width: 400px;
  padding: 32px 28px;
  border-radius: 20px;
  background: var(--surface);
  box-shadow: var(--shadow-modal);
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .input-container {
    display: flex;
  }
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
</style>
