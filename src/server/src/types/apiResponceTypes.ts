export interface Route {
  shortName: string;
  longName: string;
}

export interface Trip {
  route: Route;
}

export interface Stoptime {
  trip: Trip;
  headsign: string;
  serviceDay: number;
  realtimeDeparture: number;
  realtime: boolean;
}

export interface BusLocation {
  name: string;
  stoptimesWithoutPatterns: Stoptime[];
}

export interface OriginalData {
  [key: string]: BusLocation;
}

export interface ApiResponse {
  data: OriginalData;
}

export interface DigiTrafficResponce {
  data: {
    trainsByStationAndQuantity: Train[];
  };
}

interface Train {
  commuterLineid: string;
  trainType: {
    name: string;
  };
  cancelled: boolean;
  trainNumber: number;
  departureDate: string;
  timeTableRows: TimeTableRow[];
}

interface TimeTableRow {
  station: Name;
  type: string;
  scheduledTime: string;
  liveEstimateTime: string | null;
  differenceInMinutes: number | null;
  actualTime: number | null;
  commercialTrack: string;
}

interface Name {
  name: string;
  shortCode: string;
}

export interface WeatherResponse {
  main: {
    temp: number;
  };
  weather: {
    icon: string;
  }[];
}
