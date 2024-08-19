<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()

const isLogin = ref(true);

const username = ref('')
const password = ref('')
const error = ref('')

const checkInitialRegister = async () => {
  try {
    const response = await fetch(import.meta.env.VITE_API_BASE_URL + 'has-user')
    isLogin.value = response.ok
  } catch (err) {
    console.error('Error checking initial register:', err)
    isLogin.value = false
  }
}

onMounted(checkInitialRegister)

const submitForm = async () => {
  try {
    if (isLogin.value) {
      const success = await store.dispatch('login', { username: username.value, password: password.value })
      if (success) {
        store.commit('setLoggedIn', true) // Add this line
        await router.push('/devices')
      } else {
        error.value = 'Kirjautuminen epäonnistui. Tarkista kirjautumistiedot.'
      }
    } else {
      await store.dispatch('initialRegister', { username: username.value, password: password.value })
      isLogin.value = true
      error.value = 'Rekisteröinti onnistui. Kirjaudu sisään.'

      username.value = ""
      password.value = ""
    }
  } catch (err) {
    console.error('Authentication error:', err)
    error.value = 'Kirjautumisessa tapahtui virhe. Ole hyvä ja yritä uudelleen.'
  }
}
</script>

<template>
  <div class="login-container">
    <h2>{{ isLogin ? 'Kirjaudu sisään' : 'Luo tunnus' }}</h2>
    <form @submit.prevent="submitForm">
      <input v-model="username" type="text" placeholder="Käyttäjätunnus" required>
      <input v-model="password" type="password" placeholder="Salasana" required>
      <button type="submit">{{ isLogin ? 'Kirjaudu' : 'Luo tunnus' }}</button>
    </form>
    <p v-if="error" class="error-message">{{ error }}</p>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 300px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

form {
  display: flex;
  flex-direction: column;
}

input, button {
  margin-bottom: 10px;
  padding: 5px;
}

button {
  cursor: pointer;
}
</style>