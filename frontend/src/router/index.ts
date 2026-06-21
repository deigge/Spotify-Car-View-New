import { createRouter, createWebHistory } from 'vue-router';
//import HomeView from '../views/HomeView.vue'
import DevView from '@/views/DevView.vue';
import PlayerView from '@/views/PlayerView.vue';
import PlaylistView from '@/views/PlaylistView.vue';
import HistoryView from '@/views/HistoryView.vue';
import { useAuthStore } from '@/stores/auth';
import LoginView from '@/views/LoginView.vue';
import { useOnlineStatus } from '@/composables/UseOnlineStatus';

const { isOnline } = useOnlineStatus();

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dev',
      name: 'dev',
      component: DevView,
    },
    {
      path: '/',
      name: 'home',
      component: PlayerView,
    },
    {
      path: '/playlists',
      name: 'Playlists',
      component: PlaylistView,
    },
    {
      path: '/history',
      name: 'History',
      component: HistoryView,
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
    },
  ],
});

router.beforeEach(async (to) => {
  if (to.path === '/login') return true;

  if (!isOnline.value) {
    // Offline: vertraue dem letzten bekannten Login-Status
    return localStorage.getItem('wasLoggedIn') === 'true' ? true : '/login';
  }

  const auth = useAuthStore();
  const result = await auth.fetchToken();
  return result === 'ok' ? true : '/login';
});

export default router;
