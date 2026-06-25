import { ref } from 'vue';
import { showToast, ToastType } from '@/components/ToastComponent.vue';

/**
 * Globaler Online-Status der Anwendung.
 * Wird initial aus navigator.onLine gesetzt und live aktualisiert.
 */
const isOnline = ref(navigator.onLine);

/**
 * Aktualisiert den Online-Status basierend auf dem Browser Event.
 *
 * Verhalten:
 * - setzt isOnline State
 * - zeigt Feedback Toast bei Statuswechsel
 */
function updateStatus() {
  isOnline.value = navigator.onLine;
  if (isOnline.value) {
    showToast('Du bist online', ToastType.Success);
  } else {
    showToast('Du bist offline', ToastType.Error);
  }
}

/**
 * Reagiert auf Netzwerkwechsel des Browsers.
 */
window.addEventListener('online', updateStatus);
window.addEventListener('offline', updateStatus);

/**
 * Composable für den globalen Online-Status.
 */
export function useOnlineStatus() {
  return { isOnline };
}
