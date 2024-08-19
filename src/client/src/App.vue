<script setup lang="ts">
import { useRouter } from "vue-router";
import { currentView, View } from "./state";
import Background from "./components/Background.vue";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();
const switchInterval = computed(() => store.getters.getSwitchInterval);
const theme = computed(() => store.getters.getTheme);
const refreshNeeded = computed(() => store.getters.getRefreshNeeded);

watch(refreshNeeded, (newValue) => {
  if (newValue === true) {
    location.reload();
  }
}, { immediate: true });

/* View-changing logic */

const views = ref<View[]>([]);
let currentViewIndex = 0;
let timerId: number | undefined;

const updateViews = () => {
  views.value = [
    ...store.getters.getBuses.map((_: any, index: number) => ({
      path: `/buses/${index + 1}`,
      type: "bus" as const,
      id: `bus-${index + 1}`
    })),
    ...store.getters.getTrains.map((_: any, index: number) => ({
      path: `/trains/${index + 1}`,
      type: "train" as const,
      id: `train-${index + 1}`
    })),
  ];
};

const navigateViews = () => {
  if (views.value.length === 0) {
    console.warn("No views available to navigate");
    return;
  }

  const nextView = views.value[currentViewIndex];
  currentView.value = nextView;
  router.push(nextView.path);

  currentViewIndex = (currentViewIndex + 1) % views.value.length;
  timerId = window.setTimeout(navigateViews, switchInterval.value * 1000);
};

const currentKey = computed(() => currentView.value ? currentView.value.id : '');

/* Fetching data from the store */

const startPolling = () => {
  const fetchAndUpdate = async () => {
    await store.dispatch("fetchData");
    updateViews();
  };

  fetchAndUpdate(); // Initial fetch
  return setInterval(fetchAndUpdate, 15000);
};

let pollingInterval: ReturnType<typeof setInterval>;

/* Theme-changing logic */

const setTheme = (themeName: string) => {
  const themeLinkElement = document.getElementById('theme-link') as HTMLLinkElement | null;
  if (themeLinkElement) {
    const newHref = `/assets/theme-${themeName}.css?version=${new Date().getTime()}`;
    themeLinkElement.setAttribute('href', newHref);
  } else {
    console.error("Element with id 'theme-link' not found");
  }
};

const applyTheme = (themeName: string) => {
  let currentTheme = localStorage.getItem('currentTheme');
  let newTheme = themeName === 'LUT' ? 'LUT' : 'LAB';

  if (currentTheme !== newTheme) {
    localStorage.setItem('currentTheme', newTheme);
    setTheme(newTheme);
  } else {
    // Even if the theme hasn't changed, ensure it's applied
    setTheme(currentTheme || newTheme);
  }
};

watch(theme, (newTheme) => {
  applyTheme(newTheme);
});

onMounted(() => {
  const currentTheme = localStorage.getItem('currentTheme') || 'LAB';
  setTheme(currentTheme);

  pollingInterval = startPolling();
  store.dispatch("fetchData").then(() => {
    navigateViews();
    applyTheme(theme.value);
  });
});

onBeforeUnmount(() => {
  if (timerId !== undefined) {
    clearTimeout(timerId);
  }
  clearInterval(pollingInterval);
});
</script>

<template>
  <Background></Background>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" :key="currentKey" />
    </transition>
  </router-view>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s linear;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
