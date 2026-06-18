<script lang="ts">
  import { ref, defineComponent } from 'vue';

  export enum ToastType {
    Info = 'info',
    Success = 'success',
    Error = 'error'
  }

  const message = ref('');
  const visible = ref(false);
  const type = ref<ToastType>(ToastType.Info);
  let timeoutId: number;

  export function showToast(text: string, toastType: ToastType = ToastType.Info, duration = 2000) {
    message.value = text;
    visible.value = true;
    type.value = toastType;
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      visible.value = false;
    }, duration);
  }

  export default defineComponent({
    setup() {
      return { message, visible, type };
    }
  });
</script>

<template>
  <Transition name="fade">
    <div v-if="visible" class="toast" :class="type">{{ message }}</div>
  </Transition>
</template>

<style scoped>
  .toast {
    position: fixed;
    bottom: 6rem;
    left: 50%;
    transform: translateX(-50%);
    background: #222;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    z-index: 1000;
  }

  .toast.info {
    background: #222;
  }
  .toast.success {
    background: rgb(34, 139, 60);
  }
  .toast.error {
    background: rgb(180, 40, 40);
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s;
  }

  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
</style>
