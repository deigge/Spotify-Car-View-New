<script setup lang="ts">

  defineProps<{
    active?: boolean
    size?: string
    disabled?: boolean
  }>()

</script>

<template>
  <button class="icon-btn" :class="{ active }" :style="{ 'font-size': size }" :disabled="disabled">
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

.icon-btn:hover, .icon-btn:focus-visible {
  color: white;
}

.icon-btn:active {
  color: rgb(204, 255, 174);
}

.icon-btn:disabled {
  color: #555555;
}
</style>
