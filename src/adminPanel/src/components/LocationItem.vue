<script lang="ts" setup>
import { useStore } from 'vuex'
import type { Location, Stop, View } from '@/types'
import ViewList from './ViewList.vue'
import { computed } from 'vue'
import Swal from 'sweetalert2'
import Tooltip from '@/components/Tooltip.vue'
import EmptyNotice from '@/components/EmptyNotice.vue'
import infoIcon from '@/assets/info-icon.png'

const props = defineProps<{ locationProp: Location }>()
const store = useStore()
const location = computed(() => {
  return store.getters.getLocationById(props.locationProp.id)
})

const isCollapsed = computed({
  get: () => store.getters.getLocationCollapseState(props.locationProp.id),
  set: (value) => store.commit('setLocationCollapseState', { locationId: props.locationProp.id, isCollapsed: value })
})

const toggleCollapsed = () => {
  isCollapsed.value = !isCollapsed.value
}

const updateLocation = (field: keyof Location, value: any) => {
  store.commit('updateLocationField', {
    id: props.locationProp.id,
    field,
    value
  })
}

async function deleteLocation() {
  const views = location.value.views
  await deleteViews(views)

  const payload = {
    type: 'location',
    id: location.value.id
  }

  await store.dispatch('deleteItem', payload)
  await store.dispatch('refreshLocations')
}

async function deleteViews(views: View[]) {
  for (const view of views) {
    await deleteStops(view.stops)

    const payload = {
      type: 'view',
      id: view.id,
    }

    await store.dispatch('deleteItem', payload)
  }
}

async function deleteStops(stops: Stop[]) {
  for (const stop of stops) {
    const payload = {
      type: 'stop',
      id: stop.id
    }

    await store.dispatch('deleteItem', payload)
  }
}

async function confirmDelete() {
  const action = await store.dispatch('checkUnsavedChanges')
  if (action === 'cancel') {
    return
  }

  Swal.fire({
    title: "Haluatko varmasti poistaa tämän sijainnin ja siihen liitetyt näkymät ja pysäkit?",
    showCancelButton: true,
    confirmButtonText: "Poista",
    cancelButtonText: `Peruuta`
  }).then((result) => {
    if (result.isConfirmed) {
      deleteLocation()
    }
  });
}
</script>

<template>
  <div class="location-card">
    <div class="location-top-row">
      <h2>Sijainti</h2>
      <button @click="confirmDelete" class="delete-btn">Poista</button>
    </div>
    <div class="location-details">
      <div class="location-row">
        <label>
          Nimi <EmptyNotice :value="location.name" />
          <input
            :value="location.name"
            @input="updateLocation('name', ($event.target as HTMLInputElement).value)"
            type="text"
          />
        </label>
        <label class="view-change-label">
          Näkymien vaihtumisaika (sek)
          <input
            :value="location.update_interval"
            @input="
              updateLocation('update_interval', Number(($event.target as HTMLInputElement).value))
            "
            type="number"
            min="1"
          />
        </label>
      </div>
    </div>
    <div class="location-row">
        <label class="stop--label-city">
          <tooltip text='"Kaupunki" määrittää, minkä kaupungin linja-aikatauluja ja säätietoja haetaan.'>
            Kaupunki <img :src="infoIcon" alt="info icon" class="info-icon"/>
          </tooltip>
          <input
            list="opt"
            :value="location.city"
            @input="updateLocation('city', ($event.target as HTMLInputElement).value)"
            type="text"
          /><EmptyNotice :value="location.city" />
          <datalist id="opt">
            <option value="Lahti">Lahti</option>
            <option value="Lappeenranta">Lappeenranta</option>
          </datalist>
        </label>
      <label class="stop--label-theme">
        Teema:
        <select
          :value="location.theme"
          @change="updateLocation('theme', ($event.target as HTMLSelectElement).value)"
        >
          <option value="LAB">LAB</option>
          <option value="LUT">LUT</option>
        </select>
      </label>
    </div>

    <div class="toggle-btn-container">
      <button @click="toggleCollapsed" class="toggle-btn">
        {{ isCollapsed ? 'Näytä lisätiedot' : 'Piilota lisätiedot' }}
      </button>
    </div>
    <div v-show="!isCollapsed">
      <view-list :location-id="location.id" />
    </div>
  </div>

</template>

<style scoped>
.stop--label-city {
  margin-bottom: 15px;
}

.stop--label-theme {
  margin-bottom: 15px;
}

select {
  margin-left: 10px;
}

.location-card {
  border: 5px solid #00c2e5;
  background-color: #c5f7ff;
  border-radius: 14px;
  padding: 15px;
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
}

.location-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #00c2e5;
  margin: -15px -15px 15px -15px;
  padding: 5px;
  border-radius: 8px 8px 0 0;
}


h2 {
  color: white;
  margin: 0;
  font-size: 1em;
}

button {
  background-color: transparent;
  border: 2px solid white;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.delete-btn:hover {
  color: red;
  border-color: red;
}

.toggle-btn-container {
  display: flex;
  justify-content: center;
  margin-bottom: 5px;
}

.toggle-btn {
  border: 0;
  font-size: 0.9rem;
  color: #005866;
}

.toggle-btn:hover {
  color: green;
  text-decoration: underline;
}

.location-details {
  display: flex;
  flex-direction: column;
}

.location-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

label {
  display: flex;
  align-items: center;
  width: 48%;
}

.view-change-label {
  width: 48%;
}

.view-change-label input {
  width: 10px;
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
