<template>
  <div class="home">
    <button class="button"><span>Cast your votes!</span></button>

    <div class="players" v-for="player in getPlayers()" :key="player.id">
      <div class="player">
        {{player.name}}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import store from '@/store';
import { Component, Vue } from 'vue-property-decorator';
@Component({
  components: {
  },
})
export default class Game extends Vue {
  public modal = false;


  public mounted() {
    store.state.socket.on('update', (players) => {
      store.state.players = players;
    });  
  }

  public getPlayers() {
    return store.state.players;
  }

}

</script>

<style scoped lang="scss">


  .players {
    width: 400px;
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    .player {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      background: #6df8b2; 
      box-shadow: -6px -6px 10px rgba(255, 255, 255, 0.8), 6px 6px 10px rgba(0, 0, 0, 0.2); color: #6f6cde;
      font-size:32px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  
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
