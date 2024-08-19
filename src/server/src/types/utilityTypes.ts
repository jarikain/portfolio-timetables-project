import { LocationCity, LocationId, UpdateInterval } from './cacheTypes.js';

export type BusApiParams = {
  ids: string[];
  trips: number[];
  titles: string[];
  viewIds: number[]; // [1, 1, 2]
};
export type TrainApiParams = {
  id: string;
  name: string;
  trips: number;
  title: string;
};
export type LocationSettings = {
  locationId: LocationId;
  updateInterval: UpdateInterval;
  city: LocationCity;
  train: TrainApiParams | null;
  bus: BusApiParams | null;
  theme: 'LAB' | 'LUT';
};
