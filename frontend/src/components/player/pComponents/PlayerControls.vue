<script setup lang="ts">
  import IconButton from '@/components/IconButton.vue';
import ArrowsShuffleIcon from '@/components/icons/arrowsShuffleIcon.vue';
import PlayerPlayIcon from '@/components/icons/playerPlayIcon.vue';
import PlayerSkipBackIcon from '@/components/icons/playerSkipBackIcon.vue';
import PlayerSkipForwardIcon from '@/components/icons/playerSkipForwardIcon.vue';
import RepeatIcon from '@/components/icons/repeatIcon.vue';
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
    <IconButton size="2.5rem">
      <PlayerSkipBackIcon/>
    </IconButton>

    <IconButton icon="player-play" size="4rem">
      <PlayerPlayIcon/>
    </IconButton>

    <IconButton size="2.5rem">
      <PlayerSkipForwardIcon/>
    </IconButton>
  </div>
</template>

<style lang="css" scoped>

.controls {
  width: 80%;
  display: flex;
  justify-content: space-around;
}

#mainControls {
  margin-top: 2.5rem;
}
</style>
