<script lang="ts" setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import type { Stop } from '@/types'
import Swal from 'sweetalert2'
import EmptyNotice from '@/components/EmptyNotice.vue'
import Tooltip from '@/components/Tooltip.vue'
import infoIcon from '@/assets/info-icon.png'

const props = defineProps<{
  stopProp: Stop
}>()
const store = useStore()
const stop = computed(() => store.getters.getStopById(props.stopProp.id))
const view = computed(() => store.getters.getViewByStopId(stop.value.id))

const tooltipText = computed(() => {
  return view.value.type === 'bus'
    ? "Linja-automatkoja tulisi olla yhden pysäkin näkymälle 1-8 (oletus: 6), kahden pysäkin näkymälle 1-6 (oletus: 4)"
    : "Junamatkoja tulisi olla alle 1-8. Oletusarvo: 6"
})

const generatedOptionsId = `id-${view.value.id}-${props.stopProp.id}`

const trainOptions = [
  {id: 'LH', name: 'Lahti'},
  {id: 'LR', name: 'Lappeenranta'},
]

const busOptions = [
  {id: '103579', name: 'Mukkulaan, LAB Lahti, Mukkulankatu'},
  {id: '103578', name: 'Matkakeskukselle, LAB Lahti, Mukkulankatu'},
  {id: '205390', name: 'LUT-yliopisto, LUT Lappeenranta'},
]

const optionsBasedOnType = computed(() => {
  if (view.value.type === 'bus') {
    return busOptions;
  } else if (view.value.type === 'train') {
    return trainOptions;
  }
  return [];
});

function updateStop(field: keyof Stop, value: any) {
  store.commit('updateStopField', {
    stopId: props.stopProp.id,
    field,
    value
  })
}

async function confirmDelete() {
  const action = await store.dispatch('checkUnsavedChanges')
  if (action === 'cancel') {
    return
  }

  Swal.fire({
    title: "Haluatko varmasti poistaa tämän pysäkin?",
    showCancelButton: true,
    confirmButtonText: "Poista",
    cancelButtonText: `Peruuta`
  }).then((result) => {
    if (result.isConfirmed) {
      deleteStop()
    }
  });
}

async function deleteStop() {
  const payload = {
    type: 'stop',
    id: stop.value.id
  }

  const response = await store.dispatch('deleteItem', payload)
  if (response.ok) {
    await store.dispatch('refreshLocations')
  }
}
</script>

<template>
  <div class="stop-card">
    <div class="stop-top-row">
      <h4>Pysäkki</h4>
      <button @click="confirmDelete">Poista</button>
    </div>
    <div class="stop-details">
      <div class="stop-row">
        <label>
          Otsikko <EmptyNotice :value="stop.title" />
          <input
            :value="stop.title"
            @input="updateStop('title', ($event.target as HTMLInputElement).value)"
            type="text"
          />
        </label>
        <label>
          Pysäkkitunnus <EmptyNotice :value="stop.stop_api_id" />
          <input
            :list="generatedOptionsId"
            :value="stop.stop_api_id"
            @input="updateStop('stop_api_id', ($event.target as HTMLInputElement).value)"
            type="text"
          />
          <datalist :id="generatedOptionsId">
            <option v-for="option in optionsBasedOnType" :key="option.id" :value="option.id">
              {{ option.name }}
            </option>
          </datalist>
        </label>
      </div>
      <div class="stop-row">
        <label>
          <tooltip :text="tooltipText">
            Matkoja<img :src="infoIcon" alt="info icon" class="info-icon"/>
          </tooltip>
          <input
            :value="stop.trips"
            @input="updateStop('trips', Number(($event.target as HTMLInputElement).value))"
            type="number"
            min="1"
          />
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stop-card {
  border: 5px solid #052fc2;
  background-color: #b4f5ff;
  border-radius: 14px;
  padding: 15px;
  margin-bottom: 10px;
  width: 100%;
  box-sizing: border-box;
}

.stop-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #052fc2;
  margin: -15px -15px 15px -15px;
  padding: 5px;
  border-radius: 8px 8px 0 0;
}

h4 {
  color: white;
  margin: 0;
  font-size: 1em;
}

.stop-top-row button {
  background-color: transparent;
  border: 2px solid white;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.stop-top-row button:hover {
  color: red;
  border-color: red;
}

.stop-details {
  display: flex;
  flex-direction: column;
}

.stop-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

label {
  display: flex;
  align-items: center;
  width: 48%;
}

input {
  margin-left: 10px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex-grow: 1;
}

.info-icon {
  height: 1rem;
}

</style>
