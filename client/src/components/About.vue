<template>
  <NavigationBar/>
  <div class="about">
    <div class="text-white w-3/4 m-auto mt-10">
      <h1 class="font-bold text-5xl mb-5">About Planfree.dev</h1>
      <p>Planfree.dev came about whilst working at <a href="https://netcall.com">Netcall</a>, my team were using existing planning poker websites
        and were constantly frustrated at all the paywalls we had to deal with. So I decided to build my own and see how it went. To begin with just my team used planfree.dev every other week during our planning meetings, now 100s of budding estimators jump in each day!
      </p>

      <h2 class="text-4xl mt-4">History of planfree</h2>
      <p>
        If you're interested I have a blog website at <a href="https://codeheir.com">Codeheir.com</a>. I wrote a blog when I first released planfree.dev that you can <a href="https://codeheir.com/2021/07/02/a-completely-free-planning-poker-app-%F0%9F%92%B8-speed-up-your-planning-process/">find here</a> as well as update blogs such as <a href="https://codeheir.com/2023/11/24/planfree-goes-heroku/">Planfree goes Heroku</a> that talks through some of the deployment decisions made.
      </p>

      <h2 class="text-4xl mt-4">Ideas</h2>
      <p>
        If you have any ideas click the chat icon at the bottom right of the screen and add your brilliant idea
      </p>

      <h2 class="text-4xl mt-4">Contributing</h2>
      <p>
        If you want to contribute give the <a href="https://github.com/LukeGarrigan/planfree.dev">planfree.dev repository</a> a star on GitHub and pick a ticket from the issues section. I really appreciate all the developers out there that chip in, it's lovely.
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