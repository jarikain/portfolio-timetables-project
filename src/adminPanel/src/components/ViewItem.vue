<script lang="ts" setup>
import type { Stop, View } from "@/types";
import StopList from './StopList.vue'
import { useStore } from 'vuex'
import { computed } from 'vue'
import Swal from 'sweetalert2'
import Notice from '@/components/Notice.vue'

const props = defineProps<{ viewProp: View }>()
const store = useStore()
const view = computed(() => {
  return store.getters.getViewById(props.viewProp.id)
})
const locationHasMultipleTrainViews  = computed(() => {
  return store.getters.locationHasMultipleTrainViews(view.value.id)
})

function updateView(field: keyof View, value: any) {
  store.commit('updateViewField', {
    viewId: props.viewProp.id,
    field,
    value
  })
}

async function deleteView() {
  const stops = view.value.stops
  await deleteStops(stops)

  const payload = {
    type: 'view',
    id: view.value.id,
  }

  await store.dispatch('deleteItem', payload)
  await store.dispatch('refreshLocations')
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
    title: "Haluatko varmasti poistaa tämän näkymän ja siihen liitetyt pysäkit?",
    showCancelButton: true,
    confirmButtonText: "Poista",
    cancelButtonText: `Peruuta`
  }).then((result) => {
    if (result.isConfirmed) {
      deleteView()
    }
  });
}
</script>

<template>
  <div class="view-card">
    <div class="view-top-row">
      <h3>
        Näkymä
        <template v-if="view.type === 'train'">
          <Notice
            :condition-boolean="locationHasMultipleTrainViews"
            text="Juna-näkymiä tulisi olla vain yksi. Vain viimeisin juna-näkymä on näkyvissä."
          />
        </template>
      </h3>
      <button @click="confirmDelete">Poista</button>
    </div>
    <div class="view-details">
      <label>
        Näkymän tyyppi
        <select
          :value="view.type"
          @change="updateView('type', ($event.target as HTMLSelectElement).value)"
        >
          <option value="train">Juna</option>
          <option value="bus">Linja-auto</option>
        </select>
      </label>

      <label class="enabled-input-label">
        <input
          class="input-checkbox"
          type="checkbox"
          id="enabled"
          name="enabled"
          :checked="view.enabled"
          @change="updateView('enabled', ($event.target as HTMLInputElement).checked)"
        >
        <span>Päällä</span>
      </label>
    </div>
    <stop-list :viewId="view.id" />
  </div>
</template>

<style scoped>
.view-card {
  border: 5px solid #00bd80;
  background-color: #b6ffe3;
  border-radius: 14px;
  padding: 15px;
  margin-bottom: 10px;
  width: 100%;
  box-sizing: border-box;
}

.view-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #00bd80;
  margin: -15px -15px 15px -15px;
  padding: 5px;
  border-radius: 8px 8px 0 0;
}

h3 {
  color: white;
  margin: 0;
  font-size: 1em;
}

.view-top-row button {
  background-color: transparent;
  border: 2px solid white;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.view-top-row button:hover {
  color: red;
  border-color: red;
}

.view-details {
  margin-bottom: 15px;
}

.enabled-input-label {
  margin-left: 40px;
}

.enabled-input-label span {
  margin-left: 5px;
}

select {
  margin-left: 10px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

input[type=checkbox] {
  transform: scale(1.5);
}
</style>