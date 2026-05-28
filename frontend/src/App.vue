<script setup lang="ts">
import { RouterView } from 'vue-router'
import BottomNavBar from '@/components/BottomNavBar.vue'
</script>

<template>
  <div class="app">
    <router-view style="overflow-y: auto; overflow-x: hidden; width: 100%; height: 100%;"/>
    <BottomNavBar />
  </div>
</template>

<style scoped>
.app {
  overflow: hidden;
  height: 100dvh;
  width: 100%;
}
</style>
