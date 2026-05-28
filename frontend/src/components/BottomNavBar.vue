<script setup lang="ts">
import { useRoute } from 'vue-router'

import NavButton from './NavButton.vue';
import HistoryIcon from './icons/historyIcon.vue';
import HomeIcon from './icons/homeIcon.vue';
import PlaylistIcon from './icons/playlistIcon.vue';

const route = useRoute()
</script>

<template>
  <nav class="bottom-nav">
    <NavButton href="/playlists" :active="route.path === '/playlists'">
      <PlaylistIcon/>
    </NavButton>

    <NavButton href="/" :active="route.path === '/'">
      <HomeIcon/>
    </NavButton>

    <NavButton href="/history" :active="route.path === '/history'">
      <HistoryIcon/>
    </NavButton>
  </nav>
  </template>

<style lang="css" scoped>
.bottom-nav {
  margin: 0 1rem 1rem 1rem;
  height: 4rem;
  background: #11111198;
  border-radius: 2rem;

  display: flex;
  justify-content: space-around;
  align-items: center;

  position: fixed;
  bottom: calc(1rem + var(--safe-bottom));
  left: 5%;
  right: 5%;

  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  box-shadow: 0 0 1rem 0.4rem #0f0f0f98;
}
</style>
