<template>
  <div class="notice-container">
    <tooltip :text="conditionBoolean ? text : ''">
      <span v-if="conditionBoolean" class="notice-icon">⚠️</span>
    </tooltip>
  </div>
</template>

<script setup lang="ts">
import Tooltip from './Tooltip.vue';

defineProps<{
  conditionBoolean: boolean;
  text: string;
}>();
</script>

<style scoped>
.notice-container {
  display: inline-flex;
  align-items: center;
}

.notice-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 4px; /* Adjust spacing between icon and text */
  font-size: 1em; /* Adjust size to match text */
  line-height: 1;
}
</style>