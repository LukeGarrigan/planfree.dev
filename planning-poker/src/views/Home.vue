<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/> -->

    <button v-if="!modal" class="button" @click="modal = true"><span>Start new game</span></button>
    <Modal v-if="modal" title="What is your name?"></Modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Modal from '@/components/Modal.vue'; // @ is an alias to /src

@Component({
  components: {
    Modal
  },
})
export default class Home extends Vue {
  public modal = false;

}

</script>

<style scoped lang="scss">
  .home {
    display: flex;
    justify-content: center;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
  }
  .button {
    position: absolute;
    top: 40%;
    width: 400px;
    height: 100px;
    background: #f3f0f1;
    border-radius: 32px;
    text-align: center;
    border: none;
    cursor: pointer;
    transition: all 0.1s ease-in-out;
    box-shadow: -6px -6px 10px rgba(255, 255, 255, 0.8), 6px 6px 10px rgba(0, 0, 0, 0.2); color: #6f6cde;
    &:hover {
      opacity: 0.3;
      box-shadow: -6px -6px 10px rgba(255, 255, 255, 0.8),
        6px 6px 10px rgba(0, 0, 0, 0.2);
    }
    &:active {
      opacity: 1;
      box-shadow: inset -4px -4px 8px rgba(255, 255, 255, 0.5),
        inset 8px 8px 16px rgba(0, 0, 0, 0.1);
      color: #79e3b6;
    }
    &:focus {
      outline: none;
    }
  }
  span {
    line-height: 100px;
    font-family: "Montserrat", sans-serif;
    font-size: 32px;
    font-weight: semibold;
  }

</style>
