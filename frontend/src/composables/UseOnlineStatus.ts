import { ref } from 'vue';
import { showToast, ToastType } from '@/components/ToastComponent.vue';

const isOnline = ref(navigator.onLine);

function updateStatus() {
  isOnline.value = navigator.onLine;
  if(isOnline.value){
    showToast("Du bist online", ToastType.Success);
  } else {
    showToast("Du bist offline", ToastType.Error);
  }
}

window.addEventListener('online', updateStatus);
window.addEventListener('offline', updateStatus);

export function useOnlineStatus() {
  return { isOnline };
}
