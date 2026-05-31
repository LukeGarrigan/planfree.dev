<template>
  <div class="modal-overlay" @click="close">
    <div class="modal" @click.stop>
      <button class="close-x" @click="close" aria-label="Close">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
              d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z"
              fill="currentColor"/>
        </svg>
      </button>

      <div class="heading">Invite your team</div>
      <p class="subheading">Scan to join, or share the link below</p>

      <div class="qr">
        <qrcode-vue :value="link" :level="level" :render-as="renderAs" :size="200"/>
      </div>

      <div class="link-row">
        <input
            ref="linkInput"
            class="link-input"
            :value="link"
            readonly
            autocomplete="off"
            data-1p-ignore
            data-lpignore="true"
            @focus="selectAll"
        />
        <button class="copy-btn" :class="{ copied }" @click="copyLink">
          {{ copied ? "Copied!" : "Copy" }}
        </button>
      </div>

      <button v-if="canShare" class="text-btn share-btn" @click="share">
        Share via…
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, onUnmounted} from "vue";
import QrcodeVue, {Level, RenderAs} from "qrcode.vue";

const link = ref(window.location.href);
const copied = ref(false);
const canShare = ref(typeof navigator !== "undefined" && !!navigator.share);
const level = ref<Level>("H");
const renderAs = ref<RenderAs>("svg");
const linkInput = ref<HTMLInputElement | null>(null);

const emit = defineEmits(["dismissModal"]);

function close() {
  emit("dismissModal");
}

function selectAll(e: FocusEvent) {
  (e.target as HTMLInputElement).select();
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(link.value);
  } catch {
    // Fallback for older/insecure contexts
    linkInput.value?.select();
    document.execCommand("copy");
  }
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
}

async function share() {
  try {
    await navigator.share({
      title: "planfree.dev",
      text: "Join my planning poker room",
      url: link.value,
    });
    close();
  } catch {
    // User cancelled or share failed — keep the modal open
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") close();
}

onMounted(() => window.addEventListener("keydown", onKeydown));
onUnmounted(() => window.removeEventListener("keydown", onKeydown));
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
  position: relative;
  width: 90%;
  max-width: 460px;
  padding: 32px 28px;
  border-radius: 20px;
  background: var(--surface);
  color: var(--text);
  box-shadow: var(--shadow-modal);
  font-family: "Montserrat", sans-serif;
}

.close-x {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--text);
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 1;
  }
}

.heading {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 6px;
}

.subheading {
  font-size: 15px;
  opacity: 0.6;
  margin: 0 0 20px;
}

.link-row {
  display: flex;
  gap: 10px;
  align-items: stretch;
}

.link-input {
  flex: 1;
  min-width: 0;
  padding: 0 16px;
  height: 52px;
  border: none;
  border-radius: 14px;
  background: var(--surface-sunken);
  color: var(--text);
  font-family: "Montserrat", sans-serif;
  font-size: 14px;
  box-shadow: var(--shadow-inset);

  &:focus {
    outline: 2px solid var(--accent);
  }
}

.copy-btn {
  flex: 0 0 auto;
  padding: 0 24px;
  height: 52px;
  border: none;
  border-radius: 14px;
  background: var(--inverse-surface);
  color: var(--inverse-text);
  font-family: "Montserrat", sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    opacity: 0.85;
  }

  &.copied {
    background: var(--accent);
    color: var(--accent-text);
  }
}

.text-btn {
  display: block;
  width: 100%;
  margin-top: 16px;
  padding: 6px 0;
  border: none;
  background: transparent;
  color: var(--text);
  font-family: "Montserrat", sans-serif;
  font-size: 15px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 1;
  }
}

.qr {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.qr :deep(svg) {
  padding: 12px;
  background: #fff;
  border-radius: 16px;
  box-shadow: inset 3px 3px 6px rgba(0, 0, 0, 0.08),
  inset -3px -3px 6px rgba(255, 255, 255, 0.7);
}
</style>
