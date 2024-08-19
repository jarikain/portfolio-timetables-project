<template>
  <div class="locations-view-container">
    <location-list :locations="locations" />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import LocationList from '@/components/LocationList.vue'

const store = useStore()

const locations = computed(() => store.getters.getLocations)

onMounted(() => {
  store.dispatch('fetchLocations')
})
</script>

<style scoped>
.locations-view-container {
  height: 100vh;
}
</style>