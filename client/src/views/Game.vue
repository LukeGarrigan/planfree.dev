<template>
  <div class="home">

    <div class="top-buttons">

      <button v-if="!modal" class="edit-name-button" @click="modal = true"><div>{{name}}</div><div><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"/></svg></div></button>
      <button v-if="!modal && !showCopiedToClipboard" class="button invite" @click="copyToClipboard()"><div>Invite players</div><div><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></div></button>
      <button v-if="!modal && showCopiedToClipboard" class="button invite copied no-hover"><div>Copied to clipboard</div><div></div></button>  
    </div>
    <button v-if="!modal && !playerHasVoted() && !showVotes" class="button no-hover" ><span>Cast your votes</span></button>
    <button v-if="!modal && playerHasVoted() && !showVotes" class="button" @click="showVotesClicked()"><span>Show votes!</span></button>
    <button v-if="!modal && showVotes && countdown == 0" class="button start" @click="startNewGame()"><span>Start new game!</span></button>
    <button v-if="!modal && showVotes && countdown > 0" class="button no-hover"><span>{{countdown}}</span></button>
    <Modal v-if="modal" title="What is your name?" @completed="enteredName"></Modal>

    <div class="players" v-for="player in getPlayers()" :key="player.id">
      <div class="player" :class="{'voted': player.vote}">
        <span v-if="showVotes && countdown == 0">{{player.vote}}</span>
      </div>
      <div class="name">
        <span>{{player.name}}</span>
      </div>
    </div>

    <div class="options" v-if="!modal && (!showVotes || showVotes && countdown != 0) ">
      <button class="fib-button" @click="performVote('0')"><span>0</span></button>
      <button class="fib-button" @click="performVote('1')"><span>1</span></button>
      <button class="fib-button" @click="performVote('2')"><span>2</span></button>
      <button class="fib-button" @click="performVote('3')"><span>3</span></button>
      <button class="fib-button" @click="performVote('5')"><span>5</span></button>
      <button class="fib-button" @click="performVote('8')"><span>8</span></button>
      <button class="fib-button" @click="performVote('13')"><span>13</span></button>
      <button class="fib-button" @click="performVote('21')"><span>21</span></button>
      <button class="fib-button" @click="performVote('34')"><span>34</span></button>
      <button class="fib-button" @click="performVote('55')"><span>55</span></button>
      <button class="fib-button" @click="performVote('89')"><span>89</span></button>
      <button class="fib-button" @click="performVote('?')"><span>?</span></button>
    </div>

    <div class="results-container" v-if="showVotes && countdown == 0">
      <div class="results">
        <div class="average"> Average: {{getAverage()}} </div>
        <div class="popular"> Popular: {{getMode()}} </div>
      </div>
        
    </div>

  </div>

 
</template>

<script lang="ts">
import store from '@/store';
import { Component, Vue } from 'vue-property-decorator';
import Modal from '@/components/Modal.vue'; 
import Player from '@/view-models/player'; 
import { io } from "socket.io-client";
@Component({
  components: {
    Modal
  },
})
export default class Game extends Vue {
  public isHovering = false;
  public modal = true;
  public showVotes = false;
  public showCopiedToClipboard = false;
  public countdown = 0;
  public interval: any = {};
  public name = "";


  public mounted() {
    if (this.joiningAGame()) {
      const socket = io(process.env.VUE_APP_SERVER, {
        query: {
          "roomId": this.$route.params.id
        }
      });
      store.commit('setSocket', socket);
    }

    const storedName = localStorage.getItem('name')
    if (storedName) {
      this.enteredName(storedName);
    }

    this.setupSocketHandlers();
  }

  public showVotesClicked() {
    store.state.socket.emit('show');
  }

  public getPlayers() {
    return store.state.players;
  }

  public performVote(vote: string) {
    store.state.socket.emit('vote', vote);
  }

  public startNewGame() {
    store.state.socket.emit('restart');
  }

  public enteredName(name: string) {
    this.name = name;
    this.emitName(name);
    localStorage.setItem('name', name);
    this.modal = false;
  }

  private emitName(name: string) {
    store.state.socket.emit('name', name);
  }

  public playerHasVoted() {
     const players = store.state.players;
     if (players.filter(p => p.vote !== null && p.vote !== undefined).length > 0) {
       return true;
     }
     return false;
  }

  public copyToClipboard() {
    const tempInput = document.createElement("input");
    tempInput.value = window.location.href;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    this.showCopiedToClipboard = true;
    setTimeout(() => this.showCopiedToClipboard = false, 3000);
  }

  public getAverage() {
    const players = store.state.players;
    let count = 0;
    let total = 0;
    for (const player of players) {
      if (player.vote) {
        total += parseInt(player.vote);
        count++;
      } 
    }

    
    return (total / count).toFixed(1).replace(/\.0+$/,'')
  }

  public getMode(): string {
    const players = store.state.players;
    const scores: Record<string, number> = {};
    for (const player of players) {
      if (player.vote) {
        
        if (scores[player.vote]) {
          scores[player.vote] = scores[player.vote] + 1;
        } else {
          scores[player.vote] = 1;
        }
      } 
    }

    let mostSeen = 1;
    let mostSeenCard = '';
    for (const key in scores) {
      const value = scores[key];
      if (value > mostSeen) {
        mostSeen = value;
        mostSeenCard = key;
      }
    }
    
    if (mostSeen == 1) {
      return 'NA';
    } else {
      return mostSeenCard;
    }
  }

  private joiningAGame() {
    const currentState = store.state.socket; 
    return currentState && Object.keys(currentState).length === 0 && currentState.constructor === Object
  }

  private setupSocketHandlers() {
    store.state.socket.on('update', (players: Player[]) => {
      store.state.players = players;
    }); 

    store.state.socket.on('show', () => {
      this.showVotes = true;
      clearInterval(this.interval);
      this.countdown = 3;
      this.interval = setInterval(() => {
        this.countdown -= 1;
        if (this.countdown == 0) {
          clearInterval(this.interval);
        }
      }, 1000)
    })

    store.state.socket.on('restart', () => {
      this.showVotes = false;
    })

    store.state.socket.on('ping', () => {
      store.state.socket.emit('pong');
    })
  }
}

</script>

<style scoped lang="scss">
  .players {
    user-select: none;
    position: relative;
    top: 5em;
    width: 320px;
    height: 320px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .player {
      border-radius: 26px;
      border: none;
      cursor: default;
      width: 64px;
      height: 80px;
      background: #f3f0f1;
      box-shadow: -6px -6px 10px rgba(255, 255, 255, 0.8), 6px 6px 10px rgba(0, 0, 0, 0.2); color: #161b1f;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .name {
      text-align: center;
      font-size:26px;
    }

    .voted {
      background: #54e8dd; 
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
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    z-index:9999;
    top: 45%;
    width: 320px;
    height: 80px;
    background: #f3f0f1;
    border-radius: 32px;
    text-align: center;
    border: none;
    cursor: pointer;
    transition: all 0.1s ease-in-out;
    box-shadow: -6px -6px 10px rgba(255, 255, 255, 0.8), 6px 6px 10px rgba(0, 0, 0, 0.2); color: #161b1f;
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


  .top-buttons {
    display: flex;
    flex-direction: row;
    width: 100%;
    position: absolute;
    justify-content: flex-end;
    top: 2%;
    right: 2%;
    gap: 20px;
    .invite {
      position: relative;
      user-select: none;
      gap: 10px;
      width: 300px;
      height: 70px;
      font-size: 26px;
      svg {
        position: relative;
        left: 2px;
        top: 3px;
        fill: #161b1f;
      }
    }

    .edit-name-button {
      position: relative;
      user-select: none;
      height: 70px;
      font-size: 26px;
      background: #f3f0f1;
      border-radius: 32px;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      opacity: 0.5;
      cursor: pointer;
      &:hover {
        opacity: 1;
      }
      &:hover::before {
         transform: scaleX(1);
      }
      
      &:before {
        content: "";
        position: absolute;
        display: block;
        width: 100%;
        height: 2px;
        bottom: 10px;
        right: 10px;
        background-color: #000;
        transform: scaleX(0);
        transition: transform 0.3s ease;
      }
      svg {
        position: relative;
        left: 2px;
        top: 3px;
      }
    }
  }
 


  .copied {
    background:#54e8dd;
  }

  .no-hover {
    pointer-events: none;
  }

  span {
    line-height: 100px;
    font-family: "Montserrat", sans-serif;
    font-size: 26px;
    font-weight: semibold;
    color: #161b1f;
    user-select: none;
  }

  .results-container {
    display: flex;
    justify-content: center;
    position: absolute;
    flex-wrap: wrap;
    height: 200px;
    gap:30px;
    width: 90%;
    bottom: 5%;
    font-size: 20px;
    color: #54e8dd;

    .results {
      display: flex;
      flex-direction: column;
      justify-content: center;
      background:#161b1f;
      border-radius: 26px;
      border: none;
      width: 250px;
      height: 100px;
      transition: all 0.1s ease-in-out;
      box-shadow: -6px -6px 10px rgba(255, 255, 255, 0.8), 6px 6px 10px rgba(0, 0, 0, 0.2); 
      
      user-select: none;
      font-family: "Montserrat", sans-serif;
      font-weight: semibold;
      &:focus {
        outline: none;
      }

      .average {
        padding: 4px;
      }
    }
  }

  .options {
    display: flex;
    justify-content: center;
    position: absolute;
    flex-wrap: wrap;
    height: 200px;
    gap:30px;
    width: 90%;
    bottom: 5%;
    user-select: none;

    .fib-button {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f3f0f1;
      border-radius: 26px;
      text-align: center;
      border: none;
      cursor: pointer;
      width: 64px;
      height: 80px;
      transition: all 0.1s ease-in-out;
      box-shadow: -6px -6px 10px rgba(255, 255, 255, 0.8), 6px 6px 10px rgba(0, 0, 0, 0.2); color: #161b1f;
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

  }
  

</style>
