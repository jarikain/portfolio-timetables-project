// src/store/index.ts
import { createStore } from 'vuex';
import { finalJson, weatherOut } from '../../../server/src/types/dataTypes';

export interface State {
  buses: any[][];
  trains: any[][];
  switchInterval: number;
  location: string;
  theme: string;
  weather: weatherOut;
  refreshNeeded: boolean;
}

export default createStore<State>({
  state: {
    buses: [],
    trains: [],
    switchInterval: 10,
    location: "Lahti",
    theme: "LAB",
    weather: {
      temperature: '',
      icon: "",
    },
    refreshNeeded: false,
  },
  mutations: {
    setBuses(state, buses) {
      state.buses = buses;
    },
    setTrains(state, trains) {
      state.trains = trains;
    },
    setSwitchInterval(state, switchInterval) {
      state.switchInterval = switchInterval;
    },
    setLocation(state, location) {
      state.location = location;
    },
    setTheme(state, theme) {
      state.theme = theme;
    },
    setWeather(state, weather) {
      state.weather = weather;
    },
    setRefreshNeeded(state, refreshNeeded) {
      state.refreshNeeded = refreshNeeded;
    }
  },
  actions: {
    async fetchData({ commit }) {
      try {
        const API_URL = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(API_URL + 'timetables');
        //const response = await fetch(API_URL + 'dummydata');
        const data:finalJson = await response.json();
        const switchInterval: number = data.viewChangeIntervalSeconds;
        //const location: string = data.location;
        const theme: string = data.theme;
        //const weather = data.weather;
        const buses = data.views.filter(view => view?.type === 'bus').map(view => view?.content);
        const trains = data.views.filter(view => view?.type === 'train').map(view => view?.content);
        commit('setBuses', buses);
        commit('setTrains', trains);
        commit('setSwitchInterval',switchInterval);
        commit('setTheme', theme);
        if (data.location) {
          commit('setLocation', data.location);
        }
        if (data.weather) {
          commit('setWeather', data.weather);
        }    
        commit('setRefreshNeeded', data.refreshNeeded ?? false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  },
  getters: {
    getBuses: (state) => state.buses,
    getTrains: (state) => state.trains,
    getSwitchInterval: (state) => state.switchInterval,
    getLocation: (state) => state.location,
    getTheme: (state) => state.theme,
    getWeather: (state) => state.weather,
    getRefreshNeeded: (state) => state.refreshNeeded,
  }
});
