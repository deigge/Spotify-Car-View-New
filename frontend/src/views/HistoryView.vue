<script setup lang="ts">
import { ref, onMounted } from 'vue';
import TrackCard from '@/components/TrackCard.vue';
import type { PlayedSong } from '../../../shared/types/playedSong';
import { computed } from 'vue';
import { useOnlineStatus } from '@/composables/UseOnlineStatus';

const { isOnline } = useOnlineStatus();

const tracks = ref<PlayedSong[]>([]);

onMounted(async () => {
  const res = await fetch('/api/history');
  tracks.value = await res.json();
});

const groupedTracks = computed(() => {
  const groups: Record<string, PlayedSong[]> = {};

  for (const track of tracks.value) {
    const date = new Date(track.playedAt).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    if (!groups[date]) groups[date] = [];
    groups[date].push(track);
  }

  return groups;
});
</script>

<template>
  <div id="history-view">
    <h1 class="safe-top">History</h1>
    <div v-for="(songs, date) in groupedTracks" :key="date">
      <div id="date-header">
        <hr />
        <h2>{{ date }}</h2>
        <hr />
      </div>

      <TrackCard v-for="track in songs" :key="track._id" :song="track" :disabled="!isOnline" />
    </div>
  </div>
</template>

<style lang="css" scoped>
#history-view {
  height: 100%;
  overflow-y: auto;
}

h1 {
  margin-top: 1rem;
  font-size: 1.2rem;
  display: block;
  text-align: center;
}

#date-header {
  margin-left: 1rem;
  margin-right: 1rem;
  margin-top: 2rem;
  font-size: 1.1rem;
}
</style>
