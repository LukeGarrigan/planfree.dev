<template>
  <div class="modal-overlay" @click="emit('close')">
    <div class="modal" @click.stop>
      <p class="heading">Log in to planfree</p>
      <p class="subheading">Optional — you can keep playing without an account</p>
      <div class="providers">
        <button class="provider" @click="login('github')">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path
                d="M10.9,2.1c-4.6,0.5-8.3,4.2-8.8,8.7c-0.5,4.7,2.2,8.9,6.3,10.5C8.7,21.4,9,21.2,9,20.8v-1.6c0,0-0.4,0.1-0.9,0.1 c-1.4,0-2-1.2-2.1-1.9c-0.1-0.4-0.3-0.7-0.6-1C5.1,16.3,5,16.3,5,16.2C5,16,5.3,16,5.4,16c0.6,0,1.1,0.7,1.3,1c0.5,0.8,1.1,1,1.4,1 c0.4,0,0.7-0.1,0.9-0.2c0.1-0.7,0.4-1.4,1-1.8c-2.3-0.5-4-1.8-4-4c0-1.1,0.5-2.2,1.2-3C7.1,8.8,7,8.3,7,7.6c0-0.4,0-0.9,0.2-1.3 C7.2,6.1,7.4,6,7.5,6c0,0,0.1,0,0.1,0C8.1,6.1,9.1,6.4,10,7.3C10.6,7.1,11.3,7,12,7s1.4,0.1,2,0.3c0.9-0.9,2-1.2,2.5-1.3 c0,0,0.1,0,0.1,0c0.2,0,0.3,0.1,0.4,0.3C17,6.7,17,7.2,17,7.6c0,0.8-0.1,1.2-0.2,1.4c0.7,0.8,1.2,1.8,1.2,3c0,2.2-1.7,3.5-4,4 c0.6,0.5,1,1.4,1,2.3v2.6c0,0.3,0.3,0.6,0.7,0.5c3.7-1.5,6.3-5.1,6.3-9.3C22,6.1,16.9,1.4,10.9,2.1z"/>
          </svg>
          <span>Continue with GitHub</span>
        </button>
        <button class="provider" @click="login('google')">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8a12 12 0 1 1 0-24c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 1 0 24 44c11 0 20-8 20-20 0-1.3-.1-2.3-.4-3.5z"/>
            <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8A12 12 0 0 1 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 0 0 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A12 12 0 0 1 12.7 28l-6.6 5.1A20 20 0 0 0 24 44z"/>
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C39.4 36 44 30.6 44 24c0-1.3-.1-2.3-.4-3.5z"/>
          </svg>
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth, type AuthProvider } from "@/composables/useAuth";

const emit = defineEmits(["close"]);
const { signInWith } = useAuth();

function login(provider: AuthProvider) {
  signInWith(provider);
}
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--overlay);
  backdrop-filter: blur(2px);
}

.modal {
  width: 90%;
  max-width: 400px;
  padding: 32px 28px;
  border-radius: 20px;
  background: var(--surface);
  box-shadow: var(--shadow-modal);
  color: var(--text);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.heading {
  font-family: "Plus Jakarta Sans Variable", sans-serif;
  font-size: 1.375rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 6px;
}

.subheading {
  font-family: "Plus Jakarta Sans Variable", sans-serif;
  font-size: 0.875rem;
  opacity: 0.6;
  text-align: center;
  margin: 0 0 20px;
}

.providers {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.provider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 16px;
  background: var(--surface);
  box-shadow: var(--shadow-raised);
  color: var(--text);
  font-family: "Plus Jakarta Sans Variable", sans-serif;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.1s ease-in-out;

  &:hover {
    opacity: 0.5;
  }

  &:active {
    opacity: 1;
    box-shadow: var(--shadow-pressed);
  }
}
</style>
