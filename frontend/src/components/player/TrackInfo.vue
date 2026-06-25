<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';

const props = defineProps<{
  title: string;
  artist: string;
}>();

/**
 * Referenz auf das DOM-Element des Titels.
 * Wird genutzt, um die Breite zu messen.
 */
const titleRef = ref<HTMLElement | null>(null);

/**
 * Gibt an, ob der Titel über den verfügbaren Platz hinausgeht.
 * Wird genutzt, um Scroll-Animation nur bei Bedarf zu aktivieren.
 */
const titleOverflowing = ref(false);

/**
 * Prüft nach dem Rendern, ob der Titel zu lang für den Container ist.
 * Wenn ja → aktiviert horizontales Scrollen.
 */
watch(
  () => props.title,
  () => {
    nextTick(() => {
      if (titleRef.value) {
        titleOverflowing.value = titleRef.value.scrollWidth > titleRef.value.clientWidth;
      }
    });
  },
  { immediate: true }
);
</script>

<template>
  <div class="track-info">
    <!-- Aktiviert Scroll-Animation nur wenn Text zu lang ist -->
    <span id="trackTitle" ref="titleRef" :class="{ scrolling: titleOverflowing }">
      {{ props.title }}
    </span>
    <span id="trackArtist">
      {{ props.artist }}
    </span>
  </div>
</template>

<style lang="css" scoped>
.track-info {
  width: 100%;
}

@keyframes scroll {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-150%);
  }
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
