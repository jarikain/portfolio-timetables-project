<template>
  <div>
    <div class="portraitDiv">
      <h1>Buses</h1>
      <template v-if="buses && buses.length > 0">
        <div v-for="(busArray, index) in buses" :key="index">
          <template v-if="busArray.length === 1">
            <div v-for="(bus, innerIndex) in busArray" :key="innerIndex">
              <h2 class="title">{{ bus.title }}</h2>
              <div class="busDiv">
                <div class="container">
                  <table class="busTable">
                    <tbody>
                      <tr v-for="trip in bus.trips" :key="getUniqueKey(index)" class="busTr" :class="{ 'last-row': trip === bus.trips[bus.trips.length - 1] }">
                        <td class="busId">
                          <transition-group name="roll" tag="div" class="roll-wrapper">
                            <span :key="`shortName-${trip.shortName}-${index}`">{{ trip.shortName }}</span>
                          </transition-group>
                        </td>
                        <td class="destinationName">
                          <transition-group name="roll" tag="div" class="roll-wrapper">
                            <span :key="`destination-${trip.destinationName}-${index}`">{{ trip.destinationName }}</span>
                          </transition-group>
                        </td>
                        <td class="departureTime">
                          <transition-group name="roll" tag="div" class="roll-wrapper">
                            <span :key="`time-${trip.minutesToDeparture}-${index}`" class="time">{{ trip.minutesToDeparture }}</span>
                          </transition-group>
                        </td>
                        <td class="min" v-if="showMin(trip.minutesToDeparture)">
                          <transition-group name="roll" tag="div" class="roll-wrapper">
                            <span>MIN</span>
                          </transition-group>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </template>

          <template v-else-if="busArray.length === 2">
            <div v-for="(bus, innerIndex) in busArray" :key="innerIndex">
              <div class="busDiv" v-if="innerIndex === 0">
                <h2 class="stop1">{{ bus.title }}</h2>
                <div class="stop1Container">
                  <table class="busTable">
                    <tbody>
                      <tr v-for="trip in bus.trips" :key="getUniqueKey(index)" class="busTr" :class="{ 'last-row': trip === bus.trips[bus.trips.length - 1] }">
                        <td class="busId">
                          <transition-group name="roll" tag="div" class="roll-wrapper">
                            <span :key="`shortName-${trip.shortName}-${index}`">{{ trip.shortName }}</span>
                          </transition-group>
                        </td>
                        <td class="destinationName">
                          <transition-group name="roll" tag="div" class="roll-wrapper">
                            <span :key="`destination-${trip.destinationName}-${index}`">{{ trip.destinationName }}</span>
                          </transition-group>
                        </td>
                        <td class="departureTime">
                          <transition-group name="roll" tag="div" class="roll-wrapper">
                            <span :key="`time-${trip.minutesToDeparture}-${index}`" class="time">{{ trip.minutesToDeparture }}</span>
                          </transition-group>
                        </td>
                        <td class="min" v-if="showMin(trip.minutesToDeparture)">
                          <transition-group name="roll" tag="div" class="roll-wrapper">
                            <span>MIN</span>
                          </transition-group>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="busDiv2" v-if="innerIndex === 1">
                <h2 class="stop2">{{ bus.title }}</h2>
                <div class="stop2Container">
                  <table class="busTable">
                    <tbody>
                      <tr v-for="trip in bus.trips" :key="getUniqueKey(index)" class="busTr" :class="{ 'last-row': trip === bus.trips[bus.trips.length - 1] }">
                        <td class="busId">
                          <transition-group name="roll" tag="div" class="roll-wrapper">
                            <span :key="`shortName-${trip.shortName}-${index}`">{{ trip.shortName }}</span>
                          </transition-group>
                        </td>
                        <td class="destinationName">
                          <transition-group name="roll" tag="div" class="roll-wrapper">
                            <span :key="`destination-${trip.destinationName}-${index}`">{{ trip.destinationName }}</span>
                          </transition-group>
                        </td>
                        <td class="departureTime">
                          <transition-group name="roll" tag="div" class="roll-wrapper">
                            <span :key="`time-${trip.minutesToDeparture}-${index}`" class="time">{{ trip.minutesToDeparture }}</span>
                          </transition-group>
                        </td>
                        <td class="min" v-if="showMin(trip.minutesToDeparture)">
                          <transition-group name="roll" tag="div" class="roll-wrapper">
                            <span>MIN</span>
                          </transition-group>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </template>
        </div>
      </template>
      <div v-else>
        <h2 class="stop1">Loading data...</h2>
      </div>
    </div>

    <div class="landscapeDiv">
      <h1>Buses</h1>
      <template v-if="buses && buses.length > 0">
        <div v-for="(busArray, index) in buses" :key="index">
          <template v-if="busArray.length === 1">
            <div v-for="(bus, innerIndex) in busArray" :key="innerIndex">
              <h2 class="title">{{ bus.title }}</h2>
              <div class="busDiv">
                <div class="container">
                  <table class="busTable">
                    <tbody>
                      <tr v-for="trip in bus.trips" :key="getUniqueKey(index)" class="busTr" :class="{ 'last-row': trip === bus.trips[bus.trips.length - 1] }">
                        <td class="busId">
                          <transition-group name="roll" tag="div" class="roll-wrapper">
                            <span :key="`shortName-${trip.shortName}-${index}`">{{ trip.shortName }}</span>
                          </transition-group>
                        </td>
                        <td class="destinationName">
                          <transition-group name="roll" tag="div" class="roll-wrapper">
                            <span :key="`destination-${trip.destinationName}-${index}`">{{ trip.destinationName }}</span>
                          </transition-group>
                        </td>
                        <td class="departureTime">
                          <transition-group name="roll" tag="div" class="roll-wrapper">
                            <span :key="`time-${trip.minutesToDeparture}-${index}`" class="time">{{ trip.minutesToDeparture }}</span>
                          </transition-group>
                        </td>
                        <td class="min" v-if="showMin(trip.minutesToDeparture)">
                          <transition-group name="roll" tag="div" class="roll-wrapper">
                            <span>MIN</span>
                          </transition-group>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </template>

          <template v-else-if="busArray.length === 2">
            <div v-for="(bus, innerIndex) in busArray" :key="innerIndex">
              <div class="busDiv" v-if="innerIndex === 0">
                <h2 class="stop1">{{ bus.title }}</h2>
                <div class="stop1Container">
                  <table class="busTable">
                    <tbody>
                      <tr v-for="trip in bus.trips" :key="getUniqueKey(index)" class="busTr" :class="{ 'last-row': trip === bus.trips[bus.trips.length - 1] }">
                        <td class="busId">
                          <transition-group name="roll" tag="div" class="roll-wrapper">
                            <span :key="`shortName-${trip.shortName}-${index}`">{{ trip.shortName }}</span>
                          </transition-group>
                        </td>
                        <td class="destinationName">
                          <transition-group name="roll" tag="div" class="roll-wrapper">
                            <span :key="`destination-${trip.destinationName}-${index}`">{{ trip.destinationName }}</span>
                          </transition-group>
                        </td>
                        <td class="departureTime">
                          <transition-group name="roll" tag="div" class="roll-wrapper">
                            <span :key="`time-${trip.minutesToDeparture}-${index}`" class="time">{{ trip.minutesToDeparture }}</span>
                          </transition-group>
                        </td>
                        <td class="min" v-if="showMin(trip.minutesToDeparture)">
                          <transition-group name="roll" tag="div" class="roll-wrapper">
                            <span>MIN</span>
                          </transition-group>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="busDiv2" v-if="innerIndex === 1">
                <h2 class="stop2">{{ bus.title }}</h2>
                <div class="stop2Container">
                  <table class="busTable">
                    <tbody>
                      <tr v-for="trip in bus.trips" :key="getUniqueKey(index)" class="busTr" :class="{ 'last-row': trip === bus.trips[bus.trips.length - 1] }">
                        <td class="busId">
                          <transition-group name="roll" tag="div" class="roll-wrapper">
                            <span :key="`shortName-${trip.shortName}-${index}`">{{ trip.shortName }}</span>
                          </transition-group>
                        </td>
                        <td class="destinationName">
                          <transition-group name="roll" tag="div" class="roll-wrapper">
                            <span :key="`destination-${trip.destinationName}-${index}`">{{ trip.destinationName }}</span>
                          </transition-group>
                        </td>
                        <td class="departureTime">
                          <transition-group name="roll" tag="div" class="roll-wrapper">
                            <span :key="`time-${trip.minutesToDeparture}-${index}`" class="time">{{ trip.minutesToDeparture }}</span>
                          </transition-group>
                        </td>
                        <td class="min" v-if="showMin(trip.minutesToDeparture)">
                          <transition-group name="roll" tag="div" class="roll-wrapper">
                            <span>MIN</span>
                          </transition-group>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </template>
        </div>
      </template>
      <div v-else>
        <h2 class="stop1">Loading data...</h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { Destination, TripDetails } from "../../../server/src/types/dataTypes";
import { State } from "../store/store";

const store = useStore<State>();
const route = useRoute();

const busIndex = computed(() => parseInt(route.params.id as string) - 1);

const allBuses = computed<Destination[][]>(() => store.getters.getBuses);

const buses = computed<Destination[][]>(() => {
  const currentBusView = allBuses.value[busIndex.value];
  if (!currentBusView) return [];

  return [
    currentBusView.map((busStop: Destination) => ({
      ...busStop,
      trips: busStop.trips.map((trip: TripDetails, index: number) => ({
        ...trip,
        id: `${busStop.title}-${trip.shortName}-${
          trip.minutesToDeparture
        }-${Date.now()}-${index}`,
      })),
    })),
  ];
});

const getUniqueKey = (index: number) => {
  return `row-${index}`;
};

watch(
  () => route.params.id,
  (newId) => {
    console.log(`Route changed to bus view ${newId}`);
  }
);


const showMin = (minutesToDeparture: string | number): boolean => {
  const departureString = String(minutesToDeparture);
  return /^\d{1,2}$/.test(departureString);
};
</script>