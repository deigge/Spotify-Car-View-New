<script setup lang="ts">
import { useRouter } from 'vue-router';

const props = defineProps<{
  active?: boolean;
  size?: string;
  href?: string;
}>();

const router = useRouter();

function handleClick() {
  if (props.href) router.push(props.href);
}
</script>

<template>
  <button class="nav-btn" :class="{ active }" :style="{ 'font-size': size }" @click="handleClick">
    <slot />
  </button>
</template>

<style lang="css" scoped>
.nav-btn {
  background: none;
  border: none;
  color: #d3d3d3;
  font-size: 1.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.nav-btn.active {
  color: var(--accent-color);
}

.nav-btn:hover,
.nav-btn:focus-visible {
  color: white;
}

.nav-btn:active {
  color: rgb(204, 255, 174);
}
</style>
