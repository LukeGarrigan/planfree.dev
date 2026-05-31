<template>
  <div id="app">
    <title>Planning Poker</title>
    <router-view/>
  </div>
</template>

<style lang="scss">

/* ---------------------------------------------------------------------------
   Theme tokens. Every colour and neumorphic shadow in the app references one
   of these custom properties, so theming is a matter of redefining the tokens
   rather than touching each component. Dark values live in @mixin dark-tokens
   below and are applied either by the OS preference or an explicit data-theme.
   --------------------------------------------------------------------------- */
:root {
  --surface: #f3f0f1;            /* page background + raised controls */
  --surface-sunken: #ece8e9;     /* secondary fills (settings options) */
  --surface-sunken-hover: #e6e1e2;
  --surface-input: #ffffff;      /* text inputs / enter button */
  --inverse-surface: #161b1f;    /* dark cards (results) + copy button */
  --inverse-text: #54e8dd;       /* text sitting on --inverse-surface */

  --text: #161b1f;
  --text-muted: #a0a0a0;

  --accent: #54e8dd;
  --accent-text: #161b1f;        /* text/icons on an accent background */

  --overlay: rgba(22, 27, 31, 0.35);

  --shadow-raised: -6px -6px 10px rgba(255, 255, 255, 0.8),
  6px 6px 10px rgba(0, 0, 0, 0.2);
  --shadow-pressed: inset -4px -4px 8px rgba(255, 255, 255, 0.5),
  inset 8px 8px 16px rgba(0, 0, 0, 0.1);
  --shadow-modal: 0 16px 48px rgba(0, 0, 0, 0.3);
  --shadow-inset: inset 3px 3px 6px rgba(0, 0, 0, 0.12),
  inset -3px -3px 6px rgba(255, 255, 255, 0.7);
}

@mixin dark-tokens {
  --surface: #23272b;
  --surface-sunken: #1d2125;
  --surface-sunken-hover: #2b3035;
  --surface-input: #2b3035;
  --inverse-surface: #0e1215;
  --inverse-text: #54e8dd;

  --text: #e8e6e7;
  --text-muted: #7f868c;

  --accent: #54e8dd;
  --accent-text: #0e1215;

  --overlay: rgba(0, 0, 0, 0.55);

  --shadow-raised: -6px -6px 12px rgba(255, 255, 255, 0.04),
  6px 6px 12px rgba(0, 0, 0, 0.55);
  --shadow-pressed: inset -4px -4px 8px rgba(255, 255, 255, 0.03),
  inset 8px 8px 16px rgba(0, 0, 0, 0.5);
  --shadow-modal: 0 16px 48px rgba(0, 0, 0, 0.6);
  --shadow-inset: inset 3px 3px 6px rgba(0, 0, 0, 0.5),
  inset -3px -3px 6px rgba(255, 255, 255, 0.04);
}

/* Default to the OS preference, unless the user has explicitly chosen light. */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    @include dark-tokens;
  }
}

/* An explicit choice (saved in localStorage) always wins. */
[data-theme="dark"] {
  @include dark-tokens;
}

html, body {
  margin: 0;
  height: 100%;
  box-sizing: border-box;
  background: var(--surface);
}

#planfree {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--text);
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
