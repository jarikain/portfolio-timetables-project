import './assets/main.css'
import 'sweetalert2/dist/sweetalert2.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import { store } from './store'
import router from './router'

const app = createApp(App)

app.use(store)
app.use(router)

app.mount('#app')
