<template>
  <div id="app">
    <title>Planning Poker</title>
    <router-view/>
  </div>
</template>

<style lang="scss">

html, body {
  margin: 0;
  height: 100%;
  box-sizing: border-box;
  background: #f3f0f1;

}

#planfree {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

#app {
  height: 100%;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

p, h1, h2, h3, h4 {
  margin: 0;
}
</style>
