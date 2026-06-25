<script setup lang="ts">
import ExternalLinkIcon from '@/components/icons/externalLinkIcon.vue';

/**
 * Leitet den Nutzer zum Backend Login Flow weiter
 */
function login() {
  window.location.href = '/auth/login';
}
</script>

<template>
  <div id="login">
    <button id="loginButton" @click="login">
      Log in with Spotify
      <ExternalLinkIcon />
    </button>
  </div>
</template>

<style lang="css" scoped>
#login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

#loginButton {
  all: unset;
  background-color: var(--accent-color);
  color: var(--vt-c-black);
  font-size: 1.5rem;
  padding-left: 6%;
  padding-right: 6%;
  padding-top: 3%;
  padding-bottom: 3%;
  border-radius: 2rem;
}

#loginButton svg {
  vertical-align: middle;
}

#loginButton:focus {
  outline: revert;
}

#loginButton:hover {
  background-color: var(--accent-color-light);
}
</style>
