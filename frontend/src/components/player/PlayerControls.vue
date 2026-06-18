<script setup lang="ts">
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
  isPlaying: boolean
  shuffleState: boolean
  repeatState: string
}>()

function togglePlayback() {
  if(props.isPlaying) {
    spotifyApi.spotifyPut("me/player/pause");
  } else {
    spotifyApi.spotifyPut("me/player/play");
  }
}

function toggleShuffle() {
  spotifyApi.spotifyPut(`me/player/shuffle?state=${!props.shuffleState}`);
}

function switchRepeatState() {
  switch(props.repeatState){
    case "off":
      spotifyApi.spotifyPut('me/player/repeat?state=context');
      break;
    case "context":
      spotifyApi.spotifyPut('me/player/repeat?state=track');
      break;
    default:
      spotifyApi.spotifyPut('me/player/repeat?state=off');
      break;
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
    <IconButton size="2.5rem" :active="shuffleState" @click="toggleShuffle">
      <ArrowsShuffleIcon/>
    </IconButton>

    <IconButton size="2.5rem" :active="props.repeatState === 'context' || props.repeatState === 'track'" @click="switchRepeatState">
      <RepeatIcon v-if="props.repeatState == 'context'"/>
      <RepeatOnceIcon v-else-if="props.repeatState == 'track'"/>
      <RepeatOffIcon v-else/>
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
