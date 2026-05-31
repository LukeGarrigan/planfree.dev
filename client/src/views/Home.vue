<template>
  <Modal
      title="Name your team"
      subheading="Everyone in this session will see this"
      placeholder="e.g. The Avengers"
      :max-length="30"
      @completed="enteredTeamName"
  ></Modal>
</template>

<script setup lang="ts">
import router from "@/router";
import { io } from "socket.io-client";
import { ref } from "vue";
import { useGameEngine } from "@/composables/useGameEngine";
import Modal from "@/components/Modal.vue";
import GameFormat from "@/view-models/gameFormat";
import { getUserId } from "@/utils/user";

const { socket, setSocket } = useGameEngine();
const hasStarted = ref(false);

function enteredTeamName(teamName: string) {
  setTimeout(() => {
    if (!hasStarted.value) {
      alert("Unable to connect to the server. Please check your internet connection or try again later.");
    }
  }, 6000);
  registerSocket(teamName);
}

function registerSocket(teamName: string) {
  const newSocket = io(import.meta.env.VITE_SERVER, {
    query: {
      teamName: teamName.trim(),
      userId: getUserId(),
    },
  });
  setSocket(newSocket);
  socket.value.on("room", (roomId: string) => {
    hasStarted.value = true;
    router.push({ path: `/game/${roomId}` });
  });
  socket.value.on("gameTypes", (gameTypes: GameFormat[]) => {
    localStorage.setItem("gameTypes", JSON.stringify(gameTypes));
  });
}
</script>
