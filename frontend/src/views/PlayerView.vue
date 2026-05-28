<script setup lang="ts">
  import { ref } from 'vue'

  import TrackInfo from '@/components/player/TrackInfo.vue';
  import coverPlaceholder from '@/assets/img/album_cover_placeholder.png'
  import PlayerControls from '@/components/player/PlayerControls.vue';

  const playlistName = 'My Playlist';
  const albumCover = ref(coverPlaceholder)
</script>

<template>
  <div class="player-view">
    <span class="playlist-name safe-top">{{ playlistName }}</span>
    <TrackInfo title="Lorem ipsum yadda yadda yadda" artist="Artist"/>

    <img id="albumCover" :src="albumCover" />
    <input type="range" min="0" max="100" value="30" id="progress-bar" />
    <PlayerControls />
  </div>
</template>

<style lang="css" scoped>
.player-view {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  padding-bottom: 4rem;
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
  margin-top: 1rem;
  margin-bottom: 1rem;
  accent-color: rgb(144, 255, 80);
  width: 70%;
}
</style>
