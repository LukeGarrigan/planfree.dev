<template>
  <div class="modal-container">
    <div class="modal">
      <span><label for="selectNameInput">{{ title }}</label></span>
      <div class="input-container">
        <PFInput v-model="name" @completed="completed" :max-length="25"></PFInput>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import PFInput from "@/components/Input.vue";

defineProps<{
  title: string
}>()

const emit = defineEmits(['completed'])

const name = ref('');
onMounted(() => {
  const input = document.getElementById('selectNameInput');
  if (input) {
    input.focus();
  }
})

function completed() {
  if (name.value && name.value.trim()) {
    emit('completed', name.value);
  }
}

</script>

<style scoped lang="scss">
.modal-container {
  width: 100%;
  height: 100%;
  //background: pink;
  display: flex;
  justify-content: center;
  position: absolute;
}

.modal {
  width: 400px;
  height: 220px;
  top: 35%;
  position: absolute;
  border-radius: 15px;
  box-shadow: -6px -6px 10px rgba(255, 255, 255, 0.8),
  6px 6px 10px rgba(0, 0, 0, 0.2);
  color: #161b1f;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .input-container {
    display: flex;
  }
}

span {
  line-height: 80px;
  font-family: "Montserrat", sans-serif;
  font-size: 26px;
  font-weight: semibold;
}
</style>
