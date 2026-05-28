<script setup lang="ts">
  import { ref } from 'vue'
  import coverPlaceholder from '@/assets/img/album_cover_placeholder.png'
import IconButton from './IconButton.vue';
import ShareIcon from './icons/shareIcon.vue';
import HeartIcon from './icons/heartIcon.vue';

  const props = defineProps<{
    title: string
    artist: string
    coverUrl?: string
    }>()

const trackCover = ref(coverPlaceholder)
</script>

<template>
  <div id="trackCard">
    <img id="trackCover" :src="coverUrl || trackCover">
    <div id="trackInfo">
      <span id="title">{{ props.title }}</span>
      <span id="artist">{{ props.artist }}</span>
    </div>
    <div id="buttons">
      <IconButton>
        <ShareIcon/>
      </IconButton>
      <IconButton>
        <HeartIcon/>
      </IconButton>
    </div>
  </div>
  <hr>
</template>

<style lang="css" scoped>
#trackCard {
  display: flex;
  flex-direction: row;
  min-width: 0;
  gap: 0.75rem;
  padding-right: 1rem;
}

#trackInfo {
  display: flex;
  flex-direction: column;
  min-width: 0;
  justify-content: center;
}

#trackCover {
  margin-left: 1rem;
  border-radius: 0.5rem;
  width: 95%;
  height: 100%;
  width: 3rem;
  height: 3rem;
  flex-shrink: 0;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

hr {
  border: none;
  border-top: 1px solid #333;
  margin-left: 5%;
  margin-right: 5%;
}

#buttons {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
