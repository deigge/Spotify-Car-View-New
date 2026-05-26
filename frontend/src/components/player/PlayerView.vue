<script setup lang="ts">
  import { ref } from 'vue'

  import TrackInfo from './pComponents/TrackInfo.vue';
  import coverPlaceholder from '@/assets/img/album_cover_placeholder.png'
  import PlayerControls from './pComponents/PlayerControls.vue';

  const playlistName = 'My Playlist';
  const albumCover = ref(coverPlaceholder)
</script>

<template>
  <div class="player-view">
    <span class="playlist-name">{{ playlistName }}</span>
    <TrackInfo />

    <img id="albumCover" :src="albumCover" />

    <PlayerControls />
  </div>
</template>

<style lang="css" scoped>
.player-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: 0 auto;
  align-items: center;
}

.playlist-name {
  margin-top: 1rem;
  font-size: 1.5rem;
  display: block;
  text-align: center;
}

#albumCover {
  margin-top: 1rem;
  margin-bottom: 1rem;
  width: 80%;
  border-radius: 2rem;
}
</style>
