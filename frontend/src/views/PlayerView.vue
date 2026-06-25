<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

import TrackInfo from '@/components/player/TrackInfo.vue';
import coverPlaceholder from '/album_cover_placeholder.png';
import PlayerControls from '@/components/player/PlayerControls.vue';
import ExternalLinkIcon from '@/components/icons/externalLinkIcon.vue';
import type { SpotifyPlayer } from '../../../shared/types/spotifyPlayer';

import { useAuthStore } from '@/stores/auth';
import type { SpotifyPlaylist } from '../../../shared/types/spotifyPlaylist';
import { useOnlineStatus } from '@/composables/UseOnlineStatus';
import { useImageFallback } from '@/composables/UseImageFallback';
import CloudOffIcon from '@/components/icons/cloudOffIcon.vue';

const { isOnline } = useOnlineStatus();
const onImageError = useImageFallback(coverPlaceholder);

const spotifyApi = useAuthStore();

const isWaitingForTrack = ref(false);

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
      await fetchAndUpdateTrack();
      if (online) {
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

async function fetchAndUpdateTrack() {
  const fetchRequest = await spotifyApi.spotifyFetch('me/player');
  const fetchedTrack = fetchRequest?.data;

  if (!fetchedTrack?.item) {
    isWaitingForTrack.value = true;
    return;
  }

  isWaitingForTrack.value = false;

  currentTrack = fetchedTrack;
  currentTrackId = fetchedTrack.item.id;

  updateTrackDetails(fetchedTrack);
  updatePlayerControls(fetchedTrack);

  startProgress = fetchedTrack.progress_ms;
  startTime = Date.now();
  progress.value = (startProgress / fetchedTrack.item.duration_ms) * 100;
}

function startIntervals() {
  if (progressInterval || syncInterval) return;
  progressInterval = window.setInterval(() => {
    if (!currentTrack?.is_playing) return;

    const elapsed = Date.now() - startTime;
    const newProgress = startProgress + elapsed;

    const duration = currentTrack.item.duration_ms;

    progress.value = (newProgress / duration) * 100;
  }, 1000);

  syncInterval = window.setInterval(async () => {
    const fetchRequest = await spotifyApi.spotifyFetch('me/player');
    const fetchedTrack = fetchRequest?.data;

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

      const [isSaved] = (
        await spotifyApi.spotifyFetch(`me/library/contains?uris=${currentTrack.item?.uri}`)
      )?.data ?? [false];

      await fetch('/api/addsong', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...currentTrack, isSaved }),
      });

      return;
    }

    // 🔄 SAME TRACK → SYNC CORRECTION
    currentTrack = fetchedTrack;
    if (fetchedTrack.is_playing !== isPlaying.value) {
      isPlaying.value = fetchedTrack.is_playing;
    }
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
  const request = await spotifyApi.spotifyFetch('me/playlists').catch(() => null);
  const data = request?.data;

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
  trackArtist.value = currentTrack.item.artists?.map((a) => a.name).join(', ') ?? 'Unknown Artist';
  albumCover.value = currentTrack.item.album?.images?.[0]?.url ?? '';

  switch (currentTrack.context?.type) {
    case 'playlist': {
      const id = currentTrack.context.uri.split(':')[2];
      const playlist = (await spotifyApi.spotifyFetch(`playlists/${id}`))
        ?.data as SpotifyPlaylist | null;
      playlistName.value = playlist?.name ?? '';
      break;
    }

    case 'album':
      playlistName.value = currentTrack.item.album.name ?? '';
      break;

    case 'artist':
      playlistName.value = trackArtist.value ?? '';
      break;

    default:
      playlistName.value = '';
  }
}

function openSpotify() {
  window.open('spotify://', '_blank');
}
</script>

<template>
  <div class="player-view">
    <span class="playlist-name safe-top">{{ playlistName }}</span>
    <TrackInfo :title="trackTitle" :artist="trackArtist" />

    <div class="cover-wrapper">
      <img
        id="albumCover"
        :src="albumCover ?? coverPlaceholder"
        @error="onImageError"
        alt="Album Cover"
      />
      <div class="offline-overlay" v-if="!isOnline">
        <CloudOffIcon />
        <span>offline</span>
      </div>
      <div class="offline-overlay" v-else-if="isWaitingForTrack">
        <span>No playback active</span>
        <button id="openspotifybtn" @click="openSpotify" aria-label="Open Spotify">
          Open Spotify
          <ExternalLinkIcon />
        </button>
      </div>
    </div>

    <input
      type="range"
      min="0"
      max="100"
      :value="progress"
      id="progress-bar"
      aria-label="Song Progress"
    />
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
  max-width: 40rem;
  margin: 0 auto;
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

#openspotifybtn {
  all: unset;
  background-color: var(--accent-color);
  color: var(--vt-c-black);
  font-size: 1.2rem;
  padding-left: 6%;
  padding-right: 6%;
  padding-top: 3%;
  padding-bottom: 3%;
  border-radius: 2rem;
}

#openspotifybtn svg {
  width: 1.2rem;
  height: 1.2rem;
  vertical-align: middle;
}

#openspotifybtn:focus {
  outline: revert;
}

#openspotifybtn:hover {
  background-color: var(--accent-color-light);
}

#progress-bar {
  margin-top: 1rem;
  margin-bottom: 1rem;
  accent-color: rgb(144, 255, 80);
  width: 70%;
  pointer-events: none;
}
</style>
