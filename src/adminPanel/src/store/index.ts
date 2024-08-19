import { createStore } from 'vuex'
import type { Device, Location, Stop, View } from '@/types'
import Swal from 'sweetalert2'

interface State {
  locations: Location[]
  devices: Device[]
  hasChanges: boolean
  user: { username: string } | null,
  isLoggedIn: boolean,
  locationCollapseStates: { [locationId: number]: boolean }
}

const api_url = import.meta.env.VITE_API_BASE_URL

export const store = createStore<State>({
  state: {
    locations: [],
    devices: [],
    hasChanges: false,
    user: null,
    isLoggedIn: false,
    locationCollapseStates: {}
  },
  mutations: {
    setLocations(state, locations: Location[]) {
      state.locations = locations
      state.hasChanges = false
    },

    setDevices(state, devices: Device[]) {
      state.devices = devices
      state.hasChanges = false
    },

    resetHasChanges(state) {
      state.hasChanges = false
    },

    updateLocationField(state, payload: { id: number; field: keyof Location; value: any }) {
      const location = state.locations.find((loc) => loc.id === payload.id)

      if (location) {
        ;(location as any)[payload.field] = payload.value
        state.hasChanges = true
      }
    },

    updateViewField(state, payload: { viewId: number; field: keyof View; value: any }) {
      const view = state.locations
        .flatMap((location) => location.views)
        .find((view) => view.id === payload.viewId)

      if (view) {
        ;(view as any)[payload.field] = payload.value
        state.hasChanges = true
      }
    },

    updateStopField(state, payload: { stopId: number; field: keyof Stop; value: any }) {
      const stop = state.locations
        .flatMap((location) => location.views)
        .flatMap((view) => view.stops)
        .find((stop) => stop.id === payload.stopId)

      if (stop) {
        ;(stop as any)[payload.field] = payload.value
        state.hasChanges = true
      }
    },

    updateDeviceField(state, payload: { id: number; field: keyof Device; value: any }) {
      const device = state.devices.find((dev) => dev.id === payload.id)
      if (device) {
        if (payload.field === 'location') {
          device.location = payload.value
        } else {
          (device as any)[payload.field] = payload.value
        }
        state.hasChanges = true
      }
    },

    setUser(state, user) {
      state.user = user
      state.isLoggedIn = !!user
    },

    clearUser(state) {
      state.user = null
    },

    setLoggedIn(state, value: boolean) {
      state.isLoggedIn = value
    },

    setLocationCollapseState(state, payload: { locationId: number, isCollapsed: boolean }) {
      state.locationCollapseStates[payload.locationId] = payload.isCollapsed
    }
  },

  actions: {
    async fetchLocations({ commit }) {
      const response = await fetch(api_url + '/location?relations=true')
      const locations = await response.json()
      commit('setLocations', locations)
    },

    async fetchDevices({ commit }) {
      const response = await fetch(api_url + '/device?relations=true')
      const devices = await response.json()
      commit('setDevices', devices)
    },

    async saveLocations({ commit }) {
      const body = JSON.stringify(store.getters.getLocations)
      const response = await fetch(api_url + '/location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body
      })
      const locations = await response.json()

      commit('setLocations', locations)
    },

    async saveDevices({ commit }) {
      const body = JSON.stringify(store.getters.getDevices)
      const response = await fetch(api_url + '/device', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body
      })
      const devices = await response.json()

      commit('setDevices', devices)
    },

    async cancelLocationsChanges({ commit }) {
      const response = await fetch(api_url + '/location?relations=true')
      const locations = await response.json()

      commit('setLocations', locations)
      commit('resetHasChanges')
    },
    async cancelDevicesChanges({ commit }) {
      const response = await fetch(api_url + '/device?relations=true')
      const devices = await response.json()

      commit('setDevices', devices)
      commit('resetHasChanges')
    },

    async refreshDevices({ commit, dispatch }) {
      const devices = dispatch('fetchDevices')
      commit('setDevices', devices)
    },

    async refreshLocations({ commit, dispatch }) {
      const locations = dispatch('fetchLocations')
      commit('setLocations', locations)
    },

    async addItem(state, payload) {
      const body: string = JSON.stringify([{...payload.item}])
      return await fetch(api_url + `/${payload.type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body
      })
    },
    
    async deleteItem(state, { type, id }) {
      return await fetch(api_url + `/${type}/${id}`, {
        method: 'DELETE'
      })
    },

    async login({ commit }, { username, password }) {
      try {
        const response = await fetch(`${api_url}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
          credentials: 'include'
        })

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Login failed');
        }

        const data = await response.json()
        commit('setUser', data.user)
        return true
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },
    async register({ commit }, { username, password }) {
      const response = await fetch(`${api_url}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      if (!response.ok) {
        throw new Error('Registration failed')
      }
    },

    async initialRegister({ commit }, { username, password }) {
      const response = await fetch(`${api_url}/initial-register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      if (!response.ok) {
        throw new Error('Registration failed')
      }
    },

    async logout({ commit }) {
      await fetch(`${api_url}/logout`, {
        method: 'POST',
        credentials: 'include'
      })
      commit('setUser', null)
    },

    async exportSettings({ state }) {
      return {
        locations: state.locations,
        devices: state.devices,
      }
    },

    async importSettings({ commit, dispatch }, settings) {
      try {
        const deleteResponse = await fetch(`${api_url}/delete-all-settings`, {
          method: 'DELETE',
          credentials: 'include'
        })

        if (!deleteResponse.ok) {
          throw new Error('Failed to delete existing settings')
        }

        const locationsResponse = await fetch(`${api_url}/location`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(settings.locations),
          credentials: 'include'
        })

        const devicesResponse = await fetch(`${api_url}/device`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(settings.devices),
          credentials: 'include'
        })

        if (!locationsResponse.ok || !devicesResponse.ok) {
          throw new Error('Failed to import settings')
        }

        await dispatch('fetchLocations')
        await dispatch('fetchDevices')
      } catch (error) {
        console.error('Error during import:', error)
        throw error
      }
    },

    async saveChanges({ dispatch }) {
      await dispatch('saveLocations')
      await dispatch('saveDevices')
    },

    async discardChanges({ dispatch }) {
      await dispatch('cancelLocationsChanges')
      await dispatch('cancelDevicesChanges')
    },

    async checkUnsavedChanges({ getters, dispatch }) {
      if (getters.hasChanges) {
        const result = await Swal.fire({
          title: 'Tallentamattomia muutoksia',
          text: 'Sivulla on tallentamattomia muutoksia. Mitä halut tehdä?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Tallenna',
          cancelButtonText: 'Hylkää muutokset',
          showDenyButton: true,
          denyButtonText: 'Peruuta takaisin'
        })

        if (result.isConfirmed) {
          await dispatch('saveChanges')
          return 'save'
        } else if (result.isDismissed && result.dismiss === Swal.DismissReason.cancel) {
          await dispatch('discardChanges')
          return 'discard'
        } else {
          return 'cancel'
        }
      }
      return 'continue'
    }
  },

  getters: {
    getLocations: (state) => state.locations,
    getDevices: (state) => state.devices,
    hasChanges: (state) => state.hasChanges,
    getViewById: (state) => (viewId: number) => {
      for (const location of state.locations) {
        const view = location.views.find((v) => v.id === viewId)
        if (view) return view
      }
      return null
    },
    getLocationById: (state) => (locationId: number) => {
      return state.locations.find((location) => location.id === locationId) || null
    },
    getDeviceById: (state) => (deviceId: number) => {
      return state.devices.find((device) => device.id === deviceId) || null
    },
    getViewsByLocationId: (state) => (locationId: number) => {
      const location = state.locations.find((location) => location.id === locationId)
      return location ? location.views : []
    },
    getStopById: (state) => (stopId: number) => {
      for (const location of state.locations) {
        for (const view of location.views) {
          const stop = view.stops.find((s) => s.id === stopId)
          if (stop) return stop
        }
      }
      return null
    },
    getStopsByViewId: (state) => (viewId: number) => {
      for (const location of state.locations) {
        const view = location.views.find((v) => v.id === viewId)
        if (view) {
          return view.stops
        }
      }
      return []
    },

    getViewByStopId: (state) => (stopId: number) => {
      for (const location of state.locations) {
        for (const view of location.views) {
          if (view.stops.some(stop => stop.id === stopId)) {
            return view;
          }
        }
      }
      return null;
    },

    getLocationCollapseState: (state) => (locationId: number) => {
      return state.locationCollapseStates[locationId] ?? true // Default to true (collapsed) if not set
    },

    locationHasMultipleTrainViews: (state) => (viewId: number) => {
      const location = state.locations.find(loc =>
        loc.views.some(view => view.id === viewId)
      );
      if (!location) return false;
      return location.views.filter(view => view.type === 'train').length > 1;
    },

    isLoggedIn: (state) => state.isLoggedIn
  },
})
