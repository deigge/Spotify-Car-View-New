<script setup lang="ts">
  const trackTitle = 'Title';
  const trackArtist = 'Artist';
</script>

<template>
  <span id="trackTitle">{{ trackTitle }}</span>
  <span id="trackArtist">{{ trackArtist }}</span>
</template>

<style lang="css" scoped>
span {
  font-size: 1.5rem;
  display: block;
  text-align: center;
}

#trackTitle {
  margin-top: 2rem;
  font-size: 2rem;
}
</style>
