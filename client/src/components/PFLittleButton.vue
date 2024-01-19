<template>
  <button class="little-button" :aria-label="props.type" @click="clicked">
    <svg v-if="props.type == 'delete'" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960"
         width="20">
      <path
          d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
    </svg>
    <svg v-if="props.type == 'github'" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20"
         viewBox="0 0 24 24">
      <path
          d="M10.9,2.1c-4.6,0.5-8.3,4.2-8.8,8.7c-0.5,4.7,2.2,8.9,6.3,10.5C8.7,21.4,9,21.2,9,20.8v-1.6c0,0-0.4,0.1-0.9,0.1 c-1.4,0-2-1.2-2.1-1.9c-0.1-0.4-0.3-0.7-0.6-1C5.1,16.3,5,16.3,5,16.2C5,16,5.3,16,5.4,16c0.6,0,1.1,0.7,1.3,1c0.5,0.8,1.1,1,1.4,1 c0.4,0,0.7-0.1,0.9-0.2c0.1-0.7,0.4-1.4,1-1.8c-2.3-0.5-4-1.8-4-4c0-1.1,0.5-2.2,1.2-3C7.1,8.8,7,8.3,7,7.6c0-0.4,0-0.9,0.2-1.3 C7.2,6.1,7.4,6,7.5,6c0,0,0.1,0,0.1,0C8.1,6.1,9.1,6.4,10,7.3C10.6,7.1,11.3,7,12,7s1.4,0.1,2,0.3c0.9-0.9,2-1.2,2.5-1.3 c0,0,0.1,0,0.1,0c0.2,0,0.3,0.1,0.4,0.3C17,6.7,17,7.2,17,7.6c0,0.8-0.1,1.2-0.2,1.4c0.7,0.8,1.2,1.8,1.2,3c0,2.2-1.7,3.5-4,4 c0.6,0.5,1,1.4,1,2.3v2.6c0,0.3,0.3,0.6,0.7,0.5c3.7-1.5,6.3-5.1,6.3-9.3C22,6.1,16.9,1.4,10.9,2.1z"></path>
    </svg>
    <svg v-if="props.type == 'pwa'" xmlns="http://www.w3.org/2000/svg" height="20" width="20">
      <path
          d="M7 17v-2H3.5q-.625 0-1.062-.438Q2 14.125 2 13.5v-9q0-.625.438-1.062Q2.875 3 3.5 3H11v1.5H3.5v9h13V11H18v2.5q0 .625-.438 1.062Q17.125 15 16.5 15H13v2Zm7.479-6L11 7.521l1.062-1.063 1.688 1.688V3h1.5v5.104l1.688-1.687L18 7.479Z"/>
    </svg>
    <div v-if="popoverText" class="popover">{{ props.popoverText }}</div>
  </button>
</template>

<script setup lang="ts">

import {computed, ref, watch} from "vue";

const props = defineProps({
  type: {
    type: String,
    default: 'delete'
  },
  popoverText: {
    type: String,
    default: ''
  },
})

let model = ref(props.modelValue);

const emit = defineEmits(['clicked']);

const clicked = () => {
  emit('clicked');
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">


.little-button {
  position: relative;
  background: #f3f0f1;
  border-radius: 32px;
  text-align: center;
  border: none;
  cursor: pointer;
  width: 30px;
  height: 30px;
  box-shadow: -6px -6px 10px rgba(255, 255, 255, 0.8),
  6px 6px 10px rgba(0, 0, 0, 0.2);
  color: #161b1f;

  svg {
    margin-top: 4px;
  }

  &:hover {
    opacity: 0.3;
    box-shadow: -6px -6px 10px rgba(255, 255, 255, 0.8),
    6px 6px 10px rgba(0, 0, 0, 0.2);
  }

}

.popover {
  position: absolute;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%);
  visibility: hidden;
  opacity: 0;
  width: 100px;
  transition: opacity 0.2s, visibility 0.2s;
}

.little-button:hover .popover {
  visibility: visible;
  opacity: 1;
}
</style>
