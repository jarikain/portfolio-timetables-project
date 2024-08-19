<template>
  <div class="empty-notice-container">
    <tooltip :text="isEmptyOrNull(value) ? 'Aseta jokin arvo' : ''">
      <span v-if="isEmptyOrNull(value)" class="empty-notice-icon">⚠️</span>
    </tooltip>
  </div>
</template>

<script setup lang="ts">
import Tooltip from './Tooltip.vue';

const props = defineProps<{
  value: string | null | undefined;
}>();

function isEmptyOrNull(val: string | null | undefined): boolean {
  return val === '' || val === null || val === undefined;
}
</script>

<style scoped>
.empty-notice-container {
  display: inline-flex;
  align-items: center;
}

.empty-notice-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 1px;
  font-size: 1em;
  line-height: 1;
}
</style>