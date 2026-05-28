<script setup lang="ts">
import TrackCard from '@/components/TrackCard.vue';

const tracks = [
  { id: 1, name: 'Track 1', artist: "undefined", cover: undefined },
  { id: 2, name: 'Track 2', artist: "undefined", cover: undefined },
  { id: 3, name: 'Track 3', artist: "undefined", cover: undefined },
  { id: 4, name: 'Track 1', artist: "undefined", cover: undefined },
  { id: 5, name: 'Track 2', artist: "undefined", cover: undefined },
  { id: 6, name: 'Track 3', artist: "undefined", cover: undefined },
  { id: 7, name: 'Track 1', artist: "undefined", cover: undefined },
  { id: 8, name: 'Track 2', artist: "undefined", cover: undefined },
  { id: 9, name: 'Track 3', artist: "undefined", cover: undefined },
  { id: 10, name: 'Track 1', artist: "undefined", cover: undefined },
  { id: 11, name: 'Track 2', artist: "undefined", cover: undefined },
  { id: 12, name: 'Track 3', artist: "undefined", cover: undefined },
]
</script>

<template>
  <div id="history-view">
    <h1 class="safe-top">History</h1>
    <TrackCard
      v-for="track in tracks"
      :key="track.id"
      :title="track.name"
      :artist="track.artist"
      :cover-url="track.cover"
    />
  </div>
</template>

<style lang="css" scoped>
#history-view {
  height: 100%;
  overflow-y: auto;
}

h1 {
  margin-top: 1rem;
  font-size: 1.2rem;
  display: block;
  text-align: center;
}
</style>
