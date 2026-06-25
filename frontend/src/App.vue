<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router';
import BottomNavBar from '@/components/BottomNavBar.vue';
import Toast from '@/components/ToastComponent.vue';

import { onMounted, onUnmounted } from 'vue';

const route = useRoute();

const router = useRouter();

function handleKeydown(e: KeyboardEvent) {
  if (e.key === '1') router.push('/playlists');
  if (e.key === '2') router.push('/');
  if (e.key === '3') router.push('/history');
}

onMounted(() => window.addEventListener('keydown', handleKeydown));
onUnmounted(() => window.removeEventListener('keydown', handleKeydown));
</script>

<template>
  <div class="app">
    <main>
      <router-view />
    </main>

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
