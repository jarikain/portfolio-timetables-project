<script setup lang="ts">
import { useStore } from 'vuex'
import type { Device, Location } from '@/types'
import { computed, onMounted } from 'vue'
import Swal from 'sweetalert2';
import EmptyNotice from '@/components/EmptyNotice.vue'

onMounted(() => {
  store.dispatch('fetchLocations')
})

const props = defineProps<{ deviceProp: Device }>()
const store = useStore()
const device = computed(() => {
  return store.getters.getDeviceById(props.deviceProp.id)
})
const locations = computed(() => store.getters.getLocations)

function updateDevice(field: keyof Device, value: any) {
  if (field === 'location') {
    const location = locations.value.find(((loc: Location) => loc.id === Number(value)))
    value = location
  }

  store.commit('updateDeviceField', {
    id: props.deviceProp.id,
    field,
    value
  })
}

async function deleteDevice() {
  const payload = {
    type: 'device',
    id: device.value.id
  }

  const response = await store.dispatch('deleteItem', payload)
  if (response.ok) {
    await store.dispatch('refreshDevices')
  }
}

async function confirmDelete() {
  const action = await store.dispatch('checkUnsavedChanges')
  if (action === 'cancel') {
    return
  }

  Swal.fire({
    title: "Haluatko varmasti poistaa tämän laitteen?",
    showCancelButton: true,
    confirmButtonText: "Poista",
    cancelButtonText: `Peruuta`
  }).then((result) => {
    if (result.isConfirmed) {
      deleteDevice()
    }
  });
}

</script>

<template>
<div class="device-card">
  <div class="card-top-row">
    <h2>Laite</h2>
    <button @click="confirmDelete">Poista</button>
  </div>
  <div class="device-details">
    <div class="device-row">
      <label>
        IP <EmptyNotice :value="device.ip" />
        <input :value="device.ip"
               @input="updateDevice('ip', ($event.target as HTMLInputElement).value)"
        />
      </label>

      <label>
        Sijainti <EmptyNotice :value="device.location?.id" />
        <select :value="device.location?.id"
                @input="updateDevice('location', ($event.target as HTMLInputElement).value)"
        >
          <option
            v-for="location in locations"
            :key="location.id"
            :value="location.id"
          >
            {{ location.name }}
          </option>
        </select>

      </label>
    </div>
  </div>
</div>
</template>

<style scoped>
.device-card {
  border: 5px solid #00c2e5;
  background-color: #c5f7ff;
  border-radius: 14px;
  padding: 15px;
  margin-bottom: 10px;
  max-width: 700px;
  width: 100%;
  box-sizing: border-box;
}

.card-top-row {
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

.card-top-row button {
  background-color: transparent;
  border: 2px solid white;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.card-top-row button:hover {
  color: red;
  border-color: red;
}

.device-details {
  display: flex;
  flex-direction: column;
}

.device-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

label {
  display: flex;
  align-items: center;
  width: 60%;
}

input {
  margin-left: 10px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex-grow: 1;
  max-width: 200px;
}

select {
  margin-left: 10px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex-grow: 1;
}
</style>