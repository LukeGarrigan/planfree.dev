<template>
  <NavigationBar/>
  <div class="about">
    <div class="text-white w-3/4 m-auto mt-10">
      <h1 class="font-bold text-5xl mb-5">Contact</h1>
      <p>
        The best way to contact me is <a href="mailto:lukegarrigan8@gmail.com" class="text-blue-500 underline">through my email</a>
      </p>

      <p>
        Or you can click the chat widget at the bottom right and add your features/ideas/bug reports.
      </p>

    </div>
  </div>
</template>

<script setup lang="ts">

import NavigationBar from "@/components/NavigationBar.vue";
</script>

<style scoped lang="scss">
.about {
  margin: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60%;
  text-align: left;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0%);
  line-height: 30px;
}

</style>