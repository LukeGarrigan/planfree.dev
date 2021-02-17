<template>
  <div class="modal-container">
    <div class="modal">
      <span>{{title}}</span>

      <input id="selectNameInput" type="text" class="input"/>
      
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Modal extends Vue {
  @Prop() private title!: string;

  public mounted() {
    const input = document.getElementById('selectNameInput');
    if (input) {
      input.focus();
    }
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
  }

  .modal {
    width: 500px;
    height: 250px;
    top: 35%;
    position: absolute;
    border-radius: 32px;
    // background: white;
    box-shadow: -6px -6px 10px rgba(255, 255, 255, 0.8), 6px 6px 10px rgba(0, 0, 0, 0.2); color: #6f6cde;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    input {
      width: 80%;
      height :50px;
      border: none;
      outline: none;
      font-size: 32px;
      padding: 10px;
      border-radius: 20px;
      color: #6f6cde;
    }
  }

  span {
    line-height: 100px;
    font-family: "Montserrat", sans-serif;
    font-size: 32px;
    font-weight: semibold;
  }

</style>
