import { createRouter, createWebHistory } from 'vue-router'
//import HomeView from '../views/HomeView.vue'
import DevView from '@/views/DevView.vue'
import PlayerView from '@/views/PlayerView.vue'
import PlaylistView from '@/views/PlaylistView.vue'
import HistoryView from '@/views/HistoryView.vue'
import { useAuthStore } from '@/stores/auth'
import LoginView from '@/views/LoginView.vue'

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
    },
    {
      path: '/history',
      name: 'History',
      component: HistoryView
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView
    }
  ],
})

router.beforeEach(async (to) => {
  if (to.path === '/login') return true
  const auth = useAuthStore()
  const loggedIn = await auth.fetchToken()
  if (!loggedIn) return '/login'
  return true
})

export default router
