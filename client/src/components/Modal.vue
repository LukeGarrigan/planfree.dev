<template>
  <div class="modal-container">
    <div class="modal">
      <span>{{title}}</span>

      <input id="selectNameInput" v-model="name" type="text" class="input" @keypress.enter="completed"/>
      <button
        class="button"
        :class="{ disabled: !name }"
        @click="completed"
      >
        <span>Confirm</span>
      </button>
      
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
@Component
export default class Modal extends Vue {
  @Prop() private title!: string;
  public name = '';
  public mounted() {
    const input = document.getElementById('selectNameInput');
    if (input) {
      input.focus();
    }
  }

  public completed() {
    if(this.name && this.name != "")
      this.$emit('completed', this.name);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
    height: 200px;
    top: 35%;
    position: absolute;
    border-radius: 32px;
    box-shadow: -6px -6px 10px rgba(255, 255, 255, 0.8), 6px 6px 10px rgba(0, 0, 0, 0.2); 
    color: #161b1f;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    input {
      width: 80%;
      height : 40px;
      border: none;
      outline: none;
      font-size: 26px;
      padding: 8px;
      border-radius: 16px;
      color: #161b1f;
    }
  }

  span {
    line-height: 80px;
    font-family: "Montserrat", sans-serif;
    font-size: 26px;
    font-weight: semibold;
  }

  .button {
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    width: 90px;
    height: 40px;
    margin-top: 0.5em;
    background: #f3f0f1;
    border-radius: 32px;
    text-align: center;
    border: none;
    cursor: pointer;
    transition: all 0.1s ease-in-out;
    box-shadow: -6px -6px 10px rgba(255, 255, 255, 0.8),
      6px 6px 10px rgba(0, 0, 0, 0.2);
    color: #161b1f;
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

    span {
      line-height: 100px;
      font-family: "Montserrat", sans-serif;
      font-size: 18px;
      font-weight: semibold;
    }
  }

  .disabled {
    opacity: 1;
    box-shadow: inset -4px -4px 8px rgba(255, 255, 255, 0.5),
      inset 8px 8px 16px rgba(0, 0, 0, 0.1);

    &:hover {
      opacity: 1;
      box-shadow: inset -4px -4px 8px rgba(255, 255, 255, 0.5),
        inset 8px 8px 16px rgba(0, 0, 0, 0.1);
    }
  }

  @media only screen and (min-width: 800px) {
    .button {
      display: none;
    }
  }

</style>
