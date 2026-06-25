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

const spotifyApi = useAuthStore();

const props = defineProps<{
  isPlaying: boolean;
  shuffleState: boolean;
  repeatState: string;
  disabled?: boolean;
}>();

const localShuffleState = ref(props.shuffleState);
const localRepeatState = ref(props.repeatState);
const localIsPlaying = ref(props.isPlaying);

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

async function togglePlayback() {
  let request;
  if (localIsPlaying.value) {
    request = await spotifyApi.spotifyPut('me/player/pause');
  } else {
    request = await spotifyApi.spotifyPut('me/player/play');
  }
  if (request.ok) localIsPlaying.value = !localIsPlaying.value;
}

async function toggleShuffle() {
  const request = await spotifyApi.spotifyPut(
    `me/player/shuffle?state=${!localShuffleState.value}`
  );
  if (request.ok) {
    localShuffleState.value = !localShuffleState.value;
  }
}

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

function nextSong() {
  spotifyApi.spotifyPost('me/player/next');
}

function previousSong() {
  spotifyApi.spotifyPost('me/player/previous');
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
      aria-label="Previous song"
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

    <IconButton size="3.5rem" :disabled="disabled" @click="nextSong" aria-label="Next song">
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
