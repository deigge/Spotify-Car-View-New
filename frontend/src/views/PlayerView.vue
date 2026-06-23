<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

import TrackInfo from '@/components/player/TrackInfo.vue';
import coverPlaceholder from '/album_cover_placeholder.png';
import PlayerControls from '@/components/player/PlayerControls.vue';
import type { SpotifyPlayer } from '../../../shared/types/spotifyPlayer';

import { useAuthStore } from '@/stores/auth';
import type { SpotifyPlaylist } from '../../../shared/types/spotifyPlaylist';
import { useOnlineStatus } from '@/composables/UseOnlineStatus';
import { useImageFallback } from '@/composables/UseImageFallback';
import CloudOffIcon from '@/components/icons/cloudOffIcon.vue';

const { isOnline } = useOnlineStatus();
const onImageError = useImageFallback(coverPlaceholder);

const spotifyApi = useAuthStore();

const trackTitle = ref('');
const trackArtist = ref('');
const playlistName = ref('');
const albumCover = ref(coverPlaceholder);
const progress = ref(0);

const isPlaying = ref(false);
const shuffleState = ref(false);
const repeatState = ref('');

let progressInterval: number;
let syncInterval: number;
let startTime = 0;
let startProgress = 0;
let currentTrackId = '';
let currentTrack = {} as SpotifyPlayer;

onMounted(async () => {
  watch(
    isOnline,
    async (online) => {
      if (online) {
        const fetchedTrack = await spotifyApi.spotifyFetch('me/player');
        if (!fetchedTrack?.item) return;
        currentTrack = fetchedTrack;
        currentTrackId = fetchedTrack.item.id;
        updateTrackDetails(fetchedTrack);
        updatePlayerControls(fetchedTrack);
        startProgress = fetchedTrack.progress_ms;
        startTime = Date.now();
        progress.value = (startProgress / fetchedTrack.item.duration_ms) * 100;
        startIntervals();
      } else {
        stopIntervals();
      }
    },
    { immediate: true }
  );

  requestIdleCallback(() => {
    preloadTabData();
  });
});

onBeforeUnmount(() => {
  stopIntervals();
});

function startIntervals() {
  if (progressInterval || syncInterval) return;
  progressInterval = window.setInterval(() => {
    updatePlayerControls(currentTrack);
    if (!currentTrack?.is_playing) return;

    const elapsed = Date.now() - startTime;
    const newProgress = startProgress + elapsed;

    const duration = currentTrack.item.duration_ms;

    progress.value = (newProgress / duration) * 100;
  }, 1000);

  syncInterval = window.setInterval(async () => {
    const fetchedTrack = await spotifyApi.spotifyFetch('me/player');

    if (!fetchedTrack?.item) return;

    // 🔥 TRACK CHANGE DETECTED
    if (fetchedTrack.item.id !== currentTrackId) {
      currentTrackId = fetchedTrack.item.id;

      currentTrack = fetchedTrack;

      await updateTrackDetails(fetchedTrack);

      startProgress = fetchedTrack.progress_ms;
      startTime = Date.now();

      const duration = fetchedTrack.item.duration_ms;
      progress.value = (startProgress / duration) * 100;

      await fetch('/api/addsong', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentTrack),
      });

      return;
    }

    // 🔄 SAME TRACK → SYNC CORRECTION
    currentTrack = fetchedTrack;

    startProgress = fetchedTrack.progress_ms;
    startTime = Date.now();
  }, 2000);
}

function stopIntervals() {
  clearInterval(progressInterval);
  clearInterval(syncInterval);
  progressInterval = 0;
  syncInterval = 0;
}

async function preloadTabData() {
  const data = await spotifyApi.spotifyFetch('me/playlists').catch(() => null);

  const urls: string[] = [
    ...new Set(data?.items?.map((p: SpotifyPlaylist) => p.images?.[0]?.url).filter(Boolean)),
  ] as string[];

  urls.forEach((url: string) => {
    const img = new Image();
    img.loading = 'lazy';
    img.src = url;
  });

  fetch('/api/history').catch(() => {});
}

async function updatePlayerControls(currentTrack: SpotifyPlayer) {
  isPlaying.value = currentTrack.is_playing;
  shuffleState.value = currentTrack.shuffle_state;
  repeatState.value = currentTrack.repeat_state;
}

async function updateTrackDetails(currentTrack: SpotifyPlayer) {
  trackTitle.value = currentTrack.item.name;
  trackArtist.value = currentTrack.item.artists?.[0]?.name ?? 'Unknown Artist';
  albumCover.value = currentTrack.item.album?.images?.[0]?.url ?? '';

  switch (currentTrack.context?.type) {
    case 'playlist': {
      const id = currentTrack.context.uri.split(':')[2];
      const playlist = (await spotifyApi.spotifyFetch(`playlists/${id}`)) as SpotifyPlaylist;
      playlistName.value = playlist.name;
      break;
    }

    case 'album':
      playlistName.value = currentTrack.item.album.name;
      break;

    case 'artist':
      playlistName.value = trackArtist.value;
      break;

    default:
      playlistName.value = '';
  }
}
</script>

<template>
  <div class="player-view">
    <span class="playlist-name safe-top">{{ playlistName }}</span>
    <TrackInfo :title="trackTitle" :artist="trackArtist" />

    <div class="cover-wrapper">
      <img id="albumCover" :src="albumCover" @error="onImageError" />
      <div class="offline-overlay" v-if="!isOnline">
        <CloudOffIcon />
        <span>offline</span>
      </div>
    </div>

    <input type="range" min="0" max="100" :value="progress" id="progress-bar" />
    <PlayerControls
      :isPlaying="isPlaying"
      :shuffleState="shuffleState"
      :repeatState="repeatState"
      :disabled="!isOnline"
    />
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

.cover-wrapper {
  position: relative;
  width: 70%;
  margin-top: 1rem;
}

#albumCover {
  width: 100%;
  border-radius: 2rem;
  display: block;
}

.offline-overlay {
  position: absolute;
  inset: 0;
  border-radius: 2rem;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  flex-direction: column;
  gap: 0.5rem;
}

.offline-overlay svg {
  width: 5rem;
  height: 5rem;
}

#progress-bar {
  margin-top: 1rem;
  margin-bottom: 1rem;
  accent-color: rgb(144, 255, 80);
  width: 70%;
  pointer-events: none;
}
</style>
