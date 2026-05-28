<script setup lang="ts">
  import { ref, onMounted } from 'vue'

  const trackTitle = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam';
  const trackArtist = 'Artist';

const titleRef = ref<HTMLElement | null>(null)
const titleOverflowing = ref(false)


  onMounted(() => {
  if (titleRef.value)
    titleOverflowing.value = titleRef.value.scrollWidth > titleRef.value.clientWidth
  })
</script>

<template>
  <div class="track-info">
    <span id="trackTitle" ref="titleRef" :class="{ scrolling: titleOverflowing }">
      {{ trackTitle }}
    </span>
    <span id="trackArtist">
      {{ trackArtist }}
    </span>
  </div>
</template>

<style lang="css" scoped>
.track-info {
  width: 100%;
}

@keyframes scroll {
  0%   { transform: translateX(100%); }
  100% { transform: translateX(-150%); }
}

.scrolling {
  animation: scroll 8s linear infinite;
}

span {
  width: 100%;
  font-size: 1.5rem;
  display: block;
  text-align: center;
  white-space: nowrap;
  max-width: 100%;
}

#trackTitle {
  margin-top: 1.5rem;
  font-size: 2rem;
}

#trackArtist {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
