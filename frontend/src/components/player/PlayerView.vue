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
    <input type="range" min="0" max="100" value="30" id="progress-bar" />
    <PlayerControls />
  </div>
</template>

<style lang="css" scoped>
.player-view {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
}

.playlist-name {
  margin-top: 1rem;
  font-size: 1rem;
  display: block;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

#albumCover {
  margin-top: 1rem;
  width: 80%;
  border-radius: 2rem;
}

#progress-bar {
  flex: 1;
  accent-color: rgb(144, 255, 80);
  width: 70%;
}
</style>
