<script lang="ts" setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import ViewItem from './ViewItem.vue'
import type { View } from "@/types";

const props = defineProps<{ locationId: number }>()
const store = useStore()

const views = computed(() => {
  return store.getters.getViewsByLocationId(props.locationId)
})

async function addView() {
  const viewItem: View = {
    content: null,
    stops:  [],
    type: 'bus',
    enabled: false
  }

  const payload =  { type: 'view', item: viewItem }
  const response = await store.dispatch('addItem', payload)

  if (response.ok) {
    const viewResponse: View[] = await response.json()
    await addViewToLocation(viewResponse)
  }
}

async function addViewToLocation(viewResponse: View[]) {
  const action = await store.dispatch('checkUnsavedChanges')
  if (action === 'cancel') {
    return
  }

  const location = store.getters.getLocationById(props.locationId)
  const [ view ] = viewResponse

  location.views.push(view)

  const payload = { type: 'location', item: location }
  const response = await store.dispatch('addItem', payload)

  if (response.ok) {
    await store.dispatch('refreshLocations')
  }
}

</script>

<template>
  <div>
    <view-item v-for="view in views" :key="view.id" :viewProp="view" />
    <button @click="addView">Lisää näkymä</button>
  </div>
</template>

<style scoped>
button {
  border: 0;
  font-size: 1.1rem;
  background-color: #00bc7f;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}
</style>