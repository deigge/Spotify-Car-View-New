<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router';
import BottomNavBar from '@/components/BottomNavBar.vue';
import Toast from '@/components/ToastComponent.vue';

import { onMounted, onUnmounted } from 'vue';

const route = useRoute();

const router = useRouter();

/**
 * Keyboard Shortcuts für Navigation:
 * - 1 → Playlists
 * - 2 → Player (Home)
 * - 3 → History
 */
function handleKeydown(e: KeyboardEvent) {
  if (e.target instanceof HTMLInputElement) return;

  switch (e.key) {
    case '1':
      router.push('/playlists');
      break;
    case '2':
      router.push('/');
      break;
    case '3':
      router.push('/history');
      break;
  }
}

/**
 * Registriert globale Keyboard Listener beim Mounten
 * und entfernt sie wieder beim Unmount (Cleanup).
 */
onMounted(() => window.addEventListener('keydown', handleKeydown));
onUnmounted(() => window.removeEventListener('keydown', handleKeydown));
</script>

<template>
  <div class="app">
    <main>
      <router-view />
    </main>

    <!-- Bottom Navigation wird nur angezeigt, wenn man NICHT auf der Login-Seite ist -->
    <BottomNavBar v-if="route.path !== '/login'" />
    <Toast />
  </div>
</template>

<style scoped>
.app {
  height: 100dvh;
  width: 100%;
}
</style>
