<script setup lang="ts">
import { RouterView } from 'vue-router'
import BottomNavBar from '@/components/BottomNavBar.vue'
/*  import HelloWorld from './components/HelloWorld.vue' */
</script>

<template>

<!--   <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>
-->
  <div class="app">
    <router-view style="overflow-y: auto; overflow-x: hidden; width: 100%; height: 100%;"/>
    <BottomNavBar />
  </div>
</template>

<style scoped>
.app {
  display: grid;
  grid-template-rows: 1fr auto;
  overflow: hidden;
  height: 100dvh;
  width: 100%;
}
</style>
