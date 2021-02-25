<template>
  <div class="home">
    <button class="button" @click="startGame()"><span>Start new game</span></button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { io } from "socket.io-client";
import Vuex from 'vuex'
import store from '@/store';
import router from '@/router';
@Component({
  components: {
  },
})
export default class Home extends Vue {

  public startGame() {
    // https://z6vll.sse.codesandbox.io
    const socket = io("http://localhost:3000");
    store.commit('setSocket', socket);
    store.state.socket.on('room', (roomId: string) => {
      router.push({ path: `game/${roomId}`});  
    }); 
  }
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
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    z-index:9999;
    top: 40%;
    width: 320px;
    height: 80px;
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
    }
    &:focus {
      outline: none;
    }
  }
  span {
    line-height: 100px;
    font-family: "Montserrat", sans-serif;
    font-size: 26px;
    font-weight: semibold;
  }

</style>
