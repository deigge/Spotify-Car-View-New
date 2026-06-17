<script setup lang="ts">
import coverPlaceholder from '@/assets/img/album_cover_placeholder.png'

defineProps<{
  coverUrl?: string
  name: string
}>()
</script>

<template>
  <div id="playlistCard">
    <img id="playlistCover" :src="coverUrl || coverPlaceholder">
    <span>{{ name }}</span>
  </div>
</template>

<style lang="css" scoped>
#playlistCard {
  align-items: center;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

#playlistCover {
  border-radius: 2rem;
  width: 95%;
}

span {
  width: 80%;
  margin-top: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}
</style>
