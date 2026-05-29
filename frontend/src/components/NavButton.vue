<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps<{
  active?: boolean
  size?: string
  href?: string
}>()


const router = useRouter()

function handleClick() {
  if (props.href) router.push(props.href)
}
</script>

<template>
  <button class="icon-btn" :class="{ active }" :style="{ 'font-size': size }" @click="handleClick">
    <slot />
  </button>
</template>

<style lang="css" scoped>
.icon-btn {
  background: none;
  border: none;
  color: #d3d3d3;
  font-size: 1.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.icon-btn.active {
  color: var(--accent-color);
}
</style>
