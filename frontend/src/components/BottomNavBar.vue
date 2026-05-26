<script setup lang="ts">
  import IconButton from './IconButton.vue';
import HistoryIcon from './icons/historyIcon.vue';
import HomeIcon from './icons/homeIcon.vue';
import PlaylistIcon from './icons/playlistIcon.vue';
</script>

<template>
  <nav class="bottom-nav">
    <IconButton>
      <PlaylistIcon/>
    </IconButton>

    <IconButton active>
      <HomeIcon/>
    </IconButton>

    <IconButton>
      <HistoryIcon/>
    </IconButton>
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
