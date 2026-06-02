<template>
  <CreateRoomModal @completed="createRoom"></CreateRoomModal>
</template>

<script setup lang="ts">
import router from "@/router";
import { io } from "socket.io-client";
import { ref } from "vue";
import { useGameEngine } from "@/composables/useGameEngine";
import CreateRoomModal from "@/components/CreateRoomModal.vue";
import GameFormat from "@/view-models/gameFormat";
import { getUserId } from "@/utils/user";

const { socket, setSocket } = useGameEngine();
const hasStarted = ref(false);

function createRoom({ teamName, gameType }: { teamName: string; gameType: GameFormat }) {
  setTimeout(() => {
    if (!hasStarted.value) {
      alert("Unable to connect to the server. Please check your internet connection or try again later.");
    }
  }, 6000);
  registerSocket(teamName, gameType);
}

function registerSocket(teamName: string, gameType: GameFormat) {
  const newSocket = io(import.meta.env.VITE_SERVER, {
    query: {
      teamName: teamName.trim(),
      gameType: gameType.name,
      userId: getUserId(),
    },
  });
  setSocket(newSocket);
  socket.value.on("room", (roomId: string) => {
    hasStarted.value = true;
    // The handshake only carries the deck name, which the server resolves
    // against its built-in list — a custom deck wouldn't be found there. Push
    // the full chosen deck now so custom values apply from the first round.
    socket.value.emit("gameTypeChanged", gameType);
    router.push({ path: `/game/${roomId}` });
  });
  socket.value.on("gameTypes", (gameTypes: GameFormat[]) => {
    localStorage.setItem("gameTypes", JSON.stringify(gameTypes));
  });
}
</script>
