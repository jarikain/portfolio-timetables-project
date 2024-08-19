<script lang="ts" setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import StopItem from './StopItem.vue'
import type { Stop, View } from '@/types'
import Tooltip from '@/components/Tooltip.vue'
import Notice from '@/components/Notice.vue'

const props = defineProps<{ viewId: number }>()
const store = useStore()
const stops = computed(() => {
  return store.getters.getStopsByViewId(props.viewId)
})
const view = computed(() => store.getters.getViewById(Number(props.viewId)))
const isStopAddDisabled = computed(() => {
  return (view.value.type === 'bus' && view.value.stops.length >= 2) ||
    (view.value.type === 'train' && view.value.stops.length >= 1);
})

const viewHasNoStops = computed(() => {
  return view.value.stops.length < 1
})

async function addStop() {
  const action = await store.dispatch('checkUnsavedChanges')
  if (action === 'cancel') {
    return
  }

  const item: View = store.getters.getViewById(props.viewId)

  const stopItem: Stop = {
    stop_api_id: "",
    title: "",
    stop_name: "",
    trips: 1
  }
  item.stops.push(stopItem)

  const payload = { type: 'view', item }
  const response = await store.dispatch('addItem', payload)
  if (response.ok) {
    await store.dispatch('refreshLocations')
  }
}

const tooltipText = computed(() => {
  if (view.value.type === 'bus' && view.value.stops.length >= 2) {
    return "Bussinäkymillä voi olla enintään kaksi pysäkkiä"
  } else if (view.value.type === 'train' && view.value.stops.length >= 1) {
    return "Junanäkymillä voi olla enintään yksi pysäkki"
  }
  return ""
})

</script>

<template>
  <div>
    <stop-item v-for="stop in stops" :key="stop.id" :stopProp="stop" />
    <tooltip :text="tooltipText">
      <button
        @click="addStop"
        :disabled="isStopAddDisabled"
        :data-tooltip="tooltipText"
        class="tooltip-button"
      >
        Lisää pysäkki
      </button>
    </tooltip>
    <Notice :condition-boolean="viewHasNoStops" text="Ei yhtään pysäkkiä. Lisää pysäkkejä"/>
  </div>
</template>

<style scoped>
button {
  border: 0;
  font-size: 1rem;
  background-color: #052fc1;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  position: relative;
}
button:disabled {
  background-color: #8d8d8d;
}
</style>