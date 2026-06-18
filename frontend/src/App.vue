<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router';
import BottomNavBar from '@/components/BottomNavBar.vue';
import Toast from '@/components/ToastComponent.vue';

const route = useRoute();
</script>

<template>
  <div class="app">
    <router-view style="overflow-y: auto; overflow-x: hidden; width: 100%; height: 100%" />
    <BottomNavBar v-if="route.path !== '/login'" />
    <Toast />
  </div>
</template>

<style scoped>
.app {
  overflow: hidden;
  height: 100dvh;
  width: 100%;
}
</style>
