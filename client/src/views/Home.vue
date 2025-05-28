<script setup lang="ts">
import router from "@/router";
import { io } from "socket.io-client";
import { ref, onMounted } from "vue";
import { useGameEngine } from "@/composables/useGameEngine";
import GameFormat from "@/view-models/gameFormat";

const { socket, setSocket } = useGameEngine();
const clickedStart = ref(false);
const hasStarted = ref(false);

onMounted(() => {
  startGame();
})

function startGame() {
  clickedStart.value = true;
  setTimeout(() => {
    if (!hasStarted.value) {
      alert("Unable to connect to the server. Please check your internet connection or try again later.");
      clickedStart.value = false; // Reset button state
    }
  }, 6000);
  registerSocket();
}

function goToPrivacy() {
  router.push({ path: "/privacy" }); // Navigate to the privacy policy page
}

function registerSocket() {
  const newSocket = io(process.env.VUE_APP_SERVER);
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
<style scoped lang="scss">
.home {
  display: flex;
  justify-content: center;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}


.container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 800px;
}

.start-game {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 80%;
  position: relative;
}

.button {
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
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

svg rect {
  fill: #54e8dd;
}

.free-poker-header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 80%;
  width: 100%;

  h1 {
    user-select: none;
    font-size: 3.2em;

    span {
      color: #54e8dd;
      background: black;
      border-radius: 10px;
      width: 7rem;
      display: inline-block;
    }
  }
}


@media only screen and (max-width: 800px) {

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 800px;
  }

  .free-poker-header {
    width: 90%;
    align-items: flex-end;
  }

  .start-game {
    align-items: flex-start;
  }
}

.privacy {
  text-decoration: underline;
  position: absolute;
}
</style>


<style scoped lang="scss">
.home {
  display: flex;
  justify-content: center;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}


.container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 800px;
}

.start-game {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 80%;
  position: relative;
}

.button {
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
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

svg rect {
  fill: #54e8dd;
}

.free-poker-header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 80%;
  width: 100%;

  h1 {
    user-select: none;
    font-size: 3.2em;

    span {
      color: #54e8dd;
      background: black;
      border-radius: 10px;
      width: 7rem;
      display: inline-block;
    }
  }
}


@media only screen and (max-width: 800px) {

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 800px;
  }

  .free-poker-header {
    width: 90%;
    align-items: flex-end;
  }

  .start-game {
    align-items: flex-start;
  }
}

.privacy {
  text-decoration: underline;
  position: absolute;
}
</style>