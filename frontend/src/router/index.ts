import { createRouter, createWebHistory } from 'vue-router'
//import HomeView from '../views/HomeView.vue'
import DevView from '@/views/DevView.vue'
import PlayerView from '@/components/player/PlayerView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dev',
      name: 'dev',
      component: DevView
    },
    {
      path: '/',
      name: 'home',
      component: PlayerView
    }
  ],
})

export default router
