<script setup lang="ts">
import { useStore } from 'vuex'
import { onMounted, ref } from 'vue'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useStore()
const isLoading = ref(false)
const newPassword = ref('')
const confirmPassword = ref('')

onMounted(() => {
  store.dispatch('fetchDevices')
  store.dispatch('fetchLocations')
})

async function updateCache() {
  isLoading.value = true
  try {
    const response = await fetch(import.meta.env.VITE_API_BASE_URL + 'flushcache', {
      method: 'POST'
    })
    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Onnistui!',
        text: 'Välimuisti päivitetty onnistuneesti'
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Epäonnistui!',
        text: 'Välimuistin päivittämisessä tapahtui virhe.'
      })
    }
  } finally {
    isLoading.value = false
  }
}

async function exportSettings() {
  const settings = await store.dispatch('exportSettings')
  const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'jubu_settings.json'
  link.click()
  URL.revokeObjectURL(url)
}

async function importSettings(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = async (e) => {
    try {
      const settings = JSON.parse(e.target?.result as string)

      const result = await Swal.fire({
        title: 'Vahvista tuonti',
        text: 'Tämä toiminto poistaa kaikki nykyiset asetukset. Haluatko jatkaa?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Kyllä, tuo asetukset',
        cancelButtonText: 'Peruuta'
      })

      if (result.isConfirmed) {
        await store.dispatch('importSettings', settings)
        Swal.fire({
          icon: 'success',
          title: 'Onnistui!',
          text: 'Asetukset tuotu onnistuneesti'
        })
      }
    } catch (error) {
      console.error('Error importing settings:', error)
      Swal.fire({
        icon: 'error',
        title: 'Virhe!',
        text: 'Asetusten tuonnissa tapahtui virhe'
      })
    }
  }
  reader.readAsText(file)
}

async function logout() {
  try {
    await store.dispatch('logout')
    await router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
    Swal.fire({
      icon: 'error',
      title: 'Virhe!',
      text: 'Uloskirjautumisessa tapahtui virhe'
    })
  }
}

async function changePassword() {
  if (newPassword.value !== confirmPassword.value) {
    Swal.fire({
      icon: 'error',
      title: 'Virhe!',
      text: 'Salasanat eivät täsmää'
    })
    return
  }

  try {
    const response = await fetch(import.meta.env.VITE_API_BASE_URL + 'change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ newPassword: newPassword.value }),
      credentials: 'include'
    })

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Onnistui!',
        text: 'Salasana vaihdettu onnistuneesti'
      })
      newPassword.value = ''
      confirmPassword.value = ''
    } else {
      throw new Error('Failed to change password')
    }
  } catch (error) {
    console.error('Error changing password:', error)
    Swal.fire({
      icon: 'error',
      title: 'Virhe!',
      text: 'Salasanan vaihtamisessa tapahtui virhe'
    })
  }
}
</script>

<template>
  <div class="admin-view-container">
    <section class="flush-cache-section">
      <button class="cache-button" @click="updateCache" :disabled="isLoading">
        {{ isLoading ? 'Päivitetään...' : 'Päivitä välimuisti' }}
      </button>
    </section>

    <section class="import-export-section">
      <button @click="exportSettings">Vie (export) asetukset</button>
      <label for="import-file" class="import-label">
        Tuo (import) asetukset
        <input
          id="import-file"
          type="file"
          accept=".json"
          @change="importSettings"
          style="display: none;"
        >
      </label>
    </section>

    <section class="change-password">
      <h2>Vaihda salasana</h2>
      <div class="password-inputs">
        <input
          type="password"
          v-model="newPassword"
          placeholder="Uusi salasana"
        >
        <input
          type="password"
          v-model="confirmPassword"
          placeholder="Vahvista salasana"
        >
      </div>
      <button @click="changePassword">Vaihda salasana</button>
    </section>

    <section class="logout-section">
      <button @click="logout">Kirjaudu ulos</button>
    </section>
  </div>
</template>

<style scoped>
.admin-view-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

section {
  width: 100%;
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 1px solid #e0e0e0;
}

section:last-child {
  border-bottom: none;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #00c1e4;
  color: white;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #45a049;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.flush-cache-section {
  display: flex;
  justify-content: center;
}

.import-export-section {
  display: flex;
  justify-content: space-between;
}

.import-export-section button {
  width: 48%;
}

.change-password h2 {
  margin-bottom: 15px;
  margin-top: 0;
}

.password-inputs {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.password-inputs input {
  width: 45%;
  padding: 8px;
  font-size: 16px;
}

.change-password button {
  width: 100%;
}

.logout-section {
  text-align: center;
}

.import-export-section {
  display: flex;
  justify-content: space-between;
}

.import-export-section button,
.import-label {
  width: 48%;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #00c1e4;
  color: white;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s;
  text-align: center;
  display: inline-block;
  box-sizing: border-box;
}

.import-label {
  line-height: normal;
}

.import-export-section button:hover,
.import-label:hover {
  background-color: #45a049;
}
</style>