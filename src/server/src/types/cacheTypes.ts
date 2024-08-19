import { ViewType } from '../models/infoscreen.js';
import { ApiResponse, DigiTrafficResponce } from './apiResponceTypes.js';
import { weatherOut } from './dataTypes.js';
import { LocationSettings } from './utilityTypes.js';

export interface ICache {
  getLongTerm(key: LocationId): CacheValue | undefined;
  getShortTerm(key: LocationId): CacheValue | undefined;
  setLongTerm(key: LocationId, value: CacheValue): void;
  setShortTerm(key: LocationId, value: CacheValue): void;
}

export type ViewContent = {
  content: ApiResponse | DigiTrafficResponce | null;
  title: ViewTitle | null | undefined;
};

export type ViewTitle = string[] | string;
export type LocationId = number;
export type UpdateInterval = number;
export type LocationCity = string;

export type CacheValue = {
  [key in ViewType]?: ViewContent;
} & {
  timestamp: Date;
  updateInterval: UpdateInterval;
  locationSettings: LocationSettings;
  weather: weatherOut | null;
};

export interface CachedData {
  updateInterval: number;
  formattedLocation?: {
    train?: { trips: number };
    bus?: { trips: number };
  };
  train?: {
    content: DigiTrafficResponce;
    title: string;
  };
  bus?: {
    content: ApiResponse;
    title: string[];
  };
}
