<template>
    <div class="modal-container">
        <div class="modal">
            <div class="settings-container">
                <div class="settings-heading">{{'Settings'}}</div>
                <div class="settings-subheading">{{'Units'}}</div>
                <div class="settings-content">
                    <button v-for="vote in gameFormats" :key="`vote-${vote}`" class="button"
                        @click="() => saveSettings(vote)">
                        <span>{{ vote.name }}</span>
                    </button>

                  <button class="button"
                          @click="close()">
                    <span>Close</span>
                  </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import GameFormat from '@/view-models/gameFormat';
import { defineEmits } from 'vue';
let gameFormats = JSON.parse(localStorage.getItem('gameTypes'));

const emit = defineEmits(['saveSettings', 'close'])
function saveSettings(vote: GameFormat) {
    emit('saveSettings', vote);
}

function close() {
  emit('close');
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
        margin-bottom: 5px;
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
        flex-direction: row;
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
        justify-content: center;
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

        span {
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