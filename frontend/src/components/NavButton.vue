<script setup lang="ts">
import { useRouter } from 'vue-router';
import IconButton from './IconButton.vue';

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
  <IconButton
    class="nav-btn"
    :class="{ active }"
    :style="{ 'font-size': size }"
    @click="handleClick"
  >
    <slot />
  </IconButton>
</template>

<style lang="css" scoped>
.nav-btn {
  cursor: pointer;
  display: flex;
  align-items: center;
}
</style>
