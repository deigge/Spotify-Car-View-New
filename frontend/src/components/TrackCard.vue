<script setup lang="ts">
import coverPlaceholder from '/album_cover_placeholder.png';
import IconButton from './IconButton.vue';
import ShareIcon from './icons/shareIcon.vue';
import HeartIcon from './icons/heartIcon.vue';
import { showToast, ToastType } from '@/components/ToastComponent.vue';
import { useImageFallback } from '@/composables/UseImageFallback';

const onImageError = useImageFallback(coverPlaceholder);

const props = defineProps<{
  title: string;
  artist: string;
  spotifyUrl: string;
  coverUrl?: string;
}>();

async function share() {
  if (!props.spotifyUrl) return;

  if (navigator.share) {
    await navigator.share({
      title: props.title,
      text: `${props.title} - ${props.artist}`,
      url: props.spotifyUrl,
    });
  } else {
    // Fallback
    await navigator.clipboard.writeText(props.spotifyUrl);
    showToast('Link wurde kopiert!', ToastType.Success);
  }
}
</script>

<template>
  <div id="trackCard">
    <img id="trackCover" :src="coverUrl" @error="onImageError" />
    <div id="trackInfo">
      <span id="title">{{ props.title }}</span>
      <span id="artist">{{ props.artist }}</span>
    </div>
    <div id="buttons">
      <IconButton @click="share">
        <ShareIcon />
      </IconButton>
      <IconButton>
        <HeartIcon />
      </IconButton>
    </div>
  </div>
  <hr />
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
