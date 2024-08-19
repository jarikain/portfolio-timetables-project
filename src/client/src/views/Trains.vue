<template>
  <div>
    <div class="portraitDiv">
      <h1>Trains</h1>
      <div v-for="(trainArray, index) in trains" :key="index">
        <div v-for="(train, innerIndex) in trainArray" :key="innerIndex">
          <h2 class="title">{{ train.title }}</h2>
          <div class="container">
            <table class="trainTable">
              <tbody v-for="(trip, tripIndex) in train.trips" :key="tripIndex">
                <tr class="trainTr">
                  <td></td>
                </tr>
                <tr v-if="trip.cancelled === true" class="cancelled">
                  <td class="trainId">
                    <transition-group name="roll" tag="div" class="roll-wrapper">
                      <span :key="`shortName-${trip.shortName}-${tripIndex}`">{{ trip.shortName }}</span>
                    </transition-group>
                  </td>
                  <td>
                    <transition-group name="roll" tag="div" class="roll-wrapper">
                      <span :key="`destination-${trip.destinationName}-${tripIndex}`">{{ trip.destinationName }}</span>
                    </transition-group>
                  </td>
                  <td class="cancelledTime">
                    <transition-group name="roll" tag="div" class="roll-wrapper">
                      <span :key="`time-${trip.departureTime}-${tripIndex}`">{{ trip.departureTime }}</span>
                    </transition-group>
                  </td>
                </tr>

                <tr v-else class="trainTr">
                  <td class="trainId">
                    <transition-group name="roll" tag="div" class="roll-wrapper">
                      <span :key="`shortName-${trip.shortName}-${tripIndex}`">{{ trip.shortName }}</span>
                    </transition-group>
                  </td>
                  <td class="destinationName">
                    <transition-group name="roll" tag="div" class="roll-wrapper">
                      <span :key="`destination-${trip.destinationName}-${tripIndex}`">{{ trip.destinationName }}</span>
                    </transition-group>
                  </td>
                  <td v-if="trip.delayed === true" class="cancelledTime">
                    <transition-group name="roll" tag="div" class="roll-wrapper">
                      <span :key="`time-${trip.departureTime}-${tripIndex}`">{{ trip.departureTime }}</span>
                    </transition-group>
                  </td>
                  <td v-else class="departureTimeTrain">
                    <transition-group name="roll" tag="div" class="roll-wrapper">
                      <span :key="`time-${trip.departureTime}-${tripIndex}`">{{ trip.departureTime }}</span>
                    </transition-group>
                  </td>
                </tr>

                <tr v-if="trip.cancelled === true" class="cancelled">
                  <td class="track">
                    <transition-group name="roll" tag="div" class="roll-wrapper">
                      <span :key="`track-${trip.commercialTrack}-${tripIndex}`">TRACK {{ trip.commercialTrack }}</span>
                    </transition-group>
                  </td>
                  <td>CANCELLED</td>
                  <td class="corner"></td>
                </tr>

                <tr v-else class="trainTr">
                  <td class="track">
                    <transition-group name="roll" tag="div" class="roll-wrapper">
                      <span :key="`track-${trip.commercialTrack}-${tripIndex}`">{{ trip.commercialTrack && 'TRACK' }} {{ trip.commercialTrack }}</span>
                    </transition-group>
                  </td>
                  <td></td>
                  <td v-if="trip.delayed === true" class="delayed">
                    <transition-group name="roll" tag="div" class="roll-wrapper">
                      <span :key="`estimate-${trip.liveEstimateTime}-${tripIndex}`">~{{ trip.liveEstimateTime }}</span>
                    </transition-group>
                  </td>
                </tr>

                <tr
                  class="trainTr"
                  :class="{ 'last-row': tripIndex === train.trips.length - 1 }"
                >
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="landscapeDiv">
      <h1>Trains</h1>
      <div v-for="(trainArray, index) in trains" :key="index">
        <div v-for="(train, innerIndex) in trainArray" :key="innerIndex">
          <h2 class="title">{{ train.title }}</h2>
          <div class="container">
            <table class="trainTable">
              <tbody v-for="(trip, tripIndex) in train.trips" :key="tripIndex">
                <tr class="trainTr">
                  <td></td>
                </tr>

                <tr v-if="trip.cancelled === true" class="cancelled">
                  <td class="trainId">
                    <transition-group name="roll" tag="div" class="roll-wrapper">
                      <span :key="`shortName-${trip.shortName}-${tripIndex}`">{{ trip.shortName }}</span>
                    </transition-group>
                  </td>
                  <td>
                    <transition-group name="roll" tag="div" class="roll-wrapper">
                      <span :key="`destination-${trip.destinationName}-${tripIndex}`">{{ trip.destinationName }}</span>
                    </transition-group>
                  </td>
                  <td class="cancelledTime">
                    <transition-group name="roll" tag="div" class="roll-wrapper">
                      <span :key="`time-${trip.departureTime}-${tripIndex}`">{{ trip.departureTime }}</span>
                    </transition-group>
                  </td>
                  <td></td>
                  <td class="track">
                    <transition-group name="roll" tag="div" class="roll-wrapper">
                      <span :key="`track-${trip.commercialTrack}-${tripIndex}`">CANCELLED</span>
                    </transition-group>
                  </td>
                  <td class="corner"></td>
                </tr>

                <tr v-else class="trainTr">
                  <td class="trainId">
                    <transition-group name="roll" tag="div" class="roll-wrapper">
                      <span :key="`shortName-${trip.shortName}-${tripIndex}`">{{ trip.shortName }}</span>
                    </transition-group>
                  </td>
                  <td class="destinationNameTrain">
                    <transition-group name="roll" tag="div" class="roll-wrapper">
                      <span :key="`destination-${trip.destinationName}-${tripIndex}`">{{ trip.destinationName }}</span>
                    </transition-group>
                  </td>
                  <td v-if="trip.delayed === true" class="cancelledTime">
                    <transition-group name="roll" tag="div" class="roll-wrapper">
                      <span :key="`time-${trip.departureTime}-${tripIndex}`">{{ trip.departureTime }}</span>
                    </transition-group>
                  </td>
                  <td v-else class="departureTimeTrain">
                    <transition-group name="roll" tag="div" class="roll-wrapper">
                      <span :key="`time-${trip.departureTime}-${tripIndex}`">{{ trip.departureTime }}</span>
                    </transition-group>
                  </td>
                  <td v-if="trip.delayed === true" class="delayed">
                    <transition-group name="roll" tag="div" class="roll-wrapper">
                      <span :key="`estimate-${trip.liveEstimateTime}-${tripIndex}`">~{{ trip.liveEstimateTime }}</span>
                    </transition-group>
                  </td>
                  <td v-else></td>
                  <td class="track">
                    <transition-group name="roll" tag="div" class="roll-wrapper">
                      <span :key="`track-${trip.commercialTrack}-${tripIndex}`">{{ trip.commercialTrack && 'TRACK' }} {{ trip.commercialTrack }}</span>
                    </transition-group>
                  </td>                  
                </tr>
                
                <tr
                  class="trainTr"
                  :class="{ 'last-row': tripIndex === train.trips.length - 1 }">
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { computed, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { State } from "../store/store";
import { Destination, TripDetails } from "../../../server/src/types/dataTypes";

const store = useStore<State>();
const route = useRoute();

const trainIndex = computed(() => parseInt(route.params.id as string) - 1);

const allTrains = computed<Destination[][]>(() => store.getters.getTrains);

const trains = computed<Destination[][]>(() => {
  const currentTrainView = allTrains.value[trainIndex.value];
  if (!currentTrainView) return [];

  return [
    currentTrainView.map((trainStop: Destination) => ({
      ...trainStop,
      trips: trainStop.trips.map((trip: TripDetails, index: number) => ({
        ...trip,
        id: `${trainStop.title}-${trip.shortName}-${
          trip.minutesToDeparture
        }-${Date.now()}-${index}`,
      })),
    })),
  ];
});

watch(
  () => route.params.id,
  (newId) => {
    console.log(`Route changed to train view ${newId}`);
  }
);
</script>

