<template>
  <div class="modal-overlay">
    <div class="modal" @click.stop>
      <label for="selectNameInput" class="heading">{{ title }}</label>
      <p class="subheading">This is how your teammates will see you</p>
      <div class="input-container">
        <PFInput v-model="name" @completed="completed" :max-length="25" placeholder="e.g. Alex"></PFInput>
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
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(22, 27, 31, 0.35);
  backdrop-filter: blur(2px);
}

.modal {
  width: 90%;
  max-width: 400px;
  padding: 32px 28px;
  border-radius: 20px;
  background: #f3f0f1;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3);
  color: #161b1f;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .input-container {
    display: flex;
  }
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
</style>
