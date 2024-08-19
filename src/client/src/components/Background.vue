<script setup lang="ts">
import { onMounted, onBeforeUnmount, computed } from "vue";
import { currentView } from "../state";
import { weatherIcons } from "./weatherIcons";
import { useStore } from "vuex";

const store = useStore();
const switchInterval = computed(() => store.getters.getSwitchInterval);
const weather = computed(() => store.getters.getWeather);
var r = document.querySelector(":root") as HTMLElement;

/* CLOCK */

class Clock {
  el: Element;
  private clockTimerId: number | undefined;

  constructor(element: Element) {
    this.el = element;
    this.run();
  }

  run() {
    const time = new Date();
    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");

    r?.style.setProperty("--interval", switchInterval.value + "s");
    this.updateClock(".hours .first-digit", hours[0]);
    this.updateClock(".hours .second-digit", hours[1]);
    this.updateClock(".minutes .first-digit", minutes[0]);
    this.updateClock(".minutes .second-digit", minutes[1]);

    this.clockTimerId = window.setTimeout(() => {
      requestAnimationFrame(() => this.run());
    }, 1000);
  }

  updateClock(selector: string, newValue: string) {
    const element = this.el.querySelector(selector) as HTMLElement;
    if (element && element.textContent !== newValue) {
      this.animateChange(element, newValue);
    }
  }

  animateChange(element: HTMLElement, newValue: string) {
    const currentSpan = element.querySelector(".current");
    const newSpan = document.createElement("span");
    newSpan.textContent = newValue;
    newSpan.className = "next";

    element.appendChild(newSpan);

    requestAnimationFrame(() => {
      if (currentSpan) {
        currentSpan.classList.add("move-out");
      }
      newSpan.classList.add("move-in");
    });

    setTimeout(() => {
      if (currentSpan) {
        element.removeChild(currentSpan);
      }
      newSpan.classList.remove("next");
      newSpan.classList.add("current");
    }, 550);
  }

  stop() {
    if (this.clockTimerId !== undefined) {
      clearTimeout(this.clockTimerId);
    }
  }
}

let clock: Clock | null = null;

onMounted(() => {
  const clockElement = document.getElementById("clock");
  if (clockElement) {
    clock = new Clock(clockElement);
  }
});

onBeforeUnmount(() => {
  if (clock !== null) {
    clock.stop();
  }
});

/* WEATHER */

const roundedTemperature = computed(() => {
  const temperature = weather.value.temperature;

  if (typeof temperature === "string") {
    return temperature;
  }

  return Math.round(temperature);
});

const getSvgContent = (icon: string): string => {
  return weatherIcons[icon] || "";
};
</script>

<template>
  <div>
    <div class="upperShape-container">
      <svg
        class="upperShape"
        viewBox="0 0 666 895"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          v-show="currentView?.type === 'bus'"
          fill="#B3EDFB"
          d="M385 -95L770 152.5V647.5L385 895L0 647.5V152.5L385 -95Z"
        />
        <path
          v-show="currentView?.type === 'train'"
          fill="#AEEFCE"
          d="M385 -95L770 152.5V647.5L385 895L0 647.5V152.5L385 -95Z"
        />
      </svg>
    </div>

    <div class="lowerShape-container">
      <svg
        class="lowerShape"
        viewBox="0 0 668 1360"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          v-show="currentView?.type === 'bus'"
          fill="#AEEFCE"
          d="M138 0L668 340V1020L138 1360L-392 1020V340L138 0Z"
        />
        <path
          v-show="currentView?.type === 'train'"
          fill="#B3EDFB"
          d="M138 0L668 340V1020L138 1360L-392 1020V340L138 0Z"
        />
      </svg>
    </div>
  </div>

  <div id="clock">
    <div class="hours">
      <span class="digit first-digit"></span>
      <span class="digit second-digit"></span>
    </div>
    <div class="tick">:</div>
    <div class="minutes">
      <span class="digit first-digit"></span>
      <span class="digit second-digit"></span>
    </div>
  </div>

  <div class="weatherContainer">
    <h2 v-if="typeof roundedTemperature !== 'string'" class="temperature"> 
    {{ roundedTemperature }}°
    </h2>
    <h2 v-else class="temperature"></h2>
    <div v-html="getSvgContent(weather.icon)" class="weather-icon"></div>
  </div>

  <div class="bg-container">
    <svg class="background">
      <use href="../../public/assets/assets.svg#background"></use>
    </svg>

    <svg class="road">
      <use href="../../public/assets/assets.svg#road"></use>
    </svg>

    <transition name="slide" mode="out-in">
      <svg v-show="currentView?.type === 'train'" class="rails">
        <use href="../../public/assets/assets.svg#rails"></use>
      </svg>
    </transition>

    <svg
      v-show="currentView?.type === 'train'"
      class="trainSvg"
      viewBox="0 0 1301 181"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M302.354 163.575L289.661 144.296H160.73L144.697 163.575H302.354Z"
        fill="#737373"
      />
      <circle cx="182.775" cy="162.333" r="18.037" fill="#C2C2C2" />
      <circle
        cx="182.775"
        cy="162.333"
        r="8.52467"
        fill="#C2C2C2"
        stroke="#737373"
        stroke-width="7"
      />
      <circle cx="224.194" cy="162.333" r="18.037" fill="#C2C2C2" />
      <circle
        cx="224.194"
        cy="162.333"
        r="8.52467"
        fill="#C2C2C2"
        stroke="#737373"
        stroke-width="7"
      />
      <circle cx="265.612" cy="162.333" r="18.037" fill="#C2C2C2" />
      <circle
        cx="265.612"
        cy="162.333"
        r="8.52467"
        fill="#C2C2C2"
        stroke="#737373"
        stroke-width="7"
      />
      <path
        d="M552.2 163.001L539.185 144.296H406.975L390.535 163.001H552.2Z"
        fill="#737373"
      />
      <circle cx="429.949" cy="162.333" r="18.037" fill="#C2C2C2" />
      <circle
        cx="429.949"
        cy="162.333"
        r="8.52467"
        fill="#C2C2C2"
        stroke="#737373"
        stroke-width="7"
      />
      <circle cx="471.367" cy="162.333" r="18.037" fill="#C2C2C2" />
      <circle
        cx="471.368"
        cy="162.333"
        r="8.52467"
        fill="#C2C2C2"
        stroke="#737373"
        stroke-width="7"
      />
      <circle cx="512.785" cy="162.333" r="18.037" fill="#C2C2C2" />
      <circle
        cx="512.786"
        cy="162.333"
        r="8.52467"
        fill="#C2C2C2"
        stroke="#737373"
        stroke-width="7"
      />
      <path
        d="M194.132 0H611.514C629.024 -6.08457e-05 629.024 8.01645 629.024 17.369C629.024 26.7215 629.291 139.466 629.291 152.98C629.291 163.001 617.575 165.547 602.76 165.547H549.527L536.167 145.951H409.908L390.535 165.547H302.354L289.661 145.951H160.73L144.697 165.547H51.8398C27.7905 165.547 -15.632 149.377 5.74524 116.786C27.1224 84.1946 162.066 0 194.132 0Z"
        fill="white"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M59.3486 70.3345C84.1931 52.8463 113.453 34.8081 138.906 21.3779C160.386 21.4095 192.887 22.3108 194.071 27.4469C195.845 35.1408 157.904 68.9118 145.898 70.2272C136.082 71.3027 79.6183 70.6195 59.3486 70.3345Z"
        fill="#B3EDFB"
      />
      <rect
        x="283.649"
        y="21.377"
        width="97.5334"
        height="49.4347"
        rx="10"
        fill="#B3EDFB"
      />
      <rect
        x="406.568"
        y="21.377"
        width="97.5334"
        height="49.4347"
        rx="10"
        fill="#B3EDFB"
      />
      <path
        class="trainStripe"
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M0.141357 130.935C0.627823 126.624 2.39033 121.908 5.75618 116.786C11.1987 108.504 23.9885 96.8906 40.5671 84.1729H630.234V130.935H0.141357Z"
        fill="#00BD80"
      />
      <rect
        x="553.7"
        y="154.821"
        width="131.943"
        height="57.1233"
        rx="8.5"
        transform="rotate(-90 553.7 154.821)"
        fill="white"
        stroke="#C2C2C2"
        stroke-width="3"
      />
      <rect
        x="564.225"
        y="105.55"
        width="70.8119"
        height="36.074"
        rx="5"
        transform="rotate(-90 564.225 105.55)"
        fill="#B3EDFB"
      />
      <path
        d="M659.09 152.149V18.8691H651.736V152.149H659.09ZM662.09 18.8691V152.149H669.445V18.8691H662.09ZM648.736 152.149V18.8691H641.381V152.149H648.736ZM638.381 152.149V18.8691H631.027V152.149H638.381Z"
        fill="#C2C2C2"
        stroke="#737373"
        stroke-width="3"
      />
      <path
        d="M997.882 163.575L1010.57 144.296H1139.51L1155.54 163.575H997.882Z"
        fill="#737373"
      />
      <circle
        cx="18.037"
        cy="18.037"
        r="18.037"
        transform="matrix(-1 0 0 1 1135.5 144.296)"
        fill="#C2C2C2"
      />
      <circle
        cx="12.0247"
        cy="12.0247"
        r="8.52467"
        transform="matrix(-1 0 0 1 1129.48 150.308)"
        fill="#C2C2C2"
        stroke="#737373"
        stroke-width="7"
      />
      <circle
        cx="18.037"
        cy="18.037"
        r="18.037"
        transform="matrix(-1 0 0 1 1094.08 144.296)"
        fill="#C2C2C2"
      />
      <circle
        cx="12.0247"
        cy="12.0247"
        r="8.52467"
        transform="matrix(-1 0 0 1 1088.07 150.308)"
        fill="#C2C2C2"
        stroke="#737373"
        stroke-width="7"
      />
      <circle
        cx="18.037"
        cy="18.037"
        r="18.037"
        transform="matrix(-1 0 0 1 1052.66 144.296)"
        fill="#C2C2C2"
      />
      <circle
        cx="12.0247"
        cy="12.0247"
        r="8.52467"
        transform="matrix(-1 0 0 1 1046.65 150.308)"
        fill="#C2C2C2"
        stroke="#737373"
        stroke-width="7"
      />
      <path
        d="M748.036 163.001L761.051 144.296H893.26L909.701 163.001H748.036Z"
        fill="#737373"
      />
      <circle
        cx="18.037"
        cy="18.037"
        r="18.037"
        transform="matrix(-1 0 0 1 888.324 144.296)"
        fill="#C2C2C2"
      />
      <circle
        cx="12.0247"
        cy="12.0247"
        r="8.52467"
        transform="matrix(-1 0 0 1 882.312 150.308)"
        fill="#C2C2C2"
        stroke="#737373"
        stroke-width="7"
      />
      <circle
        cx="18.037"
        cy="18.037"
        r="18.037"
        transform="matrix(-1 0 0 1 846.905 144.296)"
        fill="#C2C2C2"
      />
      <circle
        cx="12.0247"
        cy="12.0247"
        r="8.52467"
        transform="matrix(-1 0 0 1 840.893 150.308)"
        fill="#C2C2C2"
        stroke="#737373"
        stroke-width="7"
      />
      <circle
        cx="18.037"
        cy="18.037"
        r="18.037"
        transform="matrix(-1 0 0 1 805.487 144.296)"
        fill="#C2C2C2"
      />
      <circle
        cx="12.0247"
        cy="12.0247"
        r="8.52467"
        transform="matrix(-1 0 0 1 799.475 150.308)"
        fill="#C2C2C2"
        stroke="#737373"
        stroke-width="7"
      />
      <path
        d="M1106.1 0H688.722C671.212 -6.08457e-05 671.212 8.01645 671.212 17.369C671.212 26.7215 670.945 139.466 670.945 152.98C670.945 163.001 682.661 165.547 697.477 165.547H750.709L764.07 145.951H890.329L909.702 165.547H997.883L1010.58 145.951H1139.51L1155.54 165.547H1248.4C1272.45 165.547 1315.87 149.377 1294.49 116.786C1273.11 84.1946 1138.17 0 1106.1 0Z"
        fill="white"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M1240.89 70.3345C1216.04 52.8463 1186.78 34.8081 1161.33 21.3779C1139.85 21.4095 1107.35 22.3108 1106.16 27.4469C1104.39 35.1408 1142.33 68.9118 1154.34 70.2272C1164.15 71.3027 1220.62 70.6195 1240.89 70.3345Z"
        fill="#B3EDFB"
      />
      <rect
        width="97.5334"
        height="49.4347"
        rx="10"
        transform="matrix(-1 0 0 1 1016.59 21.3774)"
        fill="#B3EDFB"
      />
      <rect
        width="97.5334"
        height="49.4347"
        rx="10"
        transform="matrix(-1 0 0 1 893.668 21.3774)"
        fill="#B3EDFB"
      />
      <path
        class="trainStripe"
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M1300.09 130.935C1299.61 126.624 1297.85 121.908 1294.49 116.786C1289.05 108.504 1276.28 96.8906 1259.73 84.1729H670.944V130.935H1300.09Z"
        fill="#00BD80"
      />
      <rect
        x="-1.5"
        y="-1.5"
        width="131.943"
        height="57.1233"
        rx="8.5"
        transform="matrix(0 -1 -1 0 745.036 153.321)"
        fill="white"
        stroke="#C2C2C2"
        stroke-width="3"
      />
      <rect
        width="70.8119"
        height="36.074"
        rx="5"
        transform="matrix(0 -1 -1 0 736.011 105.55)"
        fill="#B3EDFB"
      />
    </svg>

    <svg
      v-show="currentView?.type === 'bus'"
      id="busSvg"
      viewBox="0 0 899 280"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="busBody">
        <path
          class="busBodyColor"
          d="M68.7682 0H675.173C700.376 0 698.849 19.2121 698.849 19.2121V196.28C698.849 196.28 701.158 216.137 675.173 225.302C670.831 226.833 647.696 232.939 607.982 237.64H68.7682C41.2737 237.64 41.2738 232.294 41.2738 211.673C40.5101 157.193 41.2738 19.2121 41.2738 19.2121C41.2738 19.2121 41.2737 -2.87927e-06 68.7682 0Z"
          fill="#00C2E5"
        />
        <path
          class="busBodyColor"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M41.2537 210.165C53.1229 210.797 109.623 212.441 137.557 188.617C168.87 161.911 210.875 173.367 246.007 188.617C281.139 203.867 321.617 197.807 351.402 179.477C381.188 161.148 404.1 151.966 475.891 171.076C521.881 183.318 545.618 159.817 573.605 132.107C589.306 116.561 606.345 99.6915 629.402 87.0655C672.766 63.318 691.355 64.3468 698.849 67.5071V196.255C698.849 196.255 701.158 216.112 675.173 225.277C670.831 226.808 647.696 232.914 607.982 237.615H68.7682C41.2738 237.615 41.2738 232.269 41.2738 211.648C41.267 211.16 41.2603 210.666 41.2537 210.165Z"
          fill="#052FC2"
        />
        <rect
          width="161.912"
          height="116.088"
          rx="10"
          transform="matrix(-1 0 0 1 478.911 21.3845)"
          fill="#B3EDFB"
        />
        <rect
          width="161.912"
          height="116.088"
          rx="10"
          transform="matrix(-1 0 0 1 653.077 21.3845)"
          fill="#B3EDFB"
        />
        <rect
          width="161.912"
          height="116.088"
          rx="10"
          transform="matrix(-1 0 0 1 304.78 21.3845)"
          fill="#B3EDFB"
        />
        <path
          class="busBodyColor"
          d="M77.9998 9.5H9.2087C4.6263 10.0092 0.812202 12.9801 0.812202 20.923V52.2361C0.812202 61 13.282 64.4558 18.3735 64.4558V20.923H45.1042H77.9998V9.5Z"
          fill="#00C2E5"
        />
        <path
          d="M40.9995 165V122L41.2413 21H77.9995V146.714C77.9995 160.124 53.3328 164.492 40.9995 165Z"
          fill="#B3EDFB"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M41.1432 200H69.9902C75.3363 200 75.3363 216.038 69.9902 218.33C65.3303 220.327 46.1647 218.842 41.3207 218.428C41.2738 216.383 41.2738 214.137 41.2738 211.673V211.673C41.224 208.117 41.1806 204.206 41.1432 200Z"
          fill="#FFC736"
        />
        <path
          d="M682.065 180.241C682.065 180.241 682.065 193.989 698.867 193.989V152.365V106.923C682.065 106.923 682.065 122.961 682.065 122.961V152.365V180.241Z"
          fill="#FF3636"
        />
      </g>
      <g>
        <circle
          cx="41.4814"
          cy="41.4814"
          r="40.9814"
          transform="matrix(0 1 1 0 142.389 196.351)"
          fill="black"
          stroke="black"
        />
        <circle
          cx="17.5274"
          cy="17.5274"
          r="17.5274"
          transform="matrix(0 1 1 0 166.927 220.889)"
          fill="#CBCBCB"
        />
        <path
          class="wheel"
          d="M164.683 222.243C161.569 226.043 159.532 230.754 159.031 235.917H178.404L164.683 222.243ZM168.212 218.701L181.954 232.396V212.994C176.761 213.498 172.024 215.556 168.212 218.701ZM200.092 218.218C196.39 215.347 191.877 213.472 186.954 212.994V232.129L200.092 218.218ZM203.727 221.652L190.254 235.917H209.877C209.35 230.483 207.119 225.548 203.727 221.652ZM203.719 255.191C207.118 251.292 209.35 246.355 209.878 240.917H190.25L203.719 255.191ZM200.083 258.623L186.954 244.709V263.84C191.873 263.363 196.381 261.491 200.083 258.623ZM168.212 258.133C172.024 261.277 176.761 263.336 181.954 263.84V244.438L168.212 258.133ZM178.404 240.917H159.031C159.532 246.08 161.569 250.791 164.683 254.591L178.404 240.917Z"
          stroke="#CBCBCB"
          stroke-width="5"
        />
      </g>
      <g>
        <circle
          cx="41.4814"
          cy="41.4814"
          r="40.9814"
          transform="matrix(0 1 1 0 510.509 196.351)"
          fill="black"
          stroke="black"
        />
        <circle
          cx="17.5274"
          cy="17.5274"
          r="17.5274"
          transform="matrix(0 1 1 0 535.047 220.889)"
          fill="#CBCBCB"
        />
        <path
          class="wheel"
          d="M532.803 222.243C529.69 226.043 527.653 230.754 527.151 235.917H546.524L532.803 222.243ZM536.332 218.701L550.075 232.396V212.994C544.881 213.498 540.144 215.556 536.332 218.701ZM568.213 218.218C564.51 215.347 559.997 213.472 555.075 212.994V232.129L568.213 218.218ZM571.847 221.652L558.374 235.917H577.998C577.47 230.483 575.24 225.548 571.847 221.652ZM571.839 255.191C575.238 251.292 577.47 246.355 577.998 240.917H558.371L571.839 255.191ZM568.203 258.623L555.075 244.709V263.84C559.993 263.363 564.501 261.491 568.203 258.623ZM536.332 258.133C540.144 261.277 544.881 263.336 550.075 263.84V244.438L536.332 258.133ZM546.524 240.917H527.151C527.653 246.08 529.69 250.791 532.803 254.591L546.524 240.917Z"
          stroke="#CBCBCB"
          stroke-width="5"
        />
      </g>
      <path
        id="cloudBig"
        d="M833.888 151.425C851.116 124.394 877.915 151.634 872.811 168.398C893.867 165.255 918.114 180.97 875.363 194.172C900.886 228.118 849.202 241.319 833.888 211.145C817.937 228.747 794.115 222.67 802.623 197.315C763.701 178.456 806.451 119.993 833.888 151.425Z"
        fill="white"
      />
      <path
        id="cloudSmall"
        d="M750.956 202.621C760.493 186.955 775.328 202.743 772.502 212.458C784.159 210.636 797.581 219.744 773.915 227.395C788.044 247.068 759.433 254.719 750.956 237.232C742.126 247.433 728.939 243.911 733.648 229.217C712.102 218.287 735.768 184.405 750.956 202.621Z"
        fill="white"
      />
    </svg>
  </div>
</template>
