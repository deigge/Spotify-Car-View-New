<script setup lang="ts">
import { useRoute } from 'vue-router'

import NavButton from './NavButton.vue';
import HistoryIcon from './icons/historyIcon.vue';
import HomeIcon from './icons/homeIcon.vue';
import PlaylistIcon from './icons/playlistIcon.vue';

const route = useRoute()
</script>

<template>
  <nav class="bottom-nav safe-bottom">
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
  background: #1111113f;
  border-radius: 2rem;

  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>
