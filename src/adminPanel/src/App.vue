<script setup lang="ts">
import { RouterView } from 'vue-router'
import MainMenu from '@/components/MainMenu.vue'
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()
const isLoggedIn = computed(() => store.getters.isLoggedIn)
const isLoading = ref(true)

onMounted(async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/check-auth`, {
      credentials: 'include'
    })
    if (response.ok) {
      const data = await response.json()
      store.commit('setUser', data.user)

      if (router.currentRoute.value.path === '/login') {
        router.push('/locations')
      }
    } else {
      store.commit('setUser', null)
      if (router.currentRoute.value.meta.requiresAuth) {
        router.push('/login')
      }
    }
  } catch (error) {
    console.error('Error checking authentication:', error)
    store.commit('setUser', null)
    if (router.currentRoute.value.meta.requiresAuth) {
      router.push('/login')
    }
  } finally {
    isLoading.value = false
  }

  router.beforeEach(async (to, from, next) => {
    const action = await store.dispatch('checkUnsavedChanges')
    if (action === 'cancel') {
      next(false)
    } else {
      next()
    }
  })
})
</script>

<template>
  <div v-if="!isLoading" class="app-container">
    <header v-if="isLoggedIn" class="main-header">
      <MainMenu />
    </header>

    <main :class="{ 'main-content': isLoggedIn }">
      <RouterView />
    </main>
  </div>
  <div v-else>
    Loading...
  </div>
</template>

<style scoped>
.app-container {
  position: relative;
}

.main-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #fff;
}

.main-content {
  padding-top: 60px;
}
</style>
