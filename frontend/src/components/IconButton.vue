<script setup lang="ts">
defineProps<{
  active?: boolean;
  size?: string;
  disabled?: boolean;
}>();
</script>

<template>
  <button
    class="icon-btn"
    :class="{ active }"
    :style="{ 'font-size': size }"
    :disabled="disabled"
    @click="($event.currentTarget as HTMLButtonElement).blur()"
  >
    <slot />
  </button>
</template>

<style lang="css" scoped>
.icon-btn {
  background: none;
  border: none;
  color: #d1d1d1;
  font-size: 1.8rem;
  cursor: pointer;
}

.icon-btn.active {
  color: rgb(144, 255, 80);
}

.icon-btn:not(.active):hover,
.icon-btn:not(.active):focus-visible,
.icon-btn:not(.active):focus {
  color: white;
}

.icon-btn:active {
  color: rgb(204, 255, 174);
  filter: brightness(0.8);
  transform: scale(0.96);
}

.icon-btn.active:hover,
.icon-btn.active:focus-visible,
.icon-btn.active:focus {
  color: rgb(212, 255, 187);
}

.icon-btn:disabled {
  color: #555555;
}
</style>
