<template>
  <div class="navigation-bar">
    <router-link class="link" to="/">Home</router-link>
    <router-link class="link" to="/about">About</router-link>
    <router-link class="link" to="/contact">Contact</router-link>
    <router-link class="link" to="/privacy">Policy</router-link>
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
  .link {
    text-decoration: none;
  }
}

</style>