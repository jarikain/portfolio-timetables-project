<template>
  <div class="tooltip-container" :data-tooltip="text" :class="{ 'has-tooltip': text }">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text: string
}>();
</script>

<style scoped>
.tooltip-container {
  position: relative;
  display: inline-block;
}

.tooltip-container.has-tooltip::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  white-space: nowrap;
  font-size: 0.8rem;
  pointer-events: none;
  margin-bottom: 5px;
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip-container.has-tooltip:hover::after {
  opacity: 1;
}
</style>