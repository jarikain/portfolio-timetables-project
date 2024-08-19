<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import DeviceItem from './DeviceItem.vue'
import type { Device } from '@/types'

const store = useStore()
const devices = computed(() => store.getters.getDevices)

async function addDevice() {
  const action = await store.dispatch('checkUnsavedChanges')
  if (action === 'cancel') {
    return
  }

  const item: Device = {ip: "", location: null}
  const type = 'device'
  const response = await store.dispatch('addItem', {item, type})
  if (response.ok) {
    await store.dispatch('refreshDevices')
  }
}
</script>

<template>
  <div class="location-list-container">
    <div class="location-list-items">
      <device-item v-for="device in devices" :key="device.id" :deviceProp="device" />
      <button @click="addDevice">Lisää laite</button>
    </div>
  </div>
</template>

<style scoped>
.location-list-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}

.location-list-items {
  width: 700px;
}

button {
  border: 0;
  font-size: 1.1rem;
  background-color: #00c1e4;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}
</style>