<template>
  <div class="modal-container">
    <div class="modal">
      <div class="settings-container">
        <div class="settings-heading">{{ "Invite the team" }}</div>
        <div class="settings-content">
          <button v-if="!showQRCode" class="button" @click="showQR()">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="48px"
                 height="48px" viewBox="0 0 48 48" version="1.1">
              <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
                    d="M 7.464844 5.332031 C 6.289062 5.332031 5.332031 6.289062 5.332031 7.464844 L 5.332031 16 L 16 16 L 16 5.332031 Z M 13.332031 13.332031 L 8 13.332031 L 8 8 L 13.332031 8 Z M 13.332031 13.332031 "/>
              <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
                    d="M 5.332031 40.535156 C 5.332031 41.710938 6.289062 42.667969 7.464844 42.667969 L 16 42.667969 L 16 32 L 5.332031 32 Z M 8 34.667969 L 13.332031 34.667969 L 13.332031 40 L 8 40 Z M 8 34.667969 "/>
              <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
                    d="M 32 42.667969 L 40.535156 42.667969 C 41.710938 42.667969 42.667969 41.710938 42.667969 40.535156 L 42.667969 32 L 32 32 Z M 34.667969 34.667969 L 40 34.667969 L 40 40 L 34.667969 40 Z M 34.667969 34.667969 "/>
              <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
                    d="M 40.535156 5.332031 L 32 5.332031 L 32 16 L 42.667969 16 L 42.667969 7.464844 C 42.667969 6.289062 41.710938 5.332031 40.535156 5.332031 Z M 40 13.332031 L 34.667969 13.332031 L 34.667969 8 L 40 8 Z M 40 13.332031 "/>
              <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
                    d="M 26.667969 13.332031 L 26.667969 10.667969 L 21.332031 10.667969 L 21.332031 16 L 24 16 L 24 13.332031 Z M 26.667969 13.332031 "/>
              <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
                    d="M 16 16 L 18.667969 16 L 18.667969 18.667969 L 16 18.667969 Z M 16 16 "/>
              <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
                    d="M 18.667969 18.667969 L 24 18.667969 L 24 21.332031 L 18.667969 21.332031 Z M 18.667969 18.667969 "/>
              <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
                    d="M 26.667969 8 L 26.667969 10.667969 L 29.332031 10.667969 L 29.332031 5.332031 L 18.667969 5.332031 L 18.667969 10.667969 L 21.332031 10.667969 L 21.332031 8 Z M 26.667969 8 "/>
              <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
                    d="M 5.332031 18.667969 L 8 18.667969 L 8 24 L 5.332031 24 Z M 5.332031 18.667969 "/>
              <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
                    d="M 16 21.332031 L 16 24 L 13.332031 24 L 13.332031 18.667969 L 10.667969 18.667969 L 10.667969 24 L 8 24 L 8 26.667969 L 5.332031 26.667969 L 5.332031 29.332031 L 10.667969 29.332031 L 10.667969 26.667969 L 13.332031 26.667969 L 13.332031 29.332031 L 16 29.332031 L 16 26.667969 L 18.667969 26.667969 L 18.667969 21.332031 Z M 16 21.332031 "/>
              <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
                    d="M 26.667969 21.332031 L 29.332031 21.332031 L 29.332031 24 L 32 24 L 32 21.332031 L 34.667969 21.332031 L 34.667969 18.667969 L 29.332031 18.667969 L 29.332031 13.332031 L 26.667969 13.332031 L 26.667969 16 L 24 16 L 24 18.667969 L 26.667969 18.667969 Z M 26.667969 21.332031 "/>
              <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
                    d="M 24 40 L 18.667969 40 L 18.667969 42.667969 L 29.332031 42.667969 L 29.332031 40 L 26.667969 40 L 26.667969 37.332031 L 24 37.332031 Z M 24 40 "/>
              <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
                    d="M 29.332031 26.667969 L 29.332031 24 L 26.667969 24 L 26.667969 21.332031 L 24 21.332031 L 24 24 L 21.332031 24 L 21.332031 26.667969 L 24 26.667969 L 24 29.332031 L 26.667969 29.332031 L 26.667969 26.667969 Z M 29.332031 26.667969 "/>
              <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
                    d="M 40 26.667969 L 42.667969 26.667969 L 42.667969 29.332031 L 40 29.332031 Z M 40 26.667969 "/>
              <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
                    d="M 29.332031 26.667969 L 37.332031 26.667969 L 37.332031 29.332031 L 29.332031 29.332031 Z M 29.332031 26.667969 "/>
              <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
                    d="M 40 18.667969 L 37.332031 18.667969 L 37.332031 21.332031 L 34.667969 21.332031 L 34.667969 24 L 37.332031 24 L 37.332031 26.667969 L 40 26.667969 L 40 24 L 42.667969 24 L 42.667969 21.332031 L 40 21.332031 Z M 40 18.667969 "/>
              <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
                    d="M 26.667969 29.332031 L 29.332031 29.332031 L 29.332031 37.332031 L 26.667969 37.332031 Z M 26.667969 29.332031 "/>
              <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
                    d="M 18.667969 37.332031 L 21.332031 37.332031 L 21.332031 34.667969 L 24 34.667969 L 24 32 L 21.332031 32 L 21.332031 26.667969 L 18.667969 26.667969 Z M 18.667969 37.332031 "/>
            </svg>
            <span>QR Code</span>
          </button>

          <button v-if="!showQRCode" class="button" @click="() => share()">
            <svg width="48px" height="48px" viewBox="0 0 24 24" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M9 12C9 13.3807 7.88071 14.5 6.5 14.5C5.11929 14.5 4 13.3807 4 12C4 10.6193 5.11929 9.5 6.5 9.5C7.88071 9.5 9 10.6193 9 12Z"
                  stroke="#1C274C" stroke-width="1.5"/>
              <path d="M14 6.5L9 10" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M14 17.5L9 14" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
              <path
                  d="M19 18.5C19 19.8807 17.8807 21 16.5 21C15.1193 21 14 19.8807 14 18.5C14 17.1193 15.1193 16 16.5 16C17.8807 16 19 17.1193 19 18.5Z"
                  stroke="#1C274C" stroke-width="1.5"/>
              <path
                  d="M19 5.5C19 6.88071 17.8807 8 16.5 8C15.1193 8 14 6.88071 14 5.5C14 4.11929 15.1193 3 16.5 3C17.8807 3 19 4.11929 19 5.5Z"
                  stroke="#1C274C" stroke-width="1.5"/>
            </svg>

            <span>Share</span>
          </button>
          <button v-if="!showQRCode" :class="{ 'button': true}"
                  @click="copyLink()">
            <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 0 24 24" width="48">
              <path d="M0 0h24v24H0V0z" fill="none"/>
              <path
                  d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
            <span>Copy to Clipboard</span>
          </button>

          <div v-if="showQRCode">
            <qrcode-vue :value="value" :level="level" :render-as="renderAs"/>
          </div>

          <button :class="{ 'button': true }" @click="close()">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path
                  d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z"
                  fill="#0F0F0F"/>
            </svg>
            <span>Close</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, defineEmits} from 'vue';
import QrcodeVue, {Level, RenderAs} from 'qrcode.vue';

const value = ref('')
const showQRCode = ref(false);
const level = ref<Level>("H")
const renderAs = ref<RenderAs>('svg')

const emit = defineEmits(['dismissModal'])

async function showQR() {
  value.value = window.location.href
  showQRCode.value = true;
}

function close() {
  showQRCode.value = false;
  emit('dismissModal')
}


async function copyLink() {
  value.value = undefined;
  await navigator.clipboard.writeText(window.location.href);
  close();
}

async function share() {
  try {
    await navigator.share({
      text: "Check out this URL!",
      url: window.location.href,
    });
  } catch (err) {
    console.error(`There was an issue sharing: ${err}`);
  }
  close();
}
</script>

<style scoped lang="scss">

.modal-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  height: fit-content;
  padding: 20px;
  border-radius: 15px;
  box-shadow: -6px -6px 10px rgba(255, 255, 255, 0.8),
  6px 6px 10px rgba(0, 0, 0, 0.2);
  color: #161b1f;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 30%;

  .settings-heading {
    font-size: 26px;
    opacity: 0.5;
    margin-bottom: 20px;
  }

  .settings-subheading {
    font-size: 20px;
    opacity: 0.5;
    margin-bottom: 5px;
  }

  .settings-content {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    flex-direction: column;
    gap: 1em;
  }

  .settings-footer {
    padding-top: 20px;
    justify-content: center;
    display: flex;
    flex-direction: row;
    gap: 1em;
  }

  .button {
    user-select: none;
    display: flex;
    align-items: center;
    padding-left: 20px;
    width: 320px;
    height: 80px;
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

    svg {
      width: 24px;
      height: 24px;
    }

    span {
      padding-left: 20px;
      font-family: "Montserrat", sans-serif;
      font-size: 26px;
      font-weight: semibold;
    }
  }
}

span {
  line-height: 80px;
  font-family: "Montserrat", sans-serif;
  font-size: 26px;
  font-weight: semibold;
}
</style>