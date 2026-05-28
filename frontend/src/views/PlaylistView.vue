<script setup lang="ts">
import PlaylistCard from '@/components/PlaylistCard.vue'

const playlists = [
  { id: 1, name: 'Playlist 1', cover: undefined },
  { id: 2, name: 'Playlist 2', cover: undefined },
  { id: 3, name: 'Playlist 3', cover: undefined },
  { id: 4, name: 'Playlist 1', cover: undefined },
  { id: 5, name: 'Playlist 2', cover: undefined },
  { id: 6, name: 'Playlist 3', cover: undefined },
  { id: 7, name: 'Playlist 1', cover: undefined },
  { id: 8, name: 'Playlist 2', cover: undefined },
  { id: 9, name: 'Playlist 3', cover: undefined },
]
</script>

<template>
  <div class="playlist-view">
    <h1 class="safe-top">My playlists</h1>

    <div class="playlists-grid">
      <PlaylistCard
        v-for="playlist in playlists"
        :key="playlist.id"
        :coverUrl="playlist.cover"
        :name="playlist.name"
      />
    </div>
  </div>
</template>

<style lang="css" scoped>

.playlist-view {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
}

.playlists-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
}

h1 {
  margin-top: 1rem;
  font-size: 1.2rem;
  display: block;
  text-align: center;
}

</style>
