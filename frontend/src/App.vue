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
    <router-view />   <!-- bekommt den ganzen Platz -->
    <BottomNavBar />     <!-- nimmt nur so viel wie sie braucht -->
  </div>
</template>

<style scoped>
/* App.vue */
.app {
  display: grid;
  grid-template-rows: 1fr auto;
  height: 100vh;
}
</style>
