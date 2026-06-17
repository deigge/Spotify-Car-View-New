<script setup lang="ts">
  import IconButton from '@/components/IconButton.vue';
import ArrowsShuffleIcon from '@/components/icons/arrowsShuffleIcon.vue';
import PlayerPlayIcon from '@/components/icons/playerPlayIcon.vue';
import PlayerPauseIcon from '../icons/playerPauseIcon.vue';
import PlayerSkipBackIcon from '@/components/icons/playerSkipBackIcon.vue';
import PlayerSkipForwardIcon from '@/components/icons/playerSkipForwardIcon.vue';
import RepeatIcon from '@/components/icons/repeatIcon.vue';
import { useAuthStore } from '@/stores/auth';

const spotifyApi = useAuthStore();

const props = defineProps<{
  isPlaying?: boolean
}>()

function togglePlayback() {
  if(props.isPlaying) {
    spotifyApi.spotifyPut("me/player/pause");
  } else {
    spotifyApi.spotifyPut("me/player/play");
  }
}

function nextSong() {
  spotifyApi.spotifyPost("me/player/next");
}

function previousSong() {
  spotifyApi.spotifyPost("me/player/previous");
}
</script>

<template>
  <div class="controls">
    <IconButton size="2.5rem">
      <ArrowsShuffleIcon/>
    </IconButton>

    <IconButton size="2.5rem">
      <RepeatIcon/>
    </IconButton>
  </div>

  <div class="controls" id="mainControls">
    <IconButton size="3.5rem" @click="previousSong">
      <PlayerSkipBackIcon/>
    </IconButton>

    <IconButton icon="player-play" size="5rem" @click="togglePlayback">
      <PlayerPauseIcon v-if="props.isPlaying"/>
      <PlayerPlayIcon v-else/>
    </IconButton>

    <IconButton size="3.5rem" @click="nextSong">
      <PlayerSkipForwardIcon/>
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
