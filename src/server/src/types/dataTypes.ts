/* eslint-disable @typescript-eslint/no-explicit-any */
export interface TripDetails {
  departureTime?: any;
  cancelled?: boolean;
  commercialTrack?: any;
  delayed?: boolean;
  liveEstimateTime?: any;
  id?: string | number | symbol | undefined;

  destinationName: string;
  shortName: string;
  minutesToDeparture: number | string;
  realtime: boolean;
  fullDepartureTime: Date | string;
}

export interface Destination {
  title: string;
  trips: TripDetails[];
}

export type TransformedData = {
  type: string;
  content: Destination[];
} | null;

export interface TrainStation {
  title: string;
  trips: Trip[];
}

export interface Trip {
  destinationName: string;
  shortName: string;
  commercialTrack: string;
  delayed: boolean;
  departureTime: string;
  liveEstimateTime: string;
  minutesToDeparture: number;
  cancelled: boolean;
}

export type OutputTrip = {
  destinationName: string;
  shortName: string;
  commercialTrack: string;
  delayed: boolean;
  departureTime: string;
  liveEstimateTime: string;
  minutesToDeparture: number;
  fullDepartureTime: string;
};

export type OutputContent = {
  type: string;
  content: {
    title: string;
    trips: OutputTrip[];
  }[];
} | null;

export type finalJson = {
  viewChangeIntervalSeconds: number;
  location: string;
  theme: string;
  weather: weatherOut;
  refreshNeeded: boolean;
  views: (TransformedData | OutputContent)[];
};

export type weatherOut = {
  temperature: number | string;
  icon: string;
} | null;
