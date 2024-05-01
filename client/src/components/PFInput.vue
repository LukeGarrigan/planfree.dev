<template>

  <div class="input-container">
    <input
        type="text"
        id="selectNameInput"
        v-model="model"
        @input="updateValue"
        class="input"
        :maxlength="props.maxLength"
        minlength="1"
        :placeholder="placeholder"
        @keypress.enter="completed"
    />

    <button class="enter-button" type="submit" aria-label="Use name" @click="completed">
      <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 0 24 24"
          width="24px"
          fill="#000000"
      >
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">

import {ref} from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  maxLength: {
    type: Number,
    default: 100
  }
})

let model = ref(props.modelValue);

const emit = defineEmits(['update:modelValue', 'completed']);

const updateValue = (event: any) => {
  emit('update:modelValue', event.target.value);
};

const completed = () => {
  if (model.value.length > 0) {
    emit('completed');
  }
  model.value = '';
}
</script>

<style scoped lang="scss">
.input-container {
  display: flex;
}

.enter-button {
  //background: #54e8dd;
  background: white;
  border: none;
  cursor: pointer;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  width: 50px;
  height: 45px;
}

input {
  box-sizing: border-box;
  width: 295px;
  height: 45px;
  border: none;
  outline: none;
  font-size: 20px;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  color: #161b1f;
  padding: 8px 50px 8px 8px;
}

input::placeholder {
  color: #a0a0a0; /* Lighter/dimmer color for the placeholder */
  font-size: 20px; /* Smaller font size for the placeholder */
  padding-left: 10px;
}
</style>
