<script setup lang="ts">
import coverPlaceholder from '@/assets/img/album_cover_placeholder.png';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const spotifyApi = useAuthStore();
const router = useRouter();

const props = defineProps<{
  coverUrl?: string
  name: string
  playlistURI: string
}>()

function selectPlaylist(){
  spotifyApi.spotifyPut("me/player/play", { context_uri: props.playlistURI});
  router.push("/");
}
</script>

<template>
  <button id="playlistCard" @click="selectPlaylist">
    <img id="playlistCover" :src="coverUrl || coverPlaceholder">
    <span>{{ name }}</span>
  </button>
</template>

<style lang="css" scoped>
#playlistCard {
  align-items: center;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: none;
  border: none;
  color: #d1d1d1;
  cursor: pointer;
}

#playlistCard:hover, #playlistCard:focus-visible {
  color: white;
}

#playlistCard:active {
  color: rgb(204, 255, 174);
}

#playlistCard:hover #playlistCover,
#playlistCard:focus-visible #playlistCover {
  filter: brightness(1.3);
}

#playlistCard:active #playlistCover {
  filter: brightness(0.8);
  transform: scale(0.96);
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
