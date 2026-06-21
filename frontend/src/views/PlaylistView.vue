<script setup lang="ts">
import PlaylistCard from '@/components/PlaylistCard.vue';
import { ref, onMounted } from 'vue';

import { useAuthStore } from '@/stores/auth';
import type {
  SpotifyPlaylist,
  SpotifyPlaylistsResponse,
} from '../../../shared/types/spotifyPlaylist';
import { useOnlineStatus } from '@/composables/UseOnlineStatus';

const { isOnline } = useOnlineStatus();

const spotifyApi = useAuthStore();
const playlists = ref<SpotifyPlaylist[]>([]);

onMounted(async () => {
  onMounted(async () => {
    try {
      const data = (await spotifyApi.spotifyFetch('me/playlists')) as SpotifyPlaylistsResponse;

      if (data?.items) {
        playlists.value = data.items;
      }
    } catch (e) {
      console.log('offline fallback active');
    }
  });
});
</script>

<template>
  <div class="playlist-view">
    <h1 class="safe-top">My playlists</h1>

    <div class="playlists-grid">
      <PlaylistCard
        v-for="playlist in playlists"
        :key="playlist.id"
        :coverUrl="playlist.images[1]?.url ?? playlist.images[0]?.url"
        :name="playlist.name"
        :playlistURI="playlist.uri"
        :disabled="!isOnline"
      />
    </div>
  </div>
</template>

<style lang="css" scoped>
.playlist-view {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
}

.playlists-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
}

h1 {
  margin-top: 1rem;
  font-size: 1.2rem;
  display: block;
  text-align: center;
}
</style>
