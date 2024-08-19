<template>
  <div>
    <device-list />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useStore } from 'vuex'
import DeviceList from '@/components/DeviceList.vue'

const store = useStore()

onMounted(() => {
  store.dispatch('fetchDevices')
})
</script>

<style scoped>
</style>