<script setup lang="ts">
import { ref } from 'vue';
import coverPlaceholder from '/album_cover_placeholder.png';
import IconButton from './IconButton.vue';
import ShareIcon from './icons/shareIcon.vue';
import HeartIcon from './icons/heartIcon.vue';
import { showToast, ToastType } from '@/components/ToastComponent.vue';
import { useImageFallback } from '@/composables/UseImageFallback';
import HeartFilledIcon from './icons/heartFilledIcon.vue';
import type { PlayedSong } from '../../../shared/types/playedSong.ts';
import { useAuthStore } from '@/stores/auth';

const spotifyApi = useAuthStore();

const onImageError = useImageFallback(coverPlaceholder);

const props = defineProps<{
  song: PlayedSong;
  disabled: boolean;
}>();

const isSaved = ref(props.song.isSaved);

async function share() {
  if (!props.song.spotifyUrl) {
    showToast('Link not available', ToastType.Info);
    return;
  }

  if (navigator.share) {
    await navigator.share({
      title: props.song.name,
      text: `${props.song.name} - ${props.song.artists[0]}`,
      url: props.song.spotifyUrl,
    });
  } else {
    // Fallback
    await navigator.clipboard.writeText(props.song.spotifyUrl);
    showToast('Link copied!', ToastType.Success);
  }
}

async function toggleLike() {
  await likeSong(!isSaved.value);
}

async function likeSong(save: boolean) {
  if (isSaved.value == null) {
    showToast('Like state unavailable', ToastType.Info);
    return;
  }
  const previousValue = isSaved.value;
  isSaved.value = !previousValue;

  const spotifyRequest = save
    ? await spotifyApi.spotifyPut(`/me/library?uris=${props.song.spotifyUri}`)
    : await spotifyApi.spotifyDelete(`/me/library?uris=${props.song.spotifyUri}`);

  if (!spotifyRequest.ok) {
    isSaved.value = previousValue;
    showToast('Failed to update', ToastType.Error);
    return;
  }

  const dbRes = await fetch(`/api/updatesong/${props.song.trackId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isSaved: isSaved.value }),
  });

  if (!dbRes.ok) {
    isSaved.value = previousValue;
    showToast('Failed to save', ToastType.Error);
  }
}
</script>

<template>
  <div id="trackCard">
    <img
      id="trackCover"
      :src="song.albumCovers[0]?.url ?? coverPlaceholder"
      @error="onImageError"
      aria-label="Track Cover"
    />
    <div id="trackInfo">
      <span id="title">{{ props.song.name }}</span>
      <span id="artist">{{ props.song.artists.join(', ') }}</span>
    </div>
    <div id="buttons">
      <IconButton @click="share" aria-label="Share">
        <ShareIcon />
      </IconButton>
      <IconButton
        :disabled="props.disabled"
        :active="isSaved"
        @click="toggleLike"
        :aria-label="isSaved ? 'Unlike Song' : 'Like Song'"
      >
        <HeartFilledIcon v-if="isSaved" />
        <HeartIcon v-else />
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
