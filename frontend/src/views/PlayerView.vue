<script setup lang="ts">
    import { ref, onMounted, onBeforeUnmount } from 'vue';

    import TrackInfo from '@/components/player/TrackInfo.vue';
    import coverPlaceholder from '@/assets/img/album_cover_placeholder.png';
    import PlayerControls from '@/components/player/PlayerControls.vue';
    import type { SpotifyPlayer } from '@/types/spotify';

    import { useAuthStore } from '@/stores/auth';

    const spotifyApi = useAuthStore();

    const trackTitle = ref('');
    const trackArtist = ref('');
    const playlistName = ref('');
    const albumCover = ref(coverPlaceholder);
    const progress = ref(0);

    let interval: number;
    let syncInterval: number;
    let startTime = 0;
    let startProgress = 0;
    let currentTrackId = '';

    onMounted(async () => {
      let currentTrack = await spotifyApi.spotifyFetch(
        '/v1/me/player'
      );

      currentTrackId = currentTrack.item.id;

      updateTrackDetails(currentTrack);

      startProgress = currentTrack.progress_ms;
      const duration = currentTrack.item.duration_ms;

      startTime = Date.now();

      progress.value = (startProgress / duration) * 100;

      interval = window.setInterval(() => {
        if (!currentTrack?.is_playing) return;

        const elapsed = Date.now() - startTime;
        const newProgress = startProgress + elapsed;

        const duration = currentTrack.item.duration_ms;

        progress.value = (newProgress / duration) * 100;
      }, 500);


      syncInterval = window.setInterval(async () => {
        const updated = await spotifyApi.spotifyFetch('/v1/me/player');

        if (!updated?.item) return;

        // 🔥 TRACK CHANGE DETECTED
        if (updated.item.id !== currentTrackId) {
          currentTrackId = updated.item.id;

          currentTrack = updated;

          await updateTrackDetails(updated);

          startProgress = updated.progress_ms;
          startTime = Date.now();

          const duration = updated.item.duration_ms;
          progress.value = (startProgress / duration) * 100;

          return;
        }

        // 🔄 SAME TRACK → SYNC CORRECTION
        currentTrack = updated;

        startProgress = updated.progress_ms;
        startTime = Date.now();

      }, 4000);
    });

    onBeforeUnmount(() => {
      clearInterval(interval);
      clearInterval(syncInterval);
    });

    async function updateTrackDetails(currentTrack: SpotifyPlayer){

      trackTitle.value = currentTrack.item.name;
      trackArtist.value = currentTrack.item.artists?.[0]?.name ?? 'Unknown Artist';
      albumCover.value = currentTrack.item.album?.images?.[0]?.url ?? coverPlaceholder;

      switch (currentTrack.context?.type) {
        case 'playlist':
          const id = currentTrack.context.uri.split(':')[2];
          const playlist = await spotifyApi.spotifyFetch(`/v1/playlists/${id}`);
          playlistName.value = playlist.name;
          break;

        case 'album':
          playlistName.value = currentTrack.item.album.name;
          break;

        case 'artist':
          playlistName.value = trackArtist.value;
          break;

        default:
          playlistName.value = '';
      }
    }
</script>

<template>
  <div class="player-view">
    <span class="playlist-name safe-top">{{ playlistName }}</span>
    <TrackInfo :title="trackTitle" :artist="trackArtist"/>

    <img id="albumCover" :src="albumCover" />
    <input type="range" min="0" max="100" :value="progress" id="progress-bar" />
    <PlayerControls />
  </div>
</template>

<style lang="css" scoped>
.player-view {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
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

#albumCover {
  margin-top: 1rem;
  width: 70%;
  border-radius: 2rem;
}

#progress-bar {
  margin-top: 1rem;
  margin-bottom: 1rem;
  accent-color: rgb(144, 255, 80);
  width: 70%;
  pointer-events: none;
}
</style>
