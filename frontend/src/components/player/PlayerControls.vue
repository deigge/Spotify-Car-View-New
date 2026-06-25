<script setup lang="ts">
import { ref, watch } from 'vue';
import IconButton from '@/components/IconButton.vue';
import ArrowsShuffleIcon from '@/components/icons/arrowsShuffleIcon.vue';
import PlayerPlayIcon from '@/components/icons/playerPlayIcon.vue';
import PlayerPauseIcon from '../icons/playerPauseIcon.vue';
import PlayerSkipBackIcon from '@/components/icons/playerSkipBackIcon.vue';
import PlayerSkipForwardIcon from '@/components/icons/playerSkipForwardIcon.vue';
import RepeatIcon from '@/components/icons/repeatIcon.vue';
import { useAuthStore } from '@/stores/auth';
import RepeatOnceIcon from '../icons/repeatOnceIcon.vue';
import RepeatOffIcon from '../icons/repeatOffIcon.vue';
import { showToast, ToastType } from '../ToastComponent.vue';

const spotifyApi = useAuthStore();

const props = defineProps<{
  isPlaying: boolean;
  shuffleState: boolean;
  repeatState: string;
  disabled?: boolean;
}>();

/**
 * Lokale Kopien der Player States.
 * Werden optimistisch im UI aktualisiert und mit Props synchronisiert.
 */
const localShuffleState = ref(props.shuffleState);
const localRepeatState = ref(props.repeatState);
const localIsPlaying = ref(props.isPlaying);

/**
 * Synchronisiert externe Player Props mit lokalen UI States.
 * Wichtig, falls sich der Player State außerhalb dieser Komponente ändert.
 */
watch(
  () => props.isPlaying,
  (val) => (localIsPlaying.value = val)
);
watch(
  () => props.shuffleState,
  (val) => (localShuffleState.value = val)
);
watch(
  () => props.repeatState,
  (val) => (localRepeatState.value = val)
);

/**
 * Play/Pause Toggle für Spotify Playback.
 * Optimistic Update nur bei erfolgreicher API Response.
 */
async function togglePlayback() {
  let request;
  if (localIsPlaying.value) {
    request = await spotifyApi.spotifyPut('me/player/pause');
  } else {
    request = await spotifyApi.spotifyPut('me/player/play');
  }
  if (request.ok) localIsPlaying.value = !localIsPlaying.value;
}

/**
 * Aktiviert oder deaktiviert Shuffle Mode.
 */
async function toggleShuffle() {
  const request = await spotifyApi.spotifyPut(
    `me/player/shuffle?state=${!localShuffleState.value}`
  );
  if (request.ok) {
    localShuffleState.value = !localShuffleState.value;
  }
}

/**
 * Wechselt den Repeat Modus zyklisch:
 * off → context → track → off
 */
async function switchRepeatState() {
  let request;
  let newState;
  switch (localRepeatState.value) {
    case 'off':
      newState = 'context';
      break;
    case 'context':
      newState = 'track';
      break;
    default:
      newState = 'off';
      break;
  }
  request = await spotifyApi.spotifyPut(`me/player/repeat?state=${newState}`);
  if (request.ok) {
    localRepeatState.value = newState;
  }
}

/**
 * Springt zum nächsten Song im Playback Queue.
 */
async function nextSong() {
  const request = await spotifyApi.spotifyPost('me/player/next');
  if (!request.ok) {
    showToast('Failed to skip track', ToastType.Error);
  }
}

/**
 * Springt zum vorherigen Song im Playback Queue.
 */
async function previousSong() {
  const request = await spotifyApi.spotifyPost('me/player/previous');
  if (!request.ok) {
    showToast('Failed to skip track', ToastType.Error);
  }
}
</script>

<template>
  <div class="controls">
    <IconButton
      size="2.5rem"
      :active="localShuffleState"
      :disabled="props.disabled"
      @click="toggleShuffle"
      :aria-label="localShuffleState ? 'Shuffle on' : 'Shuffle off'"
    >
      <ArrowsShuffleIcon />
    </IconButton>

    <IconButton
      size="2.5rem"
      :active="localRepeatState === 'context' || localRepeatState === 'track'"
      :disabled="disabled"
      @click="switchRepeatState"
      :aria-label="
        localRepeatState === 'off'
          ? 'Repeat off'
          : localRepeatState === 'context'
            ? 'Repeat all'
            : 'Repeat one'
      "
    >
      <RepeatIcon v-if="localRepeatState == 'context'" />
      <RepeatOnceIcon v-else-if="localRepeatState == 'track'" />
      <RepeatOffIcon v-else />
    </IconButton>
  </div>

  <div class="controls" id="mainControls">
    <IconButton
      size="3.5rem"
      :disabled="props.disabled"
      @click="previousSong"
      aria-label="Previous Song"
    >
      <PlayerSkipBackIcon />
    </IconButton>

    <IconButton
      icon="player-play"
      size="5rem"
      :disabled="props.disabled"
      @click="togglePlayback"
      :aria-label="localIsPlaying ? 'Pause' : 'Play'"
    >
      <PlayerPauseIcon v-if="localIsPlaying" />
      <PlayerPlayIcon v-else />
    </IconButton>

    <IconButton size="3.5rem" :disabled="disabled" @click="nextSong" aria-label="Next Song">
      <PlayerSkipForwardIcon />
    </IconButton>
  </div>
</template>

<style lang="css" scoped>
.controls {
  width: 80%;
  display: flex;
  justify-content: space-around;
  max-width: 400px;
  align-self: center;
}

#mainControls {
  margin-top: 0.5rem;
}
</style>
