import { createRouter, createWebHistory } from 'vue-router'
import { store } from '@/store'
import DevicesView from '@/views/DevicesView.vue'
import LoginView from '@/views/LoginView.vue'
import HelpView from '@/views/HelpView.vue'
import LocationsView from '@/views/LocationsView.vue'
import AdminView from '@/views/AdminView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root',
      meta: { requiresAuth: true },
      component: DevicesView // or you can use a separate Home component
    },
    {
      path: '/devices',
      name: 'devices',
      component: DevicesView,
      meta: { requiresAuth: true }
    },
    {
      path: '/locations',
      name: 'locations',
      component: LocationsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/admin',
      name: 'AdminView',
      component: AdminView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/help',
      name: 'help',
      component: HelpView
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.isLoggedIn) {
      next({ name: 'login' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router