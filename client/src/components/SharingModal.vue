<template>
    <div class="modal-container">
        <div class="modal">
            <div class="settings-container">
                <div class="settings-heading">{{ $t(title) }}</div>
                <div class="settings-subheading">{{ $t(subTitle) }}</div>
                <div class="settings-content">
                    <button class="button" @click="() => share(`QR`)">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="48px"
                            height="48px" viewBox="0 0 48 48" version="1.1">
                            <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
                                d="M 7.464844 5.332031 C 6.289062 5.332031 5.332031 6.289062 5.332031 7.464844 L 5.332031 16 L 16 16 L 16 5.332031 Z M 13.332031 13.332031 L 8 13.332031 L 8 8 L 13.332031 8 Z M 13.332031 13.332031 " />
                            <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
                                d="M 5.332031 40.535156 C 5.332031 41.710938 6.289062 42.667969 7.464844 42.667969 L 16 42.667969 L 16 32 L 5.332031 32 Z M 8 34.667969 L 13.332031 34.667969 L 13.332031 40 L 8 40 Z M 8 34.667969 " />
                            <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
                                d="M 32 42.667969 L 40.535156 42.667969 C 41.710938 42.667969 42.667969 41.710938 42.667969 40.535156 L 42.667969 32 L 32 32 Z M 34.667969 34.667969 L 40 34.667969 L 40 40 L 34.667969 40 Z M 34.667969 34.667969 " />
                            <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
                                d="M 40.535156 5.332031 L 32 5.332031 L 32 16 L 42.667969 16 L 42.667969 7.464844 C 42.667969 6.289062 41.710938 5.332031 40.535156 5.332031 Z M 40 13.332031 L 34.667969 13.332031 L 34.667969 8 L 40 8 Z M 40 13.332031 " />
                            <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
                                d="M 26.667969 13.332031 L 26.667969 10.667969 L 21.332031 10.667969 L 21.332031 16 L 24 16 L 24 13.332031 Z M 26.667969 13.332031 " />
                            <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
                                d="M 16 16 L 18.667969 16 L 18.667969 18.667969 L 16 18.667969 Z M 16 16 " />
                            <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
                                d="M 18.667969 18.667969 L 24 18.667969 L 24 21.332031 L 18.667969 21.332031 Z M 18.667969 18.667969 " />
                            <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
                                d="M 26.667969 8 L 26.667969 10.667969 L 29.332031 10.667969 L 29.332031 5.332031 L 18.667969 5.332031 L 18.667969 10.667969 L 21.332031 10.667969 L 21.332031 8 Z M 26.667969 8 " />
                            <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
                                d="M 5.332031 18.667969 L 8 18.667969 L 8 24 L 5.332031 24 Z M 5.332031 18.667969 " />
                            <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
                                d="M 16 21.332031 L 16 24 L 13.332031 24 L 13.332031 18.667969 L 10.667969 18.667969 L 10.667969 24 L 8 24 L 8 26.667969 L 5.332031 26.667969 L 5.332031 29.332031 L 10.667969 29.332031 L 10.667969 26.667969 L 13.332031 26.667969 L 13.332031 29.332031 L 16 29.332031 L 16 26.667969 L 18.667969 26.667969 L 18.667969 21.332031 Z M 16 21.332031 " />
                            <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
                                d="M 26.667969 21.332031 L 29.332031 21.332031 L 29.332031 24 L 32 24 L 32 21.332031 L 34.667969 21.332031 L 34.667969 18.667969 L 29.332031 18.667969 L 29.332031 13.332031 L 26.667969 13.332031 L 26.667969 16 L 24 16 L 24 18.667969 L 26.667969 18.667969 Z M 26.667969 21.332031 " />
                            <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
                                d="M 24 40 L 18.667969 40 L 18.667969 42.667969 L 29.332031 42.667969 L 29.332031 40 L 26.667969 40 L 26.667969 37.332031 L 24 37.332031 Z M 24 40 " />
                            <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
                                d="M 29.332031 26.667969 L 29.332031 24 L 26.667969 24 L 26.667969 21.332031 L 24 21.332031 L 24 24 L 21.332031 24 L 21.332031 26.667969 L 24 26.667969 L 24 29.332031 L 26.667969 29.332031 L 26.667969 26.667969 Z M 29.332031 26.667969 " />
                            <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
                                d="M 40 26.667969 L 42.667969 26.667969 L 42.667969 29.332031 L 40 29.332031 Z M 40 26.667969 " />
                            <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
                                d="M 29.332031 26.667969 L 37.332031 26.667969 L 37.332031 29.332031 L 29.332031 29.332031 Z M 29.332031 26.667969 " />
                            <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
                                d="M 40 18.667969 L 37.332031 18.667969 L 37.332031 21.332031 L 34.667969 21.332031 L 34.667969 24 L 37.332031 24 L 37.332031 26.667969 L 40 26.667969 L 40 24 L 42.667969 24 L 42.667969 21.332031 L 40 21.332031 Z M 40 18.667969 " />
                            <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
                                d="M 26.667969 29.332031 L 29.332031 29.332031 L 29.332031 37.332031 L 26.667969 37.332031 Z M 26.667969 29.332031 " />
                            <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
                                d="M 18.667969 37.332031 L 21.332031 37.332031 L 21.332031 34.667969 L 24 34.667969 L 24 32 L 21.332031 32 L 21.332031 26.667969 L 18.667969 26.667969 Z M 18.667969 37.332031 " />
                        </svg>
                        <span>QR Code</span>
                    </button>

                    <button class="button" @click="() => share(`WhatsApp`)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48px" height="48px" viewBox="0 0 48 48">
                            <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
                                d="M 13.90625 10.34375 C 13.835938 10.34375 13.765625 10.351562 13.695312 10.367188 C 13.625 10.382812 13.558594 10.40625 13.496094 10.4375 C 13.433594 10.464844 13.332031 10.542969 13.332031 10.542969 C 13.3125 10.554688 13.296875 10.570312 13.28125 10.582031 C 13.28125 10.582031 8.894531 14.640625 9.824219 19.597656 C 10.089844 21.019531 11.03125 22.5625 12.335938 24.234375 C 13.640625 25.910156 15.328125 27.6875 17.164062 29.382812 C 20.832031 32.773438 25.011719 35.828125 27.988281 36.964844 C 30.789062 38.039062 33.472656 36.765625 35.34375 35.34375 C 37.214844 33.921875 38.425781 32.261719 38.425781 32.261719 C 38.453125 32.230469 38.472656 32.191406 38.492188 32.15625 C 38.628906 31.890625 38.601562 31.683594 38.574219 31.542969 C 38.550781 31.402344 38.511719 31.300781 38.464844 31.199219 C 38.378906 31 38.265625 30.816406 38.128906 30.609375 C 37.851562 30.203125 37.472656 29.730469 37.03125 29.246094 C 36.152344 28.273438 35.09375 27.257812 34.078125 26.734375 C 33.664062 26.519531 33.242188 26.675781 33.019531 26.808594 C 32.796875 26.945312 32.640625 27.097656 32.476562 27.269531 C 32.148438 27.617188 31.820312 28.050781 31.464844 28.5 C 30.757812 29.402344 29.929688 30.171875 29.632812 30.277344 C 29.683594 30.257812 29.09375 30.386719 28.632812 30.222656 C 28.171875 30.054688 27.777344 29.804688 27.101562 29.398438 C 25.753906 28.589844 24.125 27.371094 22.59375 26.039062 C 21.0625 24.707031 19.625 23.25 18.644531 21.980469 C 18.152344 21.34375 17.777344 20.757812 17.558594 20.28125 C 17.34375 19.808594 17.320312 19.472656 17.34375 19.371094 C 17.667969 17.988281 18.269531 17.441406 18.800781 16.894531 C 19.066406 16.621094 19.398438 16.34375 19.507812 15.785156 C 19.621094 15.222656 19.324219 14.675781 18.917969 14.246094 C 16.9375 12.160156 15.785156 11.214844 15.039062 10.753906 C 14.664062 10.523438 14.390625 10.40625 14.113281 10.359375 C 14.042969 10.351562 13.976562 10.34375 13.90625 10.34375 Z M 13.90625 10.34375 " />
                            <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
                                d="M 24.523438 0.00390625 L 22.808594 0.00390625 L 22.894531 0.0898438 C 10.714844 0.929688 1.054688 11.085938 1.054688 23.476562 C 1.058594 27.226562 1.972656 30.910156 3.691406 34.234375 L 0.00390625 47.996094 L 13.765625 44.308594 C 17.089844 46.027344 20.773438 46.945312 24.523438 46.945312 C 37.464844 46.945312 47.996094 36.417969 47.996094 23.476562 C 47.996094 10.535156 37.464844 0.00390625 24.523438 0.00390625 Z M 24.523438 3.710938 L 24.550781 3.710938 C 35.480469 3.722656 44.292969 12.542969 44.292969 23.476562 C 44.292969 34.417969 35.464844 43.246094 24.527344 43.246094 C 22.945312 43.242188 20.449219 42.609375 18.410156 41.960938 C 16.371094 41.3125 14.765625 40.667969 14.765625 40.667969 L 14.765625 40.664062 L 14.332031 40.492188 L 5.214844 42.785156 L 7.503906 33.695312 L 7.339844 33.246094 L 7.335938 33.234375 C 7.335938 33.234375 6.6875 31.628906 6.039062 29.589844 C 5.390625 27.550781 4.757812 25.054688 4.757812 23.476562 C 4.757812 12.535156 13.585938 3.707031 24.523438 3.707031 Z M 24.523438 3.710938 " />
                        </svg>

                        <span>Whatsapp</span>
                    </button>
                    <button class="button" @click="() => share(`Email`)">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="48px"
                            height="48px" viewBox="0 0 48 48" version="1.1">
                            <path style=" stroke:none;fill-rule:evenodd;fill:rgb(0%,0%,0%);fill-opacity:1;"
                                d="M 0 42.355469 L 48 42.355469 L 48 5.648438 L 0 5.648438 Z M 2.824219 9.417969 L 2.824219 8.472656 L 45.175781 8.472656 L 45.175781 9.417969 L 24 27.78125 Z M 45.175781 13.15625 L 45.175781 36.917969 L 36.398438 25.945312 L 34.191406 27.707031 L 43.648438 39.53125 L 4.351562 39.53125 L 13.808594 27.707031 L 11.601562 25.945312 L 2.824219 36.917969 L 2.824219 13.15625 L 24 31.519531 Z M 45.175781 13.15625 " />
                        </svg>
                        <span>Email</span>
                    </button>
                    <button class="button" @click="() => share(`Copy`)">
                        <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 0 24 24" width="48">
                            <path d="M0 0h24v24H0V0z" fill="none" />
                            <path
                                d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                        </svg>
                        <span>Copy</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';
const props = defineProps<{
    title: string,
    subTitle: string
}>()

const emit = defineEmits(['share'])

function share(type: string) {
    emit('share', type)
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
        // justify-content: start;
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
        padding-left: 20px;
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