<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from "vue-router";

const store = useStore()
const hasChanges = computed(() => store.getters.hasChanges)
const route = useRoute()
const isLoggedIn = computed(() => store.getters.isLoggedIn)

function saveChanges() {
  if (route.path === '/devices') {
    store.dispatch('saveDevices')
  } else if (route.path === '/locations') {
    store.dispatch('saveLocations')
  }
}

function cancelChanges() {
  if (route.path === '/devices') {
    store.dispatch('cancelDevicesChanges')
  } else if (route.path === '/locations') {
    store.dispatch('cancelLocationsChanges')
  }
}

</script>

<template>
  <nav v-if="isLoggedIn" class="main-menu__nav">
    <div class="main-menu__nav-left">
      <RouterLink to="/devices" >Laitteet</RouterLink>
      <RouterLink to="/locations">Sijainnit</RouterLink>
      <RouterLink to="/help">Ohjeet</RouterLink>
    </div>
    <div class="main-menu__buttons">
      <button :disabled="!hasChanges" @click="saveChanges" class="save-button">Tallenna muutokset</button>
      <button :disabled="!hasChanges" @click="cancelChanges" class="cancel-button">Peruuta</button>
    </div>
    <div class="main-menu__nav-right">
      <RouterLink to="/admin">Hallinta</RouterLink>
    </div>
  </nav>
</template>

<style scoped>
.main-menu__nav {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background: #fdeae0;
  position: relative;
}

.main-menu__nav-left {
  margin-right: 100px;
}

.main-menu__buttons {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
}

.main-menu__nav-left {
  display: flex;
  width: 250px;
  justify-content: space-between;
}

.main-menu__nav-right {
  margin-left: auto;
}

a {
  margin-right: 10px;
  text-decoration: none;
  color: inherit;
}

a.router-link-active {
  text-decoration: underline;
}

button {
  font-size: 1.1rem;
  margin: 0 10px;
  border-radius: 4px;
  cursor: pointer;
}

.save-button {
  border: 2px solid #103c00;
  font-weight: bolder;
  color: #f5ffeb;
  background-color: #00bd80;
}

.save-button:disabled {
  opacity: 0;
}

.cancel-button {
  border: 2px solid white;
  color: white;
  background-color: #8d8d8d;
}

.cancel-button:disabled {
  opacity: 0;
}

</style>