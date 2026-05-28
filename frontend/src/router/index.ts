import { createRouter, createWebHistory } from 'vue-router'
//import HomeView from '../views/HomeView.vue'
import DevView from '@/views/DevView.vue'
import PlayerView from '@/views/PlayerView.vue'
import PlaylistView from '@/views/PlaylistView.vue'

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
    },
    {
      path: '/playlists',
      name: 'Playlists',
      component: PlaylistView
    }
  ],
})

export default router
