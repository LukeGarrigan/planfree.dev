<template>
  <div class="navigation-bar">
    <router-link to="/">Home</router-link>
    <router-link to="/about">About</router-link>
    <router-link to="/privacy">Privacy Policy</router-link>
    <router-link to="/contact">Contact</router-link>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">

.navigation-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
  font-family: "Montserrat", sans-serif;
  font-weight: semibold;
}

</style>