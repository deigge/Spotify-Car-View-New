<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router';
import BottomNavBar from '@/components/BottomNavBar.vue';
import Toast from '@/components/ToastComponent.vue';

const route = useRoute();
</script>

<template>
  <div class="app">
    <router-view />
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
