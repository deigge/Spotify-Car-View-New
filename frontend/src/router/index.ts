import { createRouter, createWebHistory } from 'vue-router';
import PlayerView from '@/views/PlayerView.vue';
import PlaylistView from '@/views/PlaylistView.vue';
import HistoryView from '@/views/HistoryView.vue';
import { useAuthStore } from '@/stores/auth';
import LoginView from '@/views/LoginView.vue';
import { useOnlineStatus } from '@/composables/UseOnlineStatus';

const { isOnline } = useOnlineStatus();

/**
 * Vue Router Instanz
 * Verwaltet alle App-Routen und Navigation
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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

/**
 * Globaler Route Guard:
 *
 * Regeln:
 * - Login-Seite ist immer erlaubt
 * - Offline:
 *   → prüft lokalen Login-Status (localStorage)
 * - Online:
 *   → validiert Token über Auth Store
 *   → leitet bei Fehler zu /login weiter
 */
router.beforeEach(async (to) => {
  // Login Route ist immer frei erreichbar
  if (to.path === '/login') return true;

  // Offline Modus: vertraue lokal gespeichertem Login Status
  if (!isOnline.value) {
    return localStorage.getItem('wasLoggedIn') === 'true' ? true : '/login';
  }

  const auth = useAuthStore();
  const result = await auth.fetchToken();

  // Token gültig → Zugriff erlaubt, sonst Redirect
  return result === 'ok' ? true : '/login';
});

export default router;
