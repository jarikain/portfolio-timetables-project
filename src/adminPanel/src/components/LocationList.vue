<script lang="ts" setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import LocationItem from './LocationItem.vue'
import type { Location } from '@/types'

const store = useStore()
const locations = computed(() => store.getters.getLocations)

async function addLocation() {
  const action = await store.dispatch('checkUnsavedChanges')
  if (action === 'cancel') {
    return
  }

  const locationItem: Location = {
    city: "",
    name: "",
    update_interval: 5,
    views: [],
    theme: 'LAB'
  }
  const payload =  { type: 'location', item: locationItem }
  const response = await store.dispatch('addItem', payload)

  if (response.ok) {
    await store.dispatch('refreshLocations')
  }
}
</script>

<template>
  <div class="location-list">
    <div class="location-list-items">
      <location-item v-for="location in locations" :key="location.id" :locationProp="location" />
      <button @click="addLocation">Lisää Sijainti</button>
    </div>
  </div>
</template>

<style scoped>
.location-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}

.location-list-items {
  width: 800px;
}

button {
  border: 0;
  font-size: 1.2rem;
  background-color: #00c1e4;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  margin-bottom: 25px;
}
</style>